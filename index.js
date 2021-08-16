function intercept (build, moduleName, moduleTarget) {
  const filter = new RegExp('^' + moduleName + '(?:\\/.*)?$');

  build.onResolve({ filter }, async (args) => {
    if (args.resolveDir === '') {
      return;
    }

    return {
      path: args.path,
      namespace: 'esbuild-resolve',
      pluginData: {
        resolveDir: args.resolveDir,
        moduleName
      }
    };
  });

  build.onLoad({ filter, namespace: 'esbuild-resolve' }, async (args) => {
    const importerCode = `
      export * from '${args.path.replace(args.pluginData.moduleName, moduleTarget)}';
      export { default } from '${args.path.replace(args.pluginData.moduleName, moduleTarget)}';
    `;
    return { contents: importerCode, resolveDir: args.pluginData.resolveDir };
  });
}

const EsbuildPluginResolve = (options) => ({
  name: 'esbuild-resolve',
  setup: (build) => {
    for (const moduleName of Object.keys(options)) {
      intercept(build, moduleName, options[moduleName]);
    }
  }
});

module.exports = EsbuildPluginResolve;
