/*
 * GraphQL grammar for highlight.js 9, ported from highlight.js 11.12.0
 * (src/languages/graphql.js; Language: GraphQL; Author: John Foster (GH jf990), and others).
 *
 * The port changes only what highlight.js 9 needs: `scope` becomes `className`, `match`
 * becomes `begin`, keyword lists are strings, the name-before-colon pattern is written out
 * instead of built with `hljs.regex`, and the two `illegal` patterns are combined into one.
 *
 * BSD 3-Clause License
 *
 * Copyright (c) 2006, Ivan Sagalaev.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 *
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * * Neither the name of the copyright holder nor the names of its
 *   contributors may be used to endorse or promote products derived from
 *   this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
'use strict'

module.exports = function graphql (hljs) {
  return {
    name: 'GraphQL',
    aliases: ['gql'],
    case_insensitive: true,
    disableAutodetect: false,
    keywords: {
      keyword: 'query mutation subscription type input schema directive interface union scalar fragment enum on',
      literal: 'true false null',
    },
    contains: [
      hljs.HASH_COMMENT_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.NUMBER_MODE,
      {
        className: 'punctuation',
        begin: /[.]{3}/,
        relevance: 0,
      },
      {
        className: 'punctuation',
        begin: /[\!\(\)\:\=\[\]\{\|\}]{1}/, // eslint-disable-line no-useless-escape
        relevance: 0,
      },
      {
        className: 'variable',
        begin: /\$/,
        end: /\W/,
        excludeEnd: true,
        relevance: 0,
      },
      {
        className: 'meta',
        begin: /@\w+/,
        excludeEnd: true,
      },
      {
        className: 'symbol',
        begin: /[_A-Za-z][_0-9A-Za-z]*(?=\s*:)/,
        relevance: 0,
      },
    ],
    illegal: /[;<']|BEGIN/,
  }
}
