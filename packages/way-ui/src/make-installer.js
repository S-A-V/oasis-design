import { provideGlobalConfig } from '@way-ui/components/src/config-provider';
import { INSTALLED_KEY } from './constants';

export const makeInstaller = (components = []) => {
  const install = (app, options) => {
    if (app[INSTALLED_KEY]) return;

    app[INSTALLED_KEY] = true;
    components.forEach((c) => app.use(c));

    if (options) provideGlobalConfig(options, app, true);
  };

  return install;
};
