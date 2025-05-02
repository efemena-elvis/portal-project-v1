<template>
  <div class="tab-bar-row">
    <router-link to="" class="tab-item tab-item-active">Profile</router-link>
    <router-link to="" class="tab-item">Bank Account</router-link>
    <router-link to="" class="tab-item">Teams</router-link>
    <router-link to="" class="tab-item">Developer</router-link>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.tab-bar-row {
  @apply w-full h-auto flex justify-start items-center gap-8 mt-2 mb-8 border-b border-b-grey-200/70;

  .tab-item {
    @apply p-2.5 text-sm font-medium text-grey-700 cursor-pointer;

    &-active {
      @apply text-green-500 border-b-2 border-b-green-500;
    }
  }
}
</style>
