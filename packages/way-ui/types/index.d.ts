export * from '@way-ui/components';
export * from '@way-ui/directives';
export * from '@way-ui/hooks';
export * from '@way-ui/plugins';

declare const installer: (typeof import('../src/defaults'))['default'];
export default installer;
export declare const WayUIPlugins: (typeof import('../src/defaults'))['pluginInstaller'];
