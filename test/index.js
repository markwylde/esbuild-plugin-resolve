const fs = require('fs');
const test = require('basictap');
const esbuild = require('esbuild');

const resolve = require('../');

const clean = string => string.replace(/[ ,\n]/g, '')

test('simple resolution', async t => {
  t.plan(1);

  await esbuild.build({
    entryPoints: ['./test/simple/index.js'],
    bundle: true,
    outfile: './test/simple/index.built.js',
    plugins: [resolve({
      test: '../shared/importable'
    })]
  })

  const result = await fs.promises.readFile('./test/simple/index.built.js', 'utf8');

  t.equal(clean(result), clean(`
    (() => {
      // test/shared/importable.js
      function importable_default() {
        return "got here ok";
      }
    
      // test/simple/index.js
      console.log(importable_default);
    })();  
  `));
})

test('external resolution', async t => {
  t.plan(1);

  await esbuild.build({
    entryPoints: ['./test/simple/index.js'],
    bundle: true,
    outfile: './test/simple/index.built.js',
    plugins: [resolve({
      test: 'routemeup'
    })]
  })

  const result = await fs.promises.readFile('./test/simple/index.built.js', 'utf8');

  t.ok(result.includes('stringToRegexp'));
})