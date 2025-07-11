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
                  <BulkUploadFileInput :header="header" :body="row" />
                </template>

                <!-- DEFAULT DISPLAY -->
                <!-- <span v-else>{{ row[header.key] }}</span> -->
              </td>

              <td v-if="showRemoveBtn" class="px-4 py-2 text-center">
                <button
                  @click="$emit('delete-row', row.id)"
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
    @click="$emit('add-row')"
  >
    <div class="icon-add"></div>
    Add Merchant
  </button>
</template>

<script setup lang="ts">
import { watch, ref } from "vue";
import { useEvents, useFile } from "@packages/hooks";
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

const { processAPIRequest, pushToastAlert } = useEvents();
const { processFileType, processFileSize } = useFile();
const isUploading = ref(false);

const emit = defineEmits<{
  (e: "onDocumentUploaded", fileUrl: string): void;
  (e: "add-row"): void;
  (
    e: "update-row",
    rowId: number | string,
    field: string,
    value: string | number | File
  ): void;
  (e: "delete-row", rowId: number | string): void;
}>();

const isTextInputEntry = (type: string) =>
  ["text", "email", "number", "url"].includes(type);

const allowedFiles = ref<string[]>([
  "pdf",
  "jpeg",
  "jpg",
  "png",
  "xls",
  "xlsx",
]);

const docPayload = ref<
  Record<string | number, Record<string, { name: string; link: string }>>
>({});

const processDocumentUpload = async (
  $event: Event,
  rowId: string | number,
  field: string,
  rowIndex: number
) => {
  const inputElement = $event.target as HTMLInputElement;
  const uploadedFile = inputElement.files ? inputElement.files[0] : null;
  if (!uploadedFile) return;

  isUploading.value = true;

  if (!processFileType(uploadedFile.name, allowedFiles.value)) {
    pushToastAlert({
      message: "File type is not supported!",
      description:
        "Document file type should either be jpg, jpeg, png, xls, or pdf",
      type: "warning",
    });
    isUploading.value = false;
    inputElement.value = "";
    return;
  }

  if (!processFileSize(uploadedFile.size)) {
    pushToastAlert({
      message: "Upload a maximum file size of 5mb",
      type: "warning",
    });
    isUploading.value = false;
    inputElement.value = "";
    return;
  }

  const payload = new FormData();
  payload.append("files", uploadedFile);

  const response = await processAPIRequest({
    action: uploadFile,
    payload,
    alertHandler: {
      201: {
        message: "Document uploaded successfully",
        type: "success",
      },
      400: {
        message: "Document upload failed",
        type: "error",
      },
    },
  });

  if (response.code === 201 && response.data?.[0]?.file_url) {
    const fileUrl = response.data[0].file_url;
    const fileName = uploadedFile.name;

    editableData.value[rowIndex][field] = fileUrl;
    updateField(rowId, field, fileUrl);

    if (!docPayload.value[rowId]) {
      docPayload.value[rowId] = {};
    }
    docPayload.value[rowId][field] = {
      name: fileName,
      link: fileUrl,
    };

    emit("onDocumentUploaded", fileUrl);
  }

  inputElement.value = "";
  isUploading.value = false;
};

const updateField = (
  rowId: string | number,
  field: string,
  value: string | number
) => {
  emit("update-row", rowId, field, value);
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
            @apply align-middle;
          }

          td {
            @apply w-auto min-w-[24px] max-w-[200px] py-2 border-x border-grey-200 first-of-type:border-x-0 last-of-type:border-x-0 whitespace-nowrap bg-transparent;

            .remove-btn {
              @apply size-8 min-w-8 min-h-8 p-1 text-lg rounded-full bg-grey-100 hover:text-red-600 transition duration-300 ease-in-out;
            }
          }
        }
      }
    }
  }
}
</style>
