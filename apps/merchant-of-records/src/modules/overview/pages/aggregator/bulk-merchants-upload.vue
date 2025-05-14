<template>
  <MerchantWrapper
    :title="'Bulk Merchant Upload'"
    :description="'Streamline your merchant onboarding process with bulk uploads. Save time, reduce errors, and scale your business faster.'"
  >
    <div class="flex flex-col gap-6">
      <p class="text-[14px]">Before you upload:</p>
      <ul class="flex flex-col gap-4 text-[14px]">
        <div class="flex items-center gap-4">
          <div class="icon-checkmark text-green-500 text-[18px]"></div>
          <li>
            Download the
            <router-link to="#" class="text-[14px]"
              >Bulk Merchant Template.xlsx</router-link
            >
          </li>
        </div>
        <div class="flex items-center gap-4">
          <div class="icon-checkmark text-green-500 text-[18px]"></div>
          <li>Fill in the appropriate fields.</li>
        </div>
        <div class="flex items-center gap-4">
          <div class="icon-checkmark text-green-500 text-[18px]"></div>
          <li>Upload updated Bulk Merchant Template.</li>
        </div>
      </ul>
      <FileUploadInput
        id="merchants"
        :hasDocumentUploaded="!!merchantPayload.merchants"
        :uploadAction="uploadFile"
        @onDocumentUploaded="merchantPayload.merchants = $event"
      />
    </div>
    <button
      class="btn btn-primary btn-sm mt-8 !w-[100px] self-end"
      @click="handleFileUpload"
    >
      Upload
    </button>
  </MerchantWrapper>
</template>

<script setup lang="ts">
import { useGlobalStore } from "@/modules/global/store";
import FileUploadInput from "@packages/uikit/src/components/form-comps/file-upload-input.vue";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import MerchantWrapper from "../../components/aggregator/merchant-wrapper.vue";

const { uploadFile } = useGlobalStore();

const merchantPayload = ref({
  merchants: "",
});

const handleFileUpload = () => {};
</script>

<style scoped lang="scss">
.option-field {
  @apply rounded-lg text-green-500 py-3 px-4 font-semibold cursor-pointer border border-grey-200 w-full flex items-center justify-between;
}
</style>
