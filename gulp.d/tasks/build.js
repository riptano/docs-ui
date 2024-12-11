'use strict'

const autoprefixer = require('autoprefixer')
const browserify = require('browserify')
const concat = require('gulp-concat')
const cssnano = require('cssnano')
const fs = require('fs-extra')
const imagemin = require('gulp-imagemin')
const merge = require('merge-stream')
const ospath = require('path')
const path = ospath.posix
const postcss = require('gulp-postcss')
const postcssCalc = require('postcss-calc')
const gulpif = require('gulp-if')
const postcssAdvancedVars = require('postcss-advanced-variables')
const postcssImport = require('postcss-import')
const tailwindcss = require('tailwindcss')
const tailwindcssNesting = require('tailwindcss/nesting')
const postcssUrl = require('postcss-url')
const postcssVar = require('postcss-custom-properties')
const { Transform } = require('stream')
const map = (transform) => new Transform({ objectMode: true, transform })
const through = () => map((file, enc, next) => next(null, file))
const uglify = require('gulp-uglify')
const vfs = require('vinyl-fs')
const hash = require('gulp-hash')
const tailwindconfig = require('../lib/preview.tailwind.config')

module.exports = (src, dest, preview) => () => {
  const opts = { base: src, cwd: src }
  const sourcemaps = preview || process.env.SOURCEMAPS === 'true'
  const postcssPlugins = [
    postcssImport,
    (css, { messages, opts: { file } }) =>
      Promise.all(
        messages
          .reduce((accum, { file: depPath, type }) => (type === 'dependency' ? accum.concat(depPath) : accum), [])
          .map((importedPath) => fs.stat(importedPath).then(({ mtime }) => mtime))
      ).then((mtimes) => {
        const newestMtime = mtimes.reduce((max, curr) => (!max || curr > max ? curr : max), file.stat.mtime)
        if (newestMtime > file.stat.mtime) file.stat.mtimeMs = +(file.stat.mtime = newestMtime)
      }),
    postcssUrl([
      {
        filter: (asset) => new RegExp('.+[.](?:ttf|woff2?)(?:\\?[^\\s]*)?$').test(asset.url),
        url: (asset) => {
          let relpath = asset.pathname
          if (relpath.includes('lucide')) relpath = `lucide-static/font/${relpath}`
          if (relpath.includes('~@fontsource')) relpath = relpath.replace('~', '')
          const abspath = require.resolve(relpath)
          const basename = ospath.basename(abspath)
          const destpath = ospath.join(dest, 'font', basename)
          if (!fs.pathExistsSync(destpath)) fs.copySync(abspath, destpath)
          return path.join('..', 'font', basename)
        },
      },
    ]),
    tailwindcssNesting,
    // only run tailwindcss in preview, datastax-docs-site repo has it's own tailwind cli step
    preview ? tailwindcss(tailwindconfig) : () => {},
    postcssAdvancedVars,
    postcssVar({ preserve: true }),
    preview ? postcssCalc : () => {}, // cssnano already applies postcssCalc
    autoprefixer,
    preview
      ? () => {}
      : (css, result) => cssnano({ preset: 'default' })(css, result).then(() => postcssPseudoElementFixer(css, result)),
  ]

  return merge(
    vfs.src('ui.yml', { ...opts, allowEmpty: true }),
    vfs
      .src('js/+([0-9])-*.js', { ...opts, read: false, sourcemaps })
      .pipe(bundle(opts))
      .pipe(uglify({ output: { comments: /^! / } }))
      // NOTE concat already uses stat from newest combined file
      .pipe(concat('js/site.js'))
      .pipe(gulpif(!preview, hash({ template: '<%= name %>-<%= hash %><%= ext %>' })))
      .pipe(vfs.dest(dest))
      .pipe(gulpif(!preview, hash.manifest('assets-manifest.json', { append: true })))
      .pipe(vfs.dest(dest)),
    vfs
      .src('js/vendor/*([^.])?(.bundle).js', { ...opts, read: false })
      .pipe(bundle(opts))
      // .pipe(uglify({ output: { comments: /^! / } }))
      .pipe(map((file) => file.relative === 'js/vendor/floatingui.js')
        ? through() : uglify({ output: { comments: /^! / } }))
      .pipe(gulpif(!preview, hash({ template: '<%= name %>-<%= hash %><%= ext %>' })))
      .pipe(vfs.dest(dest))
      .pipe(gulpif(!preview, hash.manifest('assets-manifest.json', { append: true })))
      .pipe(vfs.dest(dest)),
    vfs
      .src('js/vendor/*.min.js', opts)
      .pipe(map((file, enc, next) => next(null, Object.assign(file, { extname: '' }, { extname: '.js' }))))
      .pipe(gulpif(!preview, hash({ template: '<%= name %>-<%= hash %><%= ext %>' })))
      .pipe(vfs.dest(dest))
      .pipe(gulpif(!preview, hash.manifest('assets-manifest.json', { append: true })))
      .pipe(vfs.dest(dest)),
    // NOTE use the next line to bundle a JavaScript library that cannot be browserified, like jQuery
    //vfs.src(require.resolve('<package-name-or-require-path>'), opts).pipe(concat('js/vendor/<library-name>.js')),
    vfs.src('./tailwind.config.js').pipe(concat('js/tailwind.config.js')),
    vfs
      .src(['css/site.css', 'css/vendor/*.css'], { ...opts, sourcemaps })
      .pipe(postcss((file) => ({ plugins: postcssPlugins, options: { file } })))
      .pipe(gulpif(!preview, hash({ template: '<%= name %>-<%= hash %><%= ext %>' })))
      .pipe(vfs.dest(dest))
      .pipe(gulpif(!preview, hash.manifest('assets-manifest.json', { append: true })))
      .pipe(vfs.dest(dest)),
    vfs.src('font/*.{ttf,woff*(2)}', opts),
    vfs.src('img/**/*.{gif,ico,jpg,png,svg}', opts).pipe(
      preview
        ? through()
        : imagemin(
          [
            imagemin.gifsicle(),
            imagemin.jpegtran(),
            imagemin.optipng(),
            imagemin.svgo({
              plugins: [
                { cleanupIDs: { preservePrefixes: ['icon-', 'view-'] } },
                { removeViewBox: false },
                { removeDesc: false },
              ],
            }),
          ].reduce((accum, it) => (it ? accum.concat(it) : accum), [])
        )
    ),
    vfs.src('helpers/*.js', opts),
    vfs.src('layouts/*.hbs', opts),
    vfs.src('partials/*.hbs', opts),
    vfs.src('static/**/*[!~]', { ...opts, base: ospath.join(src, 'static'), dot: true })
  ).pipe(vfs.dest(dest, { sourcemaps: sourcemaps && '.' }))
}

function bundle ({ base: basedir, ext: bundleExt = '.bundle.js' }) {
  return map((file, enc, next) => {
    if (bundleExt && file.relative.endsWith(bundleExt)) {
      const mtimePromises = []
      const bundlePath = file.path
      browserify(file.relative, { basedir, detectGlobals: false })
        .plugin('browser-pack-flat/plugin')
        .on('file', (bundledPath) => {
          if (bundledPath !== bundlePath) mtimePromises.push(fs.stat(bundledPath).then(({ mtime }) => mtime))
        })
        .bundle((bundleError, bundleBuffer) =>
          Promise.all(mtimePromises).then((mtimes) => {
            const newestMtime = mtimes.reduce((max, curr) => (curr > max ? curr : max), file.stat.mtime)
            if (newestMtime > file.stat.mtime) file.stat.mtimeMs = +(file.stat.mtime = newestMtime)
            if (bundleBuffer !== undefined) file.contents = bundleBuffer
            next(bundleError, Object.assign(file, { path: file.path.slice(0, file.path.length - 10) + '.js' }))
          })
        )
      return
    }
    fs.readFile(file.path, 'UTF-8').then((contents) => {
      next(null, Object.assign(file, { contents: Buffer.from(contents) }))
    })
  })
}

function postcssPseudoElementFixer (css, result) {
  css.walkRules(/(?:^|[^:]):(?:before|after)/, (rule) => {
    rule.selector = rule.selectors.map((it) => it.replace(/(^|[^:]):(before|after)$/, '$1::$2')).join(',')
  })
}
