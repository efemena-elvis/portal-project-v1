<template>
  <div :class="isBoldText && 'is-bold-text'">{{ string }}</div>
</template>

<script lang="ts" setup>
const props = defineProps({
  string: {
    type: String,
    required: true,
  },

  isBoldText: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.is-bold-text {
  @apply font-semibold;
}
</style>
