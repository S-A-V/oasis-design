<template>
  <!--
  <w-layout />
  -->
  <w-layout-jm :nav-bar-options="navBarOptions" />
</template>

<script setup lang="ts">
defineOptions({
  name: 'PageLayout',
})

const navBarOptions = ref([
  {
    icon: 'refresh'
  },
  {
    icon: 'setting',
    action: () => {
      console.log('setting clicked')
    }
  },
])
</script>
