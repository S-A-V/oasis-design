import { makeInstaller } from './make-installer';
import Components from './component';
import Directives from './directive';
import Plugins from './plugin';

export default makeInstaller([...Components, ...Directives, ...Plugins]);
