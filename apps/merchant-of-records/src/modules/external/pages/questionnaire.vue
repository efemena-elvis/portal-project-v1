<template>
  <div>
    <div class="border-b-2 border-gray-200 p-6 flex items-center bg-white">
      <img
        :src="renderImg('vesicash-svg.svg')"
        alt="Vesicash Logo"
        class="h-10 w-auto"
      />
    </div>

    <div
      class="w-full px-6 sm:px-10 lg:px-16 xl:px-20 pt-6 flex flex-col items-center gap-4 text-center"
    >
      <h1 class="text-3xl font-bold text-grey-900">
        Aggregators Questionnaire
      </h1>
      <p class="text-grey-500 max-w-3xl">
        Expand your business rapidly across Africa with Vesicash. Launch
        operations in these markets: Nigeria, Ghana, Tanzania, Kenya, Zambia,
        and Rwanda.
      </p>
    </div>

    <div class="px-6 py-16">
      <form @submit.prevent="handleSubmit" class="mx-auto max-w-2xl w-full flex flex-col gap-4">
        <TextFieldInput
          :labelCompact="false"
          labelId="companyName"
          labelTitle="Company Name"
          :inputType="IInputType.Text"
          inputPlaceholder="Provide a registered company name"
          isRequired
          :inputValue="questionnairePayload.companyName"
          @inputChanged="questionnairePayload.companyName = $event"
          :errorHandler="{
            validator: 'validateRequired',
            message: 'Company name is a required field',
          }"
        />

        <PhoneFieldInput
          labelId="phoneNumber"
          labelTitle="Phone Number"
          inputPlaceholder="Provide a business phone number"
          :isRequired="true"
          :activeCountryCode="phoneCountryCode"
          :inputValue="phoneNumberInput"
          @inputChanged="phoneNumberInput = $event"
          @countryCodeChanged="phoneCountryCode = $event"
          :errorHandler="{ validator: 'validatePhone' }"
        />

        <TextFieldInput
          :labelCompact="false"
          labelId="website"
          labelTitle="Website"
          isRequired
          inputPlaceholder="www.companyname.com"
          :inputType="IInputType.Text"
          :inputValue="questionnairePayload.website"
          @inputChanged="questionnairePayload.website = $event"
          :errorHandler="{
            validator: 'validateRequired',
            message: 'Website is a required field',
          }"
       
        />

        <SelectFieldInput
          labelId="subMerchants"
          labelTitle="How many sub-merchants do you have?"
          inputPlaceholder="Select number of sub-merchants"
          :selectData="subMerchantsOptions"
          :selectValue="questionnairePayload.subMerchants"
          @onSelectionChange="questionnairePayload.subMerchants = $event"
          isRequired
        />
        <div v-if="questionnairePayload.subMerchants === 'other'">
          <TextFieldInput
            labelId="subMerchantsOther"
            inputPlaceholder="Please Specify"
            :inputType="IInputType.Text"
            :inputValue="subMerchantsOther"
            @inputChanged="subMerchantsOther = $event"
            isRequired
            :errorHandler="{
              validator: 'validateRequired',
              message: 'Please specify a value',
            }"
          />
        </div>

        <MultiSelectFieldInput
          :labelCompact="false"
          labelId="countries"
          labelTitle="What Countries Do You Want To Expand Into?"
          inputPlaceholder="Select your preferred countries"
          :inputValueList="questionnairePayload.countries"
          @onSelectionChange="questionnairePayload.countries = $event"
          :selectData="[
            { value: 'nigeria', name: 'Nigeria' },
            { value: 'ghana', name: 'Ghana' },
            { value: 'kenya', name: 'Kenya' },
            { value: 'tanzania', name: 'Tanzania' },
            { value: 'zambia', name: 'Zambia' },
            { value: 'rwanda', name: 'Rwanda' },
          ]"
          isRequired
        />

        <SelectFieldInput
          labelId="transactionValue"
          labelTitle="Estimated monthly transaction value in USD"
          inputPlaceholder="Select monthly transaction value"
          :selectData="transactionValues"
          :selectValue="questionnairePayload.transactionValue"
          @onSelectionChange="questionnairePayload.transactionValue = $event"
          isRequired
        />
        <div
          v-if="questionnairePayload.transactionValue === 'above-100000'"
          
        >
          <TextFieldInput
            labelId="transactionValueOther"
            inputPlaceholder="Please Specify"
            :inputType="IInputType.Text"
            :inputValue="transactionValueOther"
            @inputChanged="transactionValueOther = $event"
            isRequired
            :errorHandler="{
              validator: 'validateRequired',
              message: 'Please specify a value',
            }"
          />
        </div>

        <TextFieldInput
          :labelCompact="false"
          labelId="email"
          labelTitle="Email Address"
          :inputType="IInputType.Email"
          :inputValue="questionnairePayload.email"
          @inputChanged="questionnairePayload.email = $event"
          inputPlaceholder="hello@companyname.com"
          isRequired
          :errorHandler="{ validator: 'validateEmail' }"
        />

        <TextFieldInput
          :labelCompact="false"
          labelId="compliance"
          labelTitle="Compliance"
          :inputType="IInputType.Text"
          :inputValue="questionnairePayload.compliance"
          @inputChanged="questionnairePayload.compliance = $event"
          inputPlaceholder="Description (optional)"
        />

        <div class="mb-4">
          <h2 class="text-sm font-semibold text-grey-900 mb-4">
            Business Registration Document
          </h2>
          <FileUploadInput
            :hasDocumentUploaded="!!businessDoc"
            :uploadedDocumentContent="getUploadedDocumentContent('business')"
            :uploadAction="uploadFile"
            @onDocumentUploaded="businessDoc = $event"
          />
        </div>

        <div class="mb-4">
          <h2 class="text-sm font-semibold text-grey-900 mb-4">
            Directors and Shareholders Details (Form 3)
          </h2>
          <FileUploadInput
            :hasDocumentUploaded="!!directorsDoc"
            :uploadedDocumentContent="getUploadedDocumentContent('directors')"
            :uploadAction="uploadFile"
            @onDocumentUploaded="directorsDoc = $event"
          />
        </div>

        <div class="mb-4">
          <h2 class="text-sm font-semibold text-grey-900 mb-4">
            Director's ID
          </h2>
          <FileUploadInput
            :hasDocumentUploaded="!!directorsId"
            :uploadedDocumentContent="getUploadedDocumentContent('id')"
            :uploadAction="uploadFile"
            @onDocumentUploaded="directorsId = $event"
          />
        </div>

        <button
          class="btn btn-primary w-full my-5"
          :disabled="!isQuestionnaireReady"
        >
          Submit Questionnaire
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useImage } from "@/shared/composables";
import { IInputType } from "@packages/models";
import TextFieldInput from "@packages/uikit/src/components/form-comps/text-field-input.vue";
import PhoneFieldInput from "@packages/uikit/src/components/form-comps/phone-field-input.vue";
import MultiSelectFieldInput from "@packages/uikit/src/components/form-comps/multi-select-field-input.vue";
import SelectFieldInput from "@packages/uikit/src/components/form-comps/select-field-input.vue";
import FileUploadInput from "@packages/uikit/src/components/form-comps/file-upload-input.vue";
import { useGlobalStore } from "@/modules/global/store";
import { useComplianceStore } from "@/modules/compliance/store";
import { storeToRefs } from "pinia";
import { useString } from "@packages/hooks";

interface IQuestionnairePayload {
  companyName: string;
  phoneNumber: string;
  website: string;
  subMerchants: string;
  countries: string[];
  transactionValue: string;
  email: string;
  compliance?: string;
}

interface IFinalQuestionnairePayload extends IQuestionnairePayload {
  documents: {
    businessRegistration: string;
    directorsDetails: string;
    directorId: string;
  };
}

const { renderImg } = useImage();
const { uploadFile } = useGlobalStore();
const complianceStore = useComplianceStore();
// const { getComplianceBusiness } = storeToRefs(complianceStore);
const { formatPhoneNumber } = useString();

const phoneCountryCode = ref("234");
const phoneNumberInput = ref("");
const subMerchantsOther = ref("");
const transactionValueOther = ref("");

const subMerchantsOptions = [
  { name: "1–100", value: "1-100" },
  { name: "101–500", value: "101-500" },
  { name: "501–1000", value: "501-1000" },
  { name: "Above 1000", value: "above-1000" },
  { name: "Other", value: "other" },
];

const transactionValues = [
  { value: "0-1000", name: "$0 - $1,000" },
  { value: "1000-5000", name: "$1,000 - $5,000" },
  { value: "5000-10000", name: "$5,000 - $10,000" },
  { value: "10000-50000", name: "$10,000 - $50,000" },
  { value: "50000-100000", name: "$50,000 - $100,000" },
  { value: "above-100000", name: "Above $100,000" },
];

const questionnairePayload = ref({
  phoneNumber: "",
  companyName: "",
  website: "",
  subMerchants: "",
  countries: [] as string[],
  transactionValue: "",
  email: "",
  compliance: "",
});

const finalTransactionValue = computed(() =>
  questionnairePayload.value.transactionValue === "above-100000"
    ? transactionValueOther.value
    : questionnairePayload.value.transactionValue
);
const finalSubMerchants = computed(() =>
  questionnairePayload.value.subMerchants === "other"
    ? subMerchantsOther.value
    : questionnairePayload.value.subMerchants
);

watch([phoneNumberInput, phoneCountryCode], () => {
  questionnairePayload.value.phoneNumber = formatPhoneNumber(
    phoneNumberInput.value,
    phoneCountryCode.value
  );
});

const businessDoc = ref("");
const directorsDoc = ref("");
const directorsId = ref("");

const getUploadedDocumentContent = (type: "business" | "directors" | "id") => {
  const docMap = {
    business: businessDoc.value,
    directors: directorsDoc.value,
    id: directorsId.value,
  };
  return docMap[type]
    ? {
        name: `${type.toUpperCase()} Document`,
        link: docMap[type],
      }
    : undefined;
};

const isQuestionnaireReady = computed(() => {
  const payload = questionnairePayload.value;
  return !!(
    payload.companyName &&
    payload.phoneNumber &&
    payload.website &&
    payload.subMerchants &&
    payload.transactionValue &&
    payload.countries.length > 0 &&
    payload.email
  );
});

const getQuestionnairePayload = computed(() => {
  return {
    companyName: questionnairePayload.value.companyName,
    phoneNumber: questionnairePayload.value.phoneNumber,
    website: questionnairePayload.value.website,
    subMerchants: finalSubMerchants.value,
    countries: questionnairePayload.value.countries,
    transactionValue: finalTransactionValue.value,
    email: questionnairePayload.value.email,
    compliance: questionnairePayload.value.compliance,
    documents: {
      businessRegistration: businessDoc.value,
      directorsDetails: directorsDoc.value,
      directorId: directorsId.value,
    },
  };
});

const handleSubmit = () => {
  if (isQuestionnaireReady.value) {
    console.log(getQuestionnairePayload.value);
  } else {
    console.error("❌ Form is not ready for submission");
  }
};
</script>
