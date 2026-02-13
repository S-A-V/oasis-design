<template>
  <inner-link
    v-for="(item, index) in tagsViewStore.iframeViews"
    v-show="route.path === item.path"
    :key="item.path"
    :iframe-id="'iframe' + index"
    :src="iframeUrl(item.meta.link, item.query)"
  ></inner-link>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useTabbarStore as useTagsViewStore } from '@way-ui/stores';
import InnerLink from '../InnerLink/index.vue';

const route = useRoute();
const tagsViewStore = useTagsViewStore();

function iframeUrl(url, query) {
  if (Object.keys(query).length > 0) {
    let params = Object.keys(query)
      .map((key) => key + '=' + query[key])
      .join('&');
    return url + '?' + params;
  }
  return url;
}
</script>
