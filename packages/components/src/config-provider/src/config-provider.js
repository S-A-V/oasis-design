import { defineComponent, renderSlot } from 'vue';
import { provideGlobalConfig } from './hooks/use-global-config';

const ConfigProvider = defineComponent({
  name: 'WConfigProvider',
  props: {
    env: {
      type: Object,
      default: undefined,
      required: true,
    },
    commonMenus: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { slots }) {
    const config = provideGlobalConfig(props);
    return () => renderSlot(slots, 'default', { config: config?.value });
  },
});

export default ConfigProvider;
