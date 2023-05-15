function intercept (build, moduleName, moduleTarget) {
  const filter = new RegExp('^' + moduleName.replace(/[\^$\\.*+?()[\]{}|]/g, '\\$&') + '(?:\\/.*)?$');

  build.onResolve({ filter, namespace: 'file' }, async (args) => {
    const external = Boolean(build.initialOptions.external?.includes(args.path));

    if (external) {
      return { path: args.path, external };
    }

    if (args.resolveDir === '') {
      return;
    }

    return build.resolve(args.path.replace(moduleName, moduleTarget), { kind: args.kind, resolveDir: args.resolveDir });
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

export default EsbuildPluginResolve;
