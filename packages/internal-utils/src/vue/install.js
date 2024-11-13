export const withInstall = (comp) => {
  comp.install = (app) => {
    app.component(comp.name, comp);
  };

  return comp;
};

export const withInstallFunction = (fn, name) => {
  fn.install = (app) => {
    fn._context = app._context;
    app.config.globalProperties[name] = fn;
  };

  return fn;
};

export const withInstallDirective = (directive, name) => {
  directive.install = (app) => {
    app.directive(name, directive);
  };

  return directive;
};
