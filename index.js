function intercept (build, moduleName, moduleTarget) {
  const filter = new RegExp('^' + moduleName + '$');

  build.onResolve({ filter }, async (args) => {
    if (args.resolveDir === '') {
      return;
    }

    return {
      path: args.path,
      namespace: 'esbuild-resolve',
      pluginData: {
        resolveDir: args.resolveDir,
      },
    };
  });

  build.onLoad({ filter, namespace: 'esbuild-resolve' }, async (args) => {
    let importerCode = `
      export * from '${moduleTarget}';
      export { default } from '${moduleTarget}';
    `;

    return { contents: importerCode, resolveDir: args.pluginData.resolveDir };
  });
}

const EsbuildPluginResolve = (options) => ({
    name: 'esbuild-resolve',
    setup: (build) => {
      for (let moduleName of Object.keys(options)) {
        intercept(build, moduleName, options[moduleName])
      }
    },
  });
  
module.exports = EsbuildPluginResolve;