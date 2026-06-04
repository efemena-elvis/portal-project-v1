<template>
  <div class="file-wrapper">
    <div class="file-label">
      <template v-if="isUploading">
        <div class="text-2xl icon icon-spinner-ios animate-spin"></div>
        <div class="select-none">Uploading file...</div>
      </template>

      <template v-else>
        <template v-if="inputValue">
          <div class="uploaded-area">
            <a :href="inputValue" target="_blank">
              <div class="icon icon-check-circle"></div>
              <div class="select-none">
                {{ capitalizeFirstLetter(header.label) }}
              </div>
            </a>

            <div
              class="clear-action"
              @click="removeUploadedFile(body.id, header.path)"
            >
              <div class="clear-text">CLEAR</div>
            </div>
          </div>
        </template>

        <template v-else>
          <label :for="keyIdentifier" class="file-label">
            <div class="icon icon-file"></div>
            <div class="select-none">
              {{ header.placeholder }}
            </div>
          </label>
        </template>
      </template>
    </div>

    <input
      :id="keyIdentifier"
      type="file"
      class="hidden w-full h-12"
      :class="`merchant-id-${body.id}`"
      accept=".jpg, .jpeg, .png, .pdf"
      @change="processDocumentUpload($event, header.path, body.id)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { BulkUploadTableType, IMerchantBaseType } from "@packages/models";
import { useString, useFile, useEvents } from "@packages/hooks";

const props = defineProps<{
  header: BulkUploadTableType;
  body: IMerchantBaseType;
  updateMerchantAction: (payload: any) => void;
  uploadAction: (payload: any) => Promise<any>;
  keyIdentifier?: string;
}>();

const { capitalizeFirstLetter } = useString();
const { processFileType, processFileSize } = useFile();
const { pushToastAlert, processAPIRequest } = useEvents();

const inputValue = ref<string>("");
const categoryItem = ref<string>(props.header.path.split(".")[0]);
const dataItem = ref<string>(props.header.path.split(".")[1]);

const isUploading = ref<boolean>(false);
const allowedFiles = ref<string[]>(["pdf", "jpeg", "jpg", "png"]);

const updateFieldInput = (merchantId: string, path: string, value: string) => {
  props.updateMerchantAction({
    id: merchantId,
    path,
    value,
  });
};

const updateUploadingStatus = (merchantId: string, path: string) => {
  if (path === props.header.path && merchantId === props.body.id) {
    isUploading.value = !isUploading.value;
  }
};

const processDocumentUpload = async (
  $event: Event,
  path: string,
  merchantId: string,
) => {
  const inputElement = $event.target as HTMLInputElement;
  const uploadedFile = inputElement.files ? inputElement.files[0] : null;

  if (!uploadedFile) return;

  // UPDATE UPLOADING STATE
  updateUploadingStatus(merchantId, path);

  if (!processFileType(uploadedFile.name, allowedFiles.value)) {
    pushToastAlert({
      message: "File type is not supported!",
      description: "Document file type should either be jpg, jpeg, png or pdf",
      type: "warning",
    });

    updateUploadingStatus(merchantId, path);
    inputElement.value = "";
    return false;
  }

  if (!processFileSize(uploadedFile.size)) {
    pushToastAlert({
      message: "Upload a maximum file size of 5mb",
      type: "warning",
    });

    updateUploadingStatus(merchantId, path);
    inputElement.value = "";
    return false;
  }

  // UPLOAD FILE TO BUCKET
  const payload = new FormData();
  payload.append("files", uploadedFile);

  const response = await processAPIRequest({
    action: props.uploadAction,
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

  if (response.code == 201) {
    inputElement.value = "";
    updateUploadingStatus(merchantId, path);

    console.log("merchantId", merchantId);
    console.log("path", path);

    inputValue.value = response.data[0].file_url;
    updateFieldInput(merchantId, path, inputValue.value);
  }

  // FAILED STATE
  else {
    inputElement.value = "";
    updateUploadingStatus(merchantId, path);
  }
};

const removeUploadedFile = (merchantId: string, path: string) => {
  inputValue.value = "";
  updateFieldInput(merchantId, path, inputValue.value);
};

onMounted(() => {
  const category = props.body[
    categoryItem.value as keyof IMerchantBaseType
  ] as any;
  if (category && typeof category === "object") {
    inputValue.value = category[dataItem.value] ?? "";
  }
});
</script>

<style lang="scss" scoped>
.file-wrapper {
  @apply px-3.5;

  .file-label {
    @apply flex items-center gap-2 font-medium text-green-700 cursor-pointer;

    .icon {
      @apply text-lg font-medium text-green-700;
    }

    .uploaded-area {
      @apply flex justify-between items-center gap-x-2 w-full;

      a {
        @apply flex justify-start items-center gap-2 w-max;
      }

      .clear-action {
        @apply rounded-full py-0.5 px-2 w-max bg-red-100/40 text-center duration-300 ease-in-out hover:bg-red-100/60;

        .clear-text {
          @apply text-red-600 text-[11px] font-semibold;
        }
      }
    }
  }
}
</style>
