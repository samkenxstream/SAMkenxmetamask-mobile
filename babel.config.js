// Borrowing from metro-react-native-babel-preset
// This is a work in progress:
//   Plugins may be removed or added during this PR work.
const lazyImports = require('metro-react-native-babel-preset/src/configs/lazy-imports');

function isTypeScriptSource(fileName) {
  return !!fileName && fileName.endsWith(".ts");
}

function isTSXSource(fileName) {
  return !!fileName && fileName.endsWith(".tsx");
}

module.exports = {
  comments: false,
  compact: true,
  overrides: [
    {
      plugins: [
        // TODO
        // Check whether we need all this plugins
        // within this block
        '@babel/plugin-transform-flow-strip-types',
        '@babel/plugin-syntax-flow',
        '@babel/plugin-transform-block-scoping',
        ['@babel/plugin-proposal-class-properties', {
           loose: true,
        }],
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-syntax-export-default-from',

        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-proposal-optional-chaining',

        '@babel/plugin-transform-unicode-regex',
      ]
    },
    {
      test: isTypeScriptSource,
      plugins: [
        [
          '@babel/plugin-transform-typescript',
          {
            isTSX: false,
            allowNamespaces: true
          }
        ]
      ]
    },
    {
      test: isTSXSource,
      plugins: [
        [
          '@babel/plugin-transform-typescript',
          {
            isTSX: true,
            allowNamespaces: true
          }
        ]
      ]
    },
    {
      plugins: [
        '@babel/plugin-transform-react-jsx',
        '@babel/plugin-proposal-export-default-from',
        [
          '@babel/plugin-transform-modules-commonjs',
          {
            strict: false,
            strictMode: false,
            lazy: importSpecifier => lazyImports.has(importSpecifier),
            allowTopLevelThis: true
          }
        ],
        '@babel/plugin-transform-classes',

        'transform-inline-environment-variables',
        'react-native-reanimated/plugin'
      ]
    }
  ]
};
