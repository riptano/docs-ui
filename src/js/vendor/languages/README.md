# Syntax highlighting grammars

`highlight.bundle.js` registers these grammars with highlight.js 9.18.3, alongside the ones highlight.js ships.
They are maintained outside this repository, so lint and format skip this folder (see `glob.js` in `gulpfile.js`).

| File | Language | Source | License |
|---|---|---|---|
| `cql.js` | CQL and cqlsh (`cql`, `cqlsh`) | `dist/cql.cjs` of [highlightjs-cql](https://github.com/eric-schneider/highlightjs-cql) 1.0.0 | Apache-2.0 |
| `graphql.js` | GraphQL (`graphql`, `gql`) | Ported from highlight.js 11.12.0 `src/languages/graphql.js`, which highlight.js 9 lacks | BSD-3-Clause |

The license notice at the top of `highlight.bundle.js` survives minification, so it appears in the published `js/vendor/highlight.bundle.js`.

## Updating

- **CQL.** Copy `dist/cql.cjs` from a highlightjs-cql release to `cql.js`, and update its version in the notice at the top of `highlight.bundle.js`.
- **GraphQL.** If you move to highlight.js 11, remove `graphql.js` and register `highlight.js/lib/languages/graphql` instead. To refresh the port from a newer highlight.js release, apply the changes its header lists.
