function resolveComponent(name, options) {
  if (options.exclude && name.match(options.exclude)) return;

  if (!name.match(/^W[A-Z]/)) return;

  return {
    name,
    from: 'way-ui',
  };
}

function resolveDirective(name, options) {
  if (!options.directives) return;

  const directives = {
    CopyText: { importName: 'VCopyText' },
    Permission: { importName: 'VPermission' },
    RolePermission: { importName: 'VRolePermission' },
  };

  const directive = directives[name];
  if (!directive) return;

  return {
    name: directive.importName,
    from: 'way-ui',
  };
}

export function WayUIResolver(options = {}) {
  let optionsResolved;

  function resolveOptions() {
    if (optionsResolved) return optionsResolved;
    optionsResolved = {
      directives: true,
      exclude: undefined,
      ...options,
    };
    return optionsResolved;
  }

  return [
    {
      type: 'component',
      resolve: (name) => {
        return resolveComponent(name, resolveOptions());
      },
    },
    {
      type: 'directive',
      resolve: (name) => {
        return resolveDirective(name, resolveOptions());
      },
    },
  ];
}
