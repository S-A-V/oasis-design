import { defineComponent, renderSlot } from 'vue';
import { provideGlobalConfig } from '@way-ui/hooks';

const ConfigProvider = defineComponent({
  name: 'WConfigProvider',
  props: {
    env: {
      type: Object,
      default: undefined,
      required: true,
    },
    stores: {
      type: Object,
      required: true,
    },
    commonMenus: {
      type: Array,
      default: () => [],
    },
    assets: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { slots }) {
    const config = provideGlobalConfig(props);
    return () => renderSlot(slots, 'default', { config: config?.value });
  },
});

export default ConfigProvider;
