<template>
  <div class="menu-wrapper">
    <menu-button
      v-for="(item, index) in commonMenus"
      :key="index"
      :icon="item.meta && item.meta.icon ? item.meta.icon : ''"
      :text="item.meta.title"
      :active="isActive(item)"
      :style="{ marginRight: '6px' }"
      @click="handleClick(item)"
    />
  </div>
</template>

<script setup>
import { ref, computed, getCurrentInstance, toRef } from 'vue';
import { useGlobalConfig } from '@way-ui/hooks';
import { $validator } from '@way-ui/plugins';
import MenuButton from '../menu-button.vue';

defineOptions({ name: 'CommonMenus' });

const instance = getCurrentInstance();
const { $router } = instance.appContext.config.globalProperties;
const router = toRef($router);

const commonMenus = computed(() => {
  /**
   *
  let topMenus = [
    {
      name: 'Index',
      path: '/index',
      meta: { title: '首页', icon: 'dashboard' },
    },
    {
      name: 'Gen',
      path: '/tool/gen',
      meta: { title: '代码生成', icon: 'code' },
      parentPath: '/tool',
    },
    {
      name: 'Http://localhost:8080/swagger-ui/index.html',
      path: 'http://localhost:8080/swagger-ui/index.html',
      meta: { title: '系统接口', icon: 'swagger' },
      parentPath: '/tool',
    },
  ];
   */
  return useGlobalConfig('commonMenus').value || [];
});

const isActive = (item) => {
  const currentPath = router.value.currentRoute.path;
  return item.path === currentPath;
};

function handleClick(item) {
  const { path } = item;
  const route = commonMenus.value.find((item) => item.path === path);
  if ($validator.isHttp(path)) {
    // http(s):// 路径新窗口打开
    window.open(path, '_blank');
  } else {
    if (route && route.query) {
      let query = JSON.parse(route.query);
      router.value.push({ path, query: query });
    } else {
      router.value.push({ path });
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-wrapper {
  display: flex;
  align-items: center;
}
</style>
