import { computed, getCurrentInstance, inject, provide, ref, unref } from 'vue';

const globalConfig = ref();

export const configProviderContextKey = Symbol('WAY_UI_CONFIG_PROVIDER_CONTEXT');

export function useGlobalConfig(key, defaultValue = undefined) {
  const config = getCurrentInstance()
    ? inject(configProviderContextKey, globalConfig)
    : globalConfig;
  if (key) {
    return computed(() => config.value?.[key] ?? defaultValue);
  } else {
    return config;
  }
}

export const provideGlobalConfig = (config, app, global = false) => {
  const inSetup = !!getCurrentInstance();

  const provideFn = app?.provide ?? (inSetup ? provide : undefined);
  if (!provideFn) {
    console.warn('provideGlobalConfig() can only be used inside setup().');
    return;
  }

  const context = computed(() => {
    const cfg = unref(config);
    return cfg;
  });

  provideFn(configProviderContextKey, context);

  if (global || !globalConfig.value) {
    // eslint-disable-next-line vue/no-ref-object-reactivity-loss
    globalConfig.value = context.value;
  }

  return context;
};
