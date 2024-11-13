<template>
  <el-menu :default-active="activeMenu" mode="horizontal" :ellipsis="false" @select="handleSelect">
    <template v-for="(item, index) in topMenus">
      <el-menu-item
        v-if="index < visibleNumber"
        :key="index"
        :style="{ '--theme': theme }"
        :index="item.path"
      >
        <svg-icon
          v-if="item.meta && item.meta.icon && item.meta.icon !== '#'"
          :icon-class="item.meta.icon"
        />
        {{ item.meta.title }}
      </el-menu-item>
    </template>

    <!-- 顶部菜单超出数量折叠 -->
    <el-sub-menu v-if="topMenus.length > visibleNumber" :style="{ '--theme': theme }" index="more">
      <template #title>更多菜单</template>
      <template v-for="(item, index) in topMenus">
        <el-menu-item v-if="index >= visibleNumber" :key="index" :index="item.path">
          <svg-icon
            v-if="item.meta && item.meta.icon && item.meta.icon !== '#'"
            :icon-class="item.meta.icon"
          />
          {{ item.meta.title }}
        </el-menu-item>
      </template>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useSettingsStore from '@/store/modules/settings';

defineOptions({
  name: 'TopNav',
});

const { proxy } = getCurrentInstance();
// 顶部栏初始数
const visibleNumber = ref(null);
// 当前激活菜单的 index
const currentIndex = ref(null);

const settingsStore = useSettingsStore();
const route = useRoute();
const router = useRouter();

// 主题颜色
const theme = computed(() => settingsStore.theme);

// 顶部显示菜单
const topMenus = computed(() => {
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
  return topMenus;
});

// 默认激活的菜单
const activeMenu = computed(() => {
  const path = route.path;
  let activePath = path;
  return activePath;
});

function setVisibleNumber() {
  const width = document.body.getBoundingClientRect().width / 3;
  visibleNumber.value = parseInt(width / 85);
}

function handleSelect(key, keyPath) {
  currentIndex.value = key;
  const route = topMenus.value.find((item) => item.path === key);
  if (proxy.$validator.isHttp(key)) {
    // http(s):// 路径新窗口打开
    window.open(key, '_blank');
  } else {
    if (route && route.query) {
      let query = JSON.parse(route.query);
      router.push({ path: key, query: query });
    } else {
      router.push({ path: key });
    }
  }
}

onMounted(() => {
  window.addEventListener('resize', setVisibleNumber);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', setVisibleNumber);
});

onMounted(() => {
  setVisibleNumber();
});
</script>

<style lang="scss">
.top-nav-container {
  &.el-menu {
    height: unset;
    margin: 16px 0 0 14px;
    border-bottom: 0;
  }

  &.el-menu--horizontal > .el-menu-item {
    float: left;
    height: 32px !important;
    padding: 0 16px !important;
    margin: 0 10px !important;
    line-height: 30px !important;
    color: #101010 !important;
    border: 1px solid transparent;
    border-radius: 6px;
  }
}

.top-nav-container.el-menu--horizontal > .el-menu-item.is-active,
.el-menu--horizontal > .el-sub-menu.is-active .el-submenu__title {
  color: #{'var(--theme)'} !important;

  // color: #303133;
  border-color: #{'var(--theme)'};
  border-bottom: 1px solid #{'var(--theme)'} !important;

  .svg-icon {
    color: #{'var(--theme)'};
  }
}

/* sub-menu item */
.top-nav-container.el-menu--horizontal > .el-sub-menu .el-sub-menu__title {
  float: left;
  height: 50px !important;
  padding: 0 5px !important;
  margin: 0 10px !important;
  line-height: 50px !important;
  color: #999093 !important;
}

/* 背景色隐藏 */
.top-nav-container.el-menu--horizontal > .el-menu-item:not(.is-disabled):focus,
.top-nav-container.el-menu--horizontal > .el-menu-item:not(.is-disabled):hover,
.top-nav-container.el-menu--horizontal > .el-submenu .el-submenu__title:hover {
  background-color: #fff !important;
}

/* 图标右间距 */
.top-nav-container .svg-icon {
  margin-right: 6px;
  color: #666;
}

/* topmenu more arrow */
.top-nav-container .el-sub-menu .el-sub-menu__icon-arrow {
  position: static;
  margin-top: 0;
  margin-left: 8px;
  vertical-align: middle;
}
</style>
