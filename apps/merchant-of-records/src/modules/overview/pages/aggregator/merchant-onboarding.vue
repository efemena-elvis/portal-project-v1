<template>
  <MerchantWrapper
    :title="'Merchant onboarding'"
    :description="'Follow these simple steps to get your merchants onboarded and start to unlock seamless transactions.'"
  >
    <ProgressBar/>

     <MerchantDocuments :merchantPayload="merchantPayload" :payloadValidity="payloadValidity"/>
     
    <button
      class="btn btn-primary btn-sm my-8 !w-[100px] self-end"
    
    >
      Next
    </button>
  </MerchantWrapper>
</template>

<script setup lang="ts">
import { useGlobalStore } from "@/modules/global/store";
import FileUploadInput from "@packages/uikit/src/components/form-comps/file-upload-input.vue";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import MerchantWrapper from "../../components/aggregator/merchant-wrapper.vue";
import ProgressBar from "../../components/aggregator/onboarding-form-comp.vue/progress-bar.vue";

import MerchantDocuments from "../../components/aggregator/onboarding-form-comp.vue/merchant-documents.vue";

const { uploadFile } = useGlobalStore();

const phoneCountryCode = ref("234");
const phoneNumberInput = ref("");

const payloadValidity = ref({
  business_name : false,
 business_email:false,
 phone_number:false,
 website_link: false,
 business_address: false,
 director_name : false,
 director_address: false,
 director_identity_verification: false,
 ultimate_business_owner_name: false,
 ultimate_business_owner_address: false,
 ultimate_business_owner_name_2: false,
 ultimate_business_owner_address_2: false,
   business_certificate: false,
  form_3: false
})


const merchantPayload = ref({
 business_name : "",
 business_email: "",
 phone_number: "",
 website_link: "",
 business_address: "",
 director_name: "",
 director_address: "",
  director_identity_verification: "",
  ultimate_business_owner_name: "",
  ultimate_business_owner_address: "",
  ultimate_business_owner_name_2: "",
  ultimate_business_owner_address_2: "",
  business_certificate: "",
  form_3: ""
});



const handleFileUpload = () => {};
</script>

<style scoped lang="scss">
.option-field {
  @apply rounded-lg text-green-500 py-3 px-4 font-semibold cursor-pointer border border-grey-200 w-full flex items-center justify-between;
}
</style>
