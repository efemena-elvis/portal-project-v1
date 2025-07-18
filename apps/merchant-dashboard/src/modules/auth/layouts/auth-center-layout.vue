<template>
  <div class="auth-center-layout relative h-screen">
    <div class="app-container">
      <!-- CONTENT AREA -->
      <div class="content-area-wrapper">
        <div :class="`content-area ${getContentWidth}`">
          <router-view v-slot="{ Component }">
            <component :is="Component" />
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useColor, useAppVariant } from "@packages/hooks";
import { useImage } from "@/shared/composables";

const { renderImg } = useImage();
const { setPageBackgroundColor } = useColor();
const appVariant = ref<string>(useAppVariant());

const getContentWidth = computed(() => {
  return appVariant.value === "alexpay" ? "w-3/5" : "w-2/5";
});

setPageBackgroundColor("#ffffff");
</script>

<style lang="scss" scoped>
.auth-center-layout {
  @apply relative flex-col justify-start items-center pt-10 h-full;

  .brand-logo {
    @apply w-[178px] h-auto;
  }

  .content-area-wrapper {
    @apply flex flex-col justify-start items-center mt-10;

    .content-area {
      @apply mdLg:w-1/2 md:w-3/4 sm:w-4/5 xs:w-full h-auto;
    }
  }
}
</style>
