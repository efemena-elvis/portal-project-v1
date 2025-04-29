<template>
  <div class="w-full">
    <!-- TABLE LOADING STATE -->
    <TableLoading v-if="isLoading" />

    <template v-else>
      <template v-if="tableBody.length">
        <div class="table-container">
          <table class="table">
            <thead v-if="showTableHeader">
              <tr>
                <td v-for="(header, index) in tableHeader" :key="index">
                  <div class="table-header">
                    <div>{{ header.title }}</div>
                    <div
                      v-if="header.sortable"
                      class="table-sort-icon icon-double-caret-fill"
                    ></div>
                  </div>
                </td>
              </tr>
            </thead>

            <tbody>
              <slot />
            </tbody>
          </table>
        </div>
      </template>

      <!-- TABLE EMPTY STATE -->
      <TableEmpty
        :title="emptyData.title"
        :description="emptyData.description"
        :actionText="emptyData.actionText"
        :customImg="emptyData.customImg"
        @onActionClicked="$emit('onActionClicked')"
        v-else
      />
    </template>
  </div>
</template>

<script setup>
import { toRefs } from "vue";
import { TableLoading, TableEmpty } from "@packages/uikit";

defineEmits(["onActionClicked"]);

const props = defineProps({
  tableHeader: {
    type: Array,
    default: () => [],
  },
  tableBody: {
    type: Array,
    default: () => [],
  },
  showTableHeader: {
    type: Boolean,
    default: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  emptyData: {
    type: Object,
    default: () => ({
      title: "Not available",
      description: "No data available yet",
      actionText: "",
      customImg: "",
    }),
  },
});

const { tableHeader, tableBody, isLoading } = toRefs(props);
</script>

<style lang="scss">
.table-container {
  @apply overflow-auto w-full p-0;
}

.table-container::-webkit-scrollbar {
  @apply h-[5px];
}

.table-container::-webkit-scrollbar-track {
  @apply rounded-md;
}

.table-container::-webkit-scrollbar-thumb {
  @apply rounded-md;
}

.table {
  @apply overflow-auto w-full border-collapse min-w-max;
}

thead {
  @apply text-[13.5px] font-medium text-grey-900;
}

thead tr {
  @apply border-0 border-y border-y-grey-200/75 bg-grey-50/45;
}

thead tr td {
  @apply px-3.5 pt-[22px] pb-[18px];
}

thead tr td .table-header {
  @apply flex justify-start items-center;
}

thead tr td .table-header .table-sort-icon {
  @apply cursor-pointer text-[23px];
}

tbody {
  @apply text-[13.5px] text-grey-900;
}

tbody tr {
  @apply cursor-pointer align-middle transition duration-300 ease-in-out border-b border-b-grey-200/60 hover:bg-green-100/20;
}

tbody tr td {
  @apply px-4 py-4 w-auto;
  min-width: 24px;
  max-width: 200px;
}
</style>
