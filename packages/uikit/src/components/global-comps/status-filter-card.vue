<template>
  <div class="status-filter-row">
    <div
      class="status-item"
      :class="item.active && 'status-item--active'"
      v-for="(item, index) in statusFilterList"
      :key="index"
      @click="changeRouteStatus(item.slug)"
    >
      <div class="status-item-text">{{ item.title }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

interface IStatusItem {
  title: string;
  slug: string;
  active: boolean;
}

interface IStatusFilterCardProps {
  statusItems: IStatusItem[];
}

const props = withDefaults(defineProps<IStatusFilterCardProps>(), {
  statusItems: () => [],
});

const route = useRoute();
const router = useRouter();

const statusFilterList = ref<IStatusItem[]>([...props.statusItems]);

const changeRouteStatus = (slug: string) => {
  router.push({ name: route.name, query: { filter: slug } });
};

watch(
  route,
  () => {
    if (route.query.filter) {
      statusFilterList.value.map((item) => {
        item.active = item.slug === route.query.filter;
      });
    } else {
      statusFilterList.value[0].active = true;
    }
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
.status-filter-row {
  @apply flex justify-between items-center border border-grey-200/95 rounded-lg overflow-hidden w-max mb-2;

  .status-item {
    @apply w-auto px-6 py-3 border-r border-r-grey-200/90 first-of-type:border-l-0 last-of-type:border-r-0 cursor-pointer transition duration-300 ease-in-out hover:bg-green-100/20;

    &-text {
      @apply text-sm text-center text-grey-700 transition duration-300 ease-in-out;
    }
  }

  .status-item--active {
    @apply bg-green-100/90 hover:bg-green-100;

    .status-item-text {
      @apply font-semibold;
    }
  }
}
</style>
