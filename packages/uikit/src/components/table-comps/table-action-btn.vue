<template>
  <div class="action-wrapper">
    <button
      class="table-action-btn"
      @click="$emit('manageClick')"
      v-if="showPrimaryBtn"
    >
      {{ primaryBtnText }}
    </button>

    <button
      class="table-action-btn table-action-icon secondary-action"
      :class="isSecondaryActionDelete ? 'hover:!bg-red-500' : ''"
      @click="$emit('deleteClick')"
      v-if="showSecondaryBtn"
    >
      <div class="icon" v-if="secondaryBtnIcon" :class="secondaryBtnIcon"></div>
      <div class="text" v-if="showSecondaryText">{{ secondaryBtnText }}</div>
    </button>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(["manageClick", "deleteClick"]);

defineProps({
  showPrimaryBtn: {
    type: Boolean,
    default: false,
  },

  primaryBtnText: {
    type: String,
    default: "Manage",
  },

  showSecondaryBtn: {
    type: Boolean,
    default: false,
  },

  showSecondaryText: {
    type: Boolean,
    default: false,
  },

  secondaryBtnText: {
    type: String,
    default: "Delete",
  },

  secondaryBtnIcon: {
    type: String,
    default: "icon-trash",
  },

  isSecondaryActionDelete: {
    type: Boolean,
    default: true,
  },
});
</script>

<style lang="scss" scoped>
.action-wrapper {
  @apply flex justify-start items-center gap-x-3;

  .table-action-btn {
    @apply max-w-[120px] cursor-pointer h-10 py-2 px-4 text-grey-800/80 font-medium rounded-lg border border-grey-300 text-[12.75px] transition duration-300 ease-in-out text-nowrap hover:bg-green-500 hover:text-white;
  }

  .table-action-icon {
    @apply text-base h-10;
  }

  .secondary-action {
    @apply flex justify-start items-center gap-x-2;

    .text {
      @apply text-grey-800/80 font-medium text-[12.75px];
    }

    &:hover {
      .text {
        @apply text-white;
      }
    }
  }
}
</style>
