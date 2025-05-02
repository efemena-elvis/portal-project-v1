<template>
  <PageContentWrapper>
    <template v-slot:pageContent>
      <!-- TAB BAR -->
      <TabBar />

      <!-- MAIN CONTENT -->
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </template>
  </PageContentWrapper>
</template>

<script setup lang="ts">
import { PageContentWrapper, TabBar } from "@packages/uikit";
</script>

<style lang="scss" scoped>
.main-content {
  @apply w-full h-auto;
}
</style>
