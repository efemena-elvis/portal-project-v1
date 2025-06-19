<template>
  <div class="card-info-row mt-4 mb-8">
    <div class="card-info" v-for="(item, index) in metricItems" :key="index">
      <div class="card-info-title">{{ item.titleText }}</div>
      <div class="card-info-value">{{ item.valueText }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface IMetricInfoItem {
  titleText: string;
  valueText: string;
}

interface IMetricInfoCardProps {
  metricItems: IMetricInfoItem[];
}

const props = withDefaults(defineProps<IMetricInfoCardProps>(), {
  metricItems: () => [],
});
</script>

<style lang="scss" scoped>
.card-info-row {
  @apply flex justify-between items-center border border-grey-200/90 rounded-lg overflow-hidden w-max mb-2;

  .card-info {
    @apply w-auto min-w-[220px] px-5 py-4 border-r border-r-grey-200/90 first-of-type:border-l-0 last-of-type:border-r-0 flex flex-col justify-between items-start gap-y-3;

    &-title {
      @apply text-sm text-grey-600/95;
    }

    &-value {
      @apply text-[22px] text-grey-900 font-semibold;
    }
  }
}
</style>
