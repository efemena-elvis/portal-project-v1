<template>
  <div
    class="flex justify-center items-center mx-auto w-1/2 mdLg:w-full sm:w-[80%] absolute top-44 left-0 right-0"
  >
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { useColor } from "@packages/hooks";
import { useImage } from "@/shared/composables";

const { renderImg } = useImage();
const { setPageBackgroundColor } = useColor();

setPageBackgroundColor("#0B2E16");
</script>

<style lang="scss" scoped></style>
