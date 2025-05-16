<template>
  <!-- UPLOADED VIEW -->
  <div class="doc-uploaded-view" v-if="isDocUploaded">
    <!-- FILE INFO DETAILS -->
    <div class="file-info">
      <div class="file-img">
        <img src="@images/file-binders.png" alt="uploadedFile" />
      </div>

      <div class="flex flex-col gap-y-0.5 sm:gap-y-0">
        <div class="file-name">
          {{ capitalizeFirstLetter(docPayload.name) }}
        </div>
        <a :href="docPayload.link" target="_blank" class="link">View file</a>
      </div>
    </div>

    <!-- TRIGGER FILE REMOVE -->
    <div class="file-remove" title="Remove file" @click="removeUploadedFile">
      <div class="icon icon-trash"></div>
    </div>
  </div>

  <!-- EMPTY VIEW -->
  <div class="upload-field-input" v-else>
    <label :for="id">
      <div class="flex items-center justify-center gap-x-2">
        <!-- UPLOADING STATE -->
        <template v-if="isUploading">
          <div
            class="text-2xl icon icon-spinner-ios text-grey-600/80 animate-spin"
          ></div>
          <div class="select-none">
            Please wait, uploading your file...
          </div></template
        >

        <!-- NOT UPLOADED STATE -->
        <template v-else>
          <div class="text-xl icon icon-upload text-grey-600/80"></div>
          <div class="select-none">{{ fileUploadText }}</div>
        </template>
      </div>
    </label>

    <input
      type="file"
      :id="id"
      ref="fileUploadRef"
      class="hidden"
      :disabled="isUploading"
      @change="processDocumentUpload"
      accept=".jpg, .jpeg, .png, .pdf .xls, .xlsx"
    />
  </div>

  <!-- SKIP ROW -->
  <div class="skip-row" v-if="showSkip">
    Don’t have these documents ready?
    <span @click="router.push({ name: props.skipRoute })"
      >Skip and upload later</span
    >
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useString, useFile, useEvents } from "@packages/hooks";

interface IFileUploadType {
  id?: string;
  showSkip?: boolean;
  skipRoute?: string;
  hasDocumentUploaded?: boolean;
  uploadedDocumentContent?: { name?: string; link?: string };
  fileUploadText?: string;
  uploadAction: (payload: any) => Promise<any>;
}

const props = withDefaults(defineProps<IFileUploadType>(), {
  id: "fileUpload",
  showSkip: false,
  skipRoute: "",
  hasDocumentUploaded: false,
  fileUploadText: "Click here to upload your file",
  uploadAction: async (payload: any) => {
    console.warn("No upload action provided");
    return Promise.resolve(null);
  },
});

const alreadyUploadedDoc = props.uploadedDocumentContent || {
  name: "",
  link: "",
};

const emits = defineEmits(["onDocumentUploaded"]);

const router = useRouter();
const { capitalizeFirstLetter } = useString();
const { processFileType, processFileSize } = useFile();
const { pushToastAlert, processAPIRequest } = useEvents();

const fileUploadRef = ref<HTMLInputElement | null>(null);
const allowedFiles = ref<string[]>(["pdf", "jpeg", "jpg", "png", "xls", "xlsx"]);

const isDocUploaded = ref<boolean>(props.hasDocumentUploaded || false);
// const isDocUploaded = computed(() => props.hasDocumentUploaded || false);

const isUploading = ref<boolean>(false);

const docPayload = ref<{ name: string; link: string }>({
  name: alreadyUploadedDoc?.name || "",
  link: alreadyUploadedDoc.link || "",
});

const processDocumentUpload = async ($event: Event) => {
  const inputElement = $event.target as HTMLInputElement;
  const uploadedFile = inputElement.files ? inputElement.files[0] : null;
 
  if (!uploadedFile) return;

  isUploading.value = true;

  if (!processFileType(uploadedFile.name, allowedFiles.value)) {
    pushToastAlert({
      message: "File type is not supported!",
      description: "Document file type should either be jpg, jpeg, png, xls, xlsx or pdf",
      type: "warning",
    });

    isUploading.value = false;
    inputElement.value = "";
    return false;
  }

  if (!processFileSize(uploadedFile.size)) {
    pushToastAlert({
      message: "Upload a maximum file size of 5mb",
      type: "warning",
    });

    isUploading.value = false;
    inputElement.value = "";
    return false;
  }

  // UPLOAD FILE TO BUCKET
  const UPLOAD_PRESET = "vesicash";
  const payload = new FormData();
  payload.append("file", uploadedFile);
  payload.append("upload_preset", UPLOAD_PRESET);


  const response = await processAPIRequest({
    action: props.uploadAction,
    payload,
    // alertHandler: {
    //   200: {
    //     message: "Document uploaded successfully",
    //     type: "success",
    //   },

    //   400: {
    //     message: "Document upload failed",
    //     type: "error",
    //   },
    // },
  });


  if (response.status == 200) {
    docPayload.value = response.data;
    isDocUploaded.value = true;
    
    pushToastAlert({
      message: "Document uploaded successfully",
      type: "success",
    });

    inputElement.value = "";
    isUploading.value = false;

    docPayload.value.name = uploadedFile.name;
    docPayload.value.link = response.data.secure_url;

      docPayload.value[inputElement.name] =
        response.data.url;
    
    emits("onDocumentUploaded", response.data.secure_url);
  }

  // FAILED STATE
  else {
    pushToastAlert({
      message: "Document upload failed",
      type: "error",
    });

    inputElement.value = "";
    isUploading.value = false;
    isDocUploaded.value = false;
  }
};

const removeUploadedFile = () => {
  isDocUploaded.value = false;
  docPayload.value = { name: "", link: "" };

  emits("onDocumentUploaded", null);
};
</script>

<style lang="scss" scoped>
.upload-field-input {
  @apply relative rounded-lg border border-dotted border-grey-500/85 cursor-pointer h-[76px] transition duration-300 ease-in-out hover:bg-green-50 hover:border-green-500;

  label {
    @apply absolute inset-0 w-full h-full text-sm text-grey-600 cursor-pointer flex justify-center items-center;
  }
}

.doc-uploaded-view {
  @apply relative rounded-xl p-4 sm:px-3 sm:py-3.5 border border-grey-300/60 h-auto flex justify-between items-center gap-x-3 transition duration-300 ease-in-out hover:bg-green-50/90;

  .file-info {
    @apply flex justify-start items-center gap-x-3 xs:gap-x-2.5;

    .file-img {
      @apply size-11 sm:size-10 min-h-11 sm:min-h-10 min-w-11 sm:min-w-10 rounded-2xl bg-green-200/40 border border-grey-200/40 shadow-sm flex justify-center items-center;

      img {
        @apply size-6 sm:size-5;
      }
    }

    .file-name {
      @apply font-medium line-clamp-1 text-teal-800 text-[14.75px] sm:text-[14.5px] xs:text-[14.25px];
    }

    .btn {
      @apply text-[13px] py-1 px-2.5 rounded-full h-auto;
    }
  }

  .file-remove {
    @apply cursor-pointer size-10 min-h-10 min-w-10 rounded-full bg-red-200/30 flex justify-center items-center transition duration-300 ease-in-out hover:bg-red-200/50;

    .icon {
      @apply text-red-500 text-[22px] xs:text-xl;
    }
  }
}

.skip-row {
  @apply text-sm text-grey-600 mt-8;

  span {
    @apply text-green-600/85 font-semibold cursor-pointer transition duration-300 ease-in-out hover:text-green-500/80;
  }
}
</style>
