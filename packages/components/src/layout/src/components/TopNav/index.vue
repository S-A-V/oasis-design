<template>
  <el-menu :default-active="activeMenu" mode="horizontal" :ellipsis="false" @select="handleSelect">
    <template v-for="(item, index) in topMenus">
      <el-menu-item v-if="index < visibleNumber" :key="index" :index="item.path">
        <w-svg-icon
          v-if="item.meta && item.meta.icon && item.meta.icon !== '#'"
          :name="item.meta.icon"
        />
        {{ item.meta.title }}
      </el-menu-item>
    </template>

    <!-- 顶部菜单超出数量折叠 -->
    <el-sub-menu v-if="topMenus.length > visibleNumber" index="more">
      <template #title>更多菜单</template>
      <template v-for="(item, index) in topMenus">
        <el-menu-item v-if="index >= visibleNumber" :key="index" :index="item.path">
          <w-svg-icon
            v-if="item.meta && item.meta.icon && item.meta.icon !== '#'"
            :name="item.meta.icon"
            :style="{ marginRight: '6px' }"
          />
          {{ item.meta.title }}
        </el-menu-item>
      </template>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, getCurrentInstance, toRef } from 'vue';
import { ElMenu, ElMenuItem, ElSubMenu } from 'element-plus';
import { useGlobalConfig } from '@way-ui/hooks';
import { WSvgIcon } from '../../../../svg-icon';
import { $validator } from '@way-ui/plugins';

defineOptions({
  name: 'TopNav',
});

const instance = getCurrentInstance();
const { $router } = instance.appContext.config.globalProperties;
const router = toRef($router);
// 顶部栏初始数
const visibleNumber = ref(null);
// 当前激活菜单的 index
const currentIndex = ref(null);

// 顶部显示菜单
const topMenus = computed(() => {
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

// 默认激活的菜单
const activeMenu = computed(() => {
  const path = router.value.currentRoute.path;
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
  if ($validator.isHttp(key)) {
    // http(s):// 路径新窗口打开
    window.open(key, '_blank');
  } else {
    if (route && route.query) {
      let query = JSON.parse(route.query);
      router.value.push({ path: key, query: query });
    } else {
      router.value.push({ path: key });
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
// .top-nav-container.el-menu--horizontal > .el-menu-item.is-active,
// .el-menu--horizontal > .el-sub-menu.is-active .el-submenu__title {
// color: #{'var(--theme)'} !important;

// color: #303133;
// border-color: #{'var(--theme)'};
// border-bottom: 1px solid #{'var(--theme)'} !important;

// .w-svg-icon {
//   color: var(--el-menu-active-color);
// }
// }

.top-nav-container {
  &.el-menu {
    height: unset;
    margin: 16px 0 0 14px;
    border-bottom: 0;
  }

  &.el-menu--horizontal {
    > .el-menu-item {
      float: left;
      height: 32px !important;
      padding: 0 16px !important;
      margin: 0 10px !important;
      line-height: 30px !important;

      // color: #101010 !important;
      border: 1px solid transparent;
      border-radius: 6px;

      .w-svg-icon {
        margin-right: 6px;
        font-size: 16px;
        color: #666;
      }

      &.is-active {
        background-color: var(--el-menu-hover-bg-color);
        border: 1px solid var(--el-menu-active-color);

        .w-svg-icon {
          color: var(--el-menu-active-color);
        }
      }

      &:not(.is-disabled):focus,
      &:not(.is-disabled):hover {
        .w-svg-icon {
          color: var(--el-menu-active-color);
        }
      }
    }

    > .el-submenu {
      .el-submenu__title:hover {
        .w-svg-icon {
          color: var(--el-menu-active-color);
        }
      }
    }

    > .el-sub-menu {
      .el-sub-menu__title {
        float: left;
        height: 32px !important;
        padding: 0 5px !important;
        margin: 0 10px !important;
        line-height: 32px !important;
        border-bottom-width: 0;

        // color: #999093 !important;
      }
    }

    .el-sub-menu {
      .el-sub-menu__icon-arrow {
        position: static;
        margin-top: 0;
        margin-left: 8px;
        vertical-align: middle;
      }
    }
  }
}
</style>
