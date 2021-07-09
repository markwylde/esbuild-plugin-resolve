# esbuild-plugin-resolve
Change where a module dependency is resolved/imported from.

## Installation
```
npm i --save-dev esbuild-plugin-resolve
```

## Usage
```javascript
import esbuild from 'esbuild';
import resolve from 'esbuild-plugin-resolve';

esbuild.build({
  entryPoints: ['./src/index.js'],
  bundle: true,
  outfile: tsOutfile,
  plugins: [resolve({
    test: 'test-two/lib/example'
  })]
});

// The following will be rewritten
import test from 'test'
import test from 'test-two/lib/example'
```
