<template>
  <div class="page-content-wrapper">
    <!-- TOP ROW -->
    <div class="top-row">
      <div class="top-row--left">
        <div class="page-title" v-if="props.showTitle">{{ pageTitle }}</div>
      </div>

      <div class="top-row--right">
        <slot name="pageOptions"></slot>
      </div>
    </div>

    <!-- BOTTOM ROW -->
    <div :class="['bottom-row', { 'has-custom-btn': customActionBtnText }]">
      <slot name="pageContent"></slot>
    </div>

    <!-- PAGINATION -->
    <template v-if="pagingData.page_count > 0">
      <Pagination
        :pageDescription="pageDescription"
        :pagingData="pagingData"
        @page-change="(page) => handlePageChange(page)"
        :pageKeys="pageKeys"
      />
    </template>
    <template v-if="showCustomActionBtn">
      <div class="">
        <button
          class="p-[1.1rem] rounded-lg btn-primary absolute -top-6 right-0 sm:-top-1"
          @click="$emit('customActionBtnClicked')"
        >
          {{ customActionBtnText }}
        </button>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import Pagination from "./pagination.vue";

interface IPageContentType {
  pagingData?: any;
  pageDescription?: string;
  showTitle?: boolean;
  customActionBtnText?: string;
  showCustomActionBtn?: boolean;
  pageKeys?: any;
}

const props = withDefaults(defineProps<IPageContentType>(), {
  pageDescription: "",
  pagingData: { page_count: 0 },
  showTitle: true,
  customActionBtnText: "",
  showCustomActionBtn: false,
  pageKeys: {},
});

const emits = defineEmits(["customActionBtnClicked", "updatePage"]);

const handlePageChange = (page: number) => {
  emits("updatePage", page);
};

const route = useRoute();

const pageTitle = ref<string>("");

const updatePageMeta = () => {
  const { title } = route.meta?.pageMeta as {
    title: string;
  };
  pageTitle.value = title.includes("Settings") ? "Settings" : title;
};

watch(route, () => updatePageMeta(), { immediate: true });

</script>

<style lang="scss">
.page-content-wrapper {
  @apply w-full h-full flex flex-col justify-between items-start gap-y-8 pb-9 relative top-8 sm:top-4;

  .top-row {
    @apply flex sm:flex-wrap justify-between items-center gap-4 sm:gap-3 w-full -mb-3;

    &--left {
      @apply flex justify-start items-center gap-3 sm:w-full;

      .page-title {
        @apply font-bold text-grey-900 text-2xl sm:text-xl sm:mt-4 -mt-5 ;
      }
    }

    &--right {
      @apply flex justify-end items-center gap-3 sm:w-full sm:mt-3;
    }
  }

  .bottom-row {
    @apply w-full;
  }
  .has-custom-btn {
  @apply sm:mt-12 mt-3;
}

}
</style>
