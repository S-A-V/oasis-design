<script setup lang="ts">
const p = reactive({
  page: 1,
  pageSize: 10,
  total: 100,
})
</script>

<template>
  <w-pagination v-model:page="p.page" v-model:limit="p.pageSize" :total="p.total" />
</template>
