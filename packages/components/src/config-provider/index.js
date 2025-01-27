import { withInstall } from '@way-ui/internal-utils';
import ConfigProvider from './src/config-provider.js';

export const WConfigProvider = withInstall(ConfigProvider);

export * from './src/constants';
export * from './src/hooks/use-global-config';
