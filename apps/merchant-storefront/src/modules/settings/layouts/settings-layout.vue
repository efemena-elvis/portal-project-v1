<template>
  <PageContentWrapper>
    <template v-slot:pageContent>
      <!-- TAB BAR -->
      <TabBar :routes="settingsSidebarRoutes" />

      <!-- MAIN CONTENT -->
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </template>
  </PageContentWrapper>
</template>

<script setup lang="ts">
import { PageContentWrapper, TabBar } from "@packages/uikit";
import { settingsSidebarRoutes } from "@/shared/utilities/sidebar-routes";
</script>

<style lang="scss" scoped>
.main-content {
  @apply w-full h-auto;
}
</style>
