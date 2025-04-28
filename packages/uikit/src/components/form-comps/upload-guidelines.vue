<template>
  <div class="document-upload-guidelines">
    <div class="title-text">{{ title }}</div>

    <div class="guideline-list" v-if="guidelines.length">
      <div
        class="guideline-item"
        v-for="(item, index) in guidelines"
        :key="index"
      >
        <div class="bullet-point">
          <div class="icon icon-checkmark"></div>
        </div>

        <div class="guideline-text" v-html="item"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface IGuidelinesType {
  title: string;
  guidelines: string[];
}

withDefaults(defineProps<IGuidelinesType>(), {
  title: "Guideline title",
  guidelines: () => [],
});
</script>

<style lang="scss" scoped>
.document-upload-guidelines {
  @apply mb-10 -mt-2;

  .title-text {
    @apply text-[14.5px] text-grey-700 font-semibold mb-4;
  }

  .guideline-list {
    @apply flex flex-col justify-start items-start gap-y-4;

    .guideline-item {
      @apply w-full flex justify-start items-start gap-x-3 pb-4 border-b border-b-grey-200/55;

      .bullet-point {
        @apply flex justify-center items-center rounded-full size-5 min-h-5 min-w-5 border border-green-500/90 text-green-600;
      }

      .guideline-text {
        @apply text-sm xs:text-[13.85px] text-grey-700/90;
      }
    }
  }
}
</style>
