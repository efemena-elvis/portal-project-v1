<template>
  <MerchantWrapper
    title="Bulk Merchant Upload"
    description="Streamline your merchant onboarding process with bulk uploads. Save time, reduce errors, and scale your business faster."
  >
    <div class="flex flex-col gap-6">
      <p class="text-[14px]">Before you upload:</p>
      <ul class="flex flex-col gap-4 text-[14px]">
        <li class="flex items-center gap-4">
          <div class="icon-checkmark text-green-500 text-[18px]"></div>
          <span>
            Download the
            <span
              @click="handleDownloadTemplate"
              class="text-green-500 cursor-pointer"
            >
              Bulk Merchant Template.xlsx
            </span>
          </span>
        </li>
        <li class="flex items-center gap-4">
          <div class="icon-checkmark text-green-500 text-[18px]"></div>
          <span>Fill in the appropriate fields.</span>
        </li>
        <li class="flex items-center gap-4">
          <div class="icon-checkmark text-green-500 text-[18px]"></div>
          <span>Upload updated Bulk Merchant Template.</span>
        </li>
      </ul>

      <div class="">
      
        <FileUploadInput
        
          id="merchants"
          :hasDocumentUploaded="!!merchantPayload.link"
          :uploadAction="uploadFile"
          @onDocumentUploaded="(val) => merchantPayload.link = val"
        />
      </div>
    </div>

    <button
      ref="bulkUploadMerchantsBtnRef"
      class="btn btn-primary btn-sm mt-8 !w-[100px] self-end"
      @click="handleBulkUploadMerchants"
      :disabled="!merchantPayload.link"
    >
      Upload
    </button>
  </MerchantWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useGlobalStore } from "@/modules/global/store";
import { useAuthStore } from "../../../auth/store";
import { useEvents } from "@packages/hooks";
import { useProfile } from "@packages/hooks";
import MerchantWrapper from "../../components/aggregator/merchant-wrapper.vue";
import FileUploadInput from "@packages/uikit/src/components/form-comps/file-upload-input.vue";
import { bulkUploadMerchants } from "../../store/actions";


const { uploadFile} = useGlobalStore();
const { processAPIRequest, pushToastAlert } = useEvents();
const authStore = useAuthStore();
const profileUtil = new useProfile(authStore);


const user_id = computed(() => profileUtil?.getUser()?.id);


// const businessCountries = ref<any[]>([]);
const bulkUploadMerchantsBtnRef = ref(null);

const merchantPayload = ref({
  link: "",
  sheet: "sheet1",
  user_id: user_id.value,

});




const handleDownloadTemplate = () => {
  const sheetId = "1tZ6760CvuwxQ8qITD2-eteCXH_BzAed5WmD7a2SkrCs";
  const fileUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=xlsx`;
  const fileName = "Merchant Template.xlsx";

  const link = document.createElement("a");
  link.href = fileUrl;
  link.download = fileName;
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const handleBulkUploadMerchants = async () => {
  console.log(merchantPayload)
  try {
    const response = await processAPIRequest({
      action: bulkUploadMerchants,
      btnRef: bulkUploadMerchantsBtnRef,
      btnText: "Upload",
      payload: merchantPayload.value,
      showAlert: true,
    });

    if (response.code === 201) {
      pushToastAlert({
        message: "Merchants uploaded successfully.",
        type: "success",
      });
    } else {
      pushToastAlert({
        message: response?.error?.message ?? "An error occurred.",
        type: "error",
      });
    }
  } catch (error) {
    console.error("Upload failed:", error);
  }
};
</script>

<style scoped lang="scss">
.option-field {
  @apply rounded-lg text-green-500 py-3 px-4 font-semibold cursor-pointer border border-grey-200 w-full flex items-center justify-between;
}
</style>
