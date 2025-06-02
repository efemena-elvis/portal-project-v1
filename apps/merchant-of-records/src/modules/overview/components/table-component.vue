<template>
  <h2 class="text-xl font-bold text-grey-900 mb-6">{{ title }}</h2>

  <div class="space-y-4 border border-grey-200 rounded-md">
    <table class="min-w-full table-auto border border-grey-200 rounded-md">
      <thead class="bg-grey-100 h-16">
        <tr>
          <th
            v-for="header in headers"
            :key="header.key"
            class="text-left px-4 py-2 text-grey-500 border-r border-r-grey-200"
          >
            {{ header.label }}
          </th>
          <th
            v-if="showDeleteButton"
            class="text-left px-4 py-2 text-grey-500"
          ></th>
        </tr>
      </thead>

      <tbody class="text-grey-600">
        <tr v-for="(row, rowIndex) in data" :key="row.id" class="border-t">
          <td
            v-for="header in headers"
            :key="header.key"
            :class="[
              'border-r min-w-full py-2',
              header.readonly ? 'bg-grey-100 px-0 mx-4' : 'bg-transparent',
            ]"
          >
            <input
              v-if="['text', 'email', 'number', 'url'].includes(header.type)"
              :type="header.type"
              placeholder="Enter"
              :class="[
                'py-1 w-full h-12 bg-transparent',
                header.readonly ? 'mx-4 text-grey-900' : 'focus:outline-none',
              ]"
              :disabled="header.readonly"
              v-model="editableData[rowIndex][header.key]"
              @change="
                updateField(
                  row.id,
                  header.key,
                  editableData[rowIndex][header.key]
                )
              "
            />

            <div v-else-if="header.type === 'file'" class="">
              <label
                :for="`${header.key}-${rowIndex}`"
                class="text-green-600 flex items-center gap-2 cursor-pointer"
              >
                <div class="icon-file"></div>
                <span v-if="docPayload[row.id]?.[header.key]?.link">
                  <a
                    :href="docPayload[row.id][header.key].link"
                    target="_blank"
                    class="text-green-600 underline"
                  >
                    {{ docPayload[row.id][header.key].name }}
                  </a>
                </span>
                <span v-else>Upload document</span>
              </label>

              <input
                :id="`${header.key}-${rowIndex}`"
                type="file"
                class="py-1 w-full hidden focus:outline-none h-12 bg-transparent px-0"
                @change="
                  processDocumentUpload($event, row.id, header.key, rowIndex)
                "
              />
            </div>
            <select
              v-else-if="header.type === 'select'"
              class="py-1 w-full focus:outline-none h-12 bg-transparent px-0 text-grey-500"
              v-model="editableData[rowIndex][header.key]"
              @change="
                updateField(
                  row.id,
                  header.key,
                  editableData[rowIndex][header.key]
                )
              "
            >
              <option value="" disabled>Choose</option>

              <option
                v-for="option in header.options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>

            <span v-else>{{ row[header.key] }}</span>
          </td>

          <td v-if="showDeleteButton" class="text-center px-4 py-2">
            <button
              @click="$emit('delete-row', row.id)"
              class="hover:text-red-600 text-lg bg-grey-100 h-8 w-8 rounded-full p-1"
              title="Delete row"
            >
              <div class="icon-trash"></div>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <button
    v-if="showAddButton"
    class="hover:bg-green-500 hover:text-white flex items-center justify-center gap-2 font-semibold px-4 py-2 rounded-md border text-grey-900 w-[80px] mt-6"
    @click="$emit('add-row')"
  >
    <div class="icon-add"></div>
    Add
  </button>
</template>

<script setup lang="ts">
import { useGlobalStore } from "@/modules/global/store";
import { useEvents, useFile } from "@packages/hooks";
import { watch, ref, defineProps, defineEmits } from "vue";

interface TableHeader {
  key: string;
  label: string;
  type: string;
  options?: { value: string; label: string }[];
  readonly?: boolean;
}

interface TableRow {
  [key: string]: string | number;
}

const { uploadFile } = useGlobalStore();
const { processAPIRequest, pushToastAlert } = useEvents();
const { processFileType, processFileSize } = useFile();
const isUploading = ref(false);

const props = defineProps<{
  title: string;
  headers: TableHeader[];
  data: TableRow[];
  showAddButton?: boolean;
  showDeleteButton?: boolean;
  readonly?: boolean;
  uploadedDocumentContent?: { name: string; link: string };
  hasDocumentUploaded?: boolean;
}>();

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

const editableData = ref<TableRow[]>([]);
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

watch(
  () => props.data,
  (newVal) => {
    editableData.value = JSON.parse(JSON.stringify(newVal));
  },
  { immediate: true, deep: true }
);
</script>

<style scoped>
table {
  border-collapse: collapse;
}
</style>
