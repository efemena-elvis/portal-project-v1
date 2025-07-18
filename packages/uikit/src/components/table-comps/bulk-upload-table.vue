<template>
  <div class="bulk-upload-table">
    <div class="table-wrapper">
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th v-for="(header, index) in tableHeader" :key="index">
                {{ header.label }}
              </th>

              <th v-if="showRemoveBtn"></th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(row, rowIndex) in tableBody" :key="rowIndex">
              <td
                v-for="(header, index) in tableHeader"
                :key="index"
                :class="header.readonly && 'bg-grey-100'"
              >
                <!-- TEXT INPUT FORM TYPE -->
                <template v-if="isTextInputEntry(header.type)">
                  <BulkUploadTextInput
                    :key="index"
                    :header="header"
                    :body="row"
                    :updateMerchantAction="updateMerchantAction"
                  />
                </template>

                <!-- SELECT INPUT FORM TYPE -->
                <template v-else-if="header.type === 'select'">
                  <BulkUploadSelectInput
                    :header="header"
                    :body="row"
                    :updateMerchantAction="updateMerchantAction"
                  />
                </template>

                <!-- FILE INPUT FORM TYPE -->
                <template v-else-if="header.type === 'file'">
                  <BulkUploadFileInput
                    :header="header"
                    :body="row"
                    :updateMerchantAction="updateMerchantAction"
                    :uploadAction="uploadAction"
                  />
                </template>
              </td>

              <td v-if="showRemoveBtn" class="px-4 py-2 text-center">
                <button
                  @click="removeRowData(row.id)"
                  class="remove-btn"
                  title="Remove row"
                >
                  <div class="icon-trash"></div>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <button
    v-if="showAddMerchantBtn"
    class="btn btn-sm btn-secondary mt-7"
    @click="addRowAction"
  >
    <div class="icon-add"></div>
    Add Merchant
  </button>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useEvents } from "@packages/hooks";
import { BulkUploadTableType, IMerchantBaseType } from "@packages/models";

import BulkUploadTextInput from "./bulk-upload-text-input.vue";
import BulkUploadSelectInput from "./bulk-upload-select-input.vue";
import BulkUploadFileInput from "./bulk-upload-file-input.vue";

interface IBulkUploadTableType {
  tableHeader: BulkUploadTableType[];
  tableBody: IMerchantBaseType[];
  showRemoveBtn?: boolean;
  showAddMerchantBtn?: boolean;
  uploadAction?: (payload: any) => Promise<any>;
  addRowAction?: () => void;
  removeRowAction?: (payload: any) => void;
  updateMerchantAction?: (payload: any) => void;
}

const props = withDefaults(defineProps<IBulkUploadTableType>(), {
  tableHeader: () => [],
  tableBody: () => [],
  showRemoveBtn: false,
  showAddMerchantBtn: false,
  uploadAction: async (payload: any) => {
    return Promise.resolve(null);
  },
  addRowAction: () => {},
  removeRowAction: (payload: any) => {},
  updateMerchantAction: async (payload: any) => {},
});

defineEmits<{
  (e: "add-row"): void;
  (e: "delete-row", rowId: number | string): void;
}>();

const { pushToastAlert } = useEvents();

const isTextInputEntry = (type: string) =>
  ["text", "email", "tel", "url"].includes(type);

const removeRowData = (rowId: string) => {
  if (props.tableBody.length > 1) {
    props.removeRowAction(rowId);
  } else {
    pushToastAlert({
      message: "The last row cannot be removed",
      type: "warning",
    });
  }
};
</script>

<style scoped lang="scss">
.bulk-upload-table {
  @apply w-full;

  .table-wrapper {
    @apply border-t-0 overflow-hidden rounded-lg border border-grey-200;

    .table-container {
      @apply overflow-auto w-full p-0;

      &::-webkit-scrollbar {
        @apply h-[5px];
      }

      &::-webkit-scrollbar-track,
      &::-webkit-scrollbar-thumb {
        @apply rounded-md;
      }

      table {
        @apply min-w-full rounded-md table-auto;

        thead {
          @apply h-16 bg-grey-100;

          th {
            @apply px-4 py-2 border-x border-grey-200 first-of-type:border-x-0 last-of-type:border-x-0 text-left text-grey-800 font-semibold whitespace-nowrap w-auto max-w-max;
          }
        }

        tbody {
          @apply text-grey-700;

          tr {
            @apply align-middle hover:!bg-[unset];
          }

          td {
            @apply p-0 w-auto min-w-[24px] max-w-[200px] border-x border-grey-200 first-of-type:border-x-0 last-of-type:border-x-0 whitespace-nowrap bg-transparent hover:!bg-[unset];

            .remove-btn {
              @apply mx-4 size-9 min-w-9 min-h-9 p-1 text-lg rounded-full bg-grey-100 hover:bg-red-200/50 hover:scale-110 transition duration-300 ease-in-out;
            }
          }
        }
      }
    }
  }
}
</style>
