<template>
  <div>
    <div class="flex items-center p-6 bg-white border-b-2 border-gray-200">
      <img
        :src="renderImg('vesicash-svg.svg')"
        alt="Vesicash Logo"
        class="w-auto h-10"
      />
    </div>

    <div
      class="flex flex-col items-center w-full gap-4 px-6 pt-6 text-center sm:px-10 lg:px-16 xl:px-20"
    >
      <h1 class="text-3xl font-bold text-grey-900">
        Aggregators Questionnaire
      </h1>
      <p class="max-w-3xl text-grey-500">
        Expand your business rapidly across Africa with Vesicash. Launch
        operations in these markets: Nigeria, Ghana, Tanzania, Kenya, Zambia,
        and Rwanda.
      </p>
    </div>

    <div class="px-6 py-16">
      <form
        @submit.prevent="handleSubmit"
        class="flex flex-col w-full max-w-2xl gap-4 mx-auto"
      >
        <TextFieldInput
          :labelCompact="false"
          labelId="companyName"
          labelTitle="Company Name"
          :inputType="IInputType.Text"
          inputPlaceholder="Provide a registered company name."
          isRequired
          :inputValue="questionnairePayload.companyName"
          @inputChanged="questionnairePayload.companyName = $event"
          @inputValidated="payloadValidity.companyName = $event"
          :errorHandler="{
            validator: 'validateRequired',
            message: 'Company name is a required field.',
          }"
        />

        <PhoneFieldInput
          labelId="phoneNumber"
          labelTitle="Phone Number"
          inputPlaceholder="Provide a business phone number."
          :inputType="IInputType.Number"
          :isRequired="true"
          :activeCountryCode="phoneCountryCode"
          :inputValue="phoneNumberInput"
          @inputChanged="phoneNumberInput = $event"
          @countryCodeChanged="phoneCountryCode = $event"
          @inputValidated="payloadValidity.phoneNumber = $event"
          :errorHandler="{
            validator: 'validatePhone',
            message: 'Phone number is a required field.',
          }"
        />

        <TextFieldInput
          :labelCompact="false"
          labelId="website"
          labelTitle="Website"
          isRequired
          inputPlaceholder="www.companyname.com"
          :inputType="IInputType.Url"
          :inputValue="questionnairePayload.website"
          @inputChanged="questionnairePayload.website = $event"
          @inputValidated="payloadValidity.website = $event"
          :errorHandler="{
            validator: 'validateURL',
            message: 'Enter a valid url.',
          }"
        />

        <SelectFieldInput
          labelId="subMerchants"
          labelTitle="How many sub-merchants do you have?"
          inputPlaceholder="Select number of sub-merchants."
          :selectData="subMerchantsOptions"
          :selectValue="questionnairePayload.subMerchants"
          @onSelectionChange="questionnairePayload.subMerchants = $event"
          @inputValidated="payloadValidity.subMerchants = $event"
          isRequired
        />
        <div v-if="questionnairePayload.subMerchants === 'other'">
          <TextFieldInput
            labelId="subMerchantsOther"
            inputPlaceholder="Please Specify"
            :inputType="IInputType.Text"
            :inputValue="subMerchantsOther"
            @inputChanged="subMerchantsOther = $event"
            @inputValidated="payloadValidity.subMerchants = $event"
            isRequired
            :errorHandler="{
              validator: 'validateRequired',
              message: 'Please specify a value.',
            }"
          />
        </div>

        <MultiSelectFieldInput
          :labelCompact="false"
          labelId="countries"
          labelTitle="What Countries Do You Want To Expand Into?"
          inputPlaceholder="Select your preferred countries."
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
          labelTitle="Estimated monthly transaction value in USD."
          inputPlaceholder="Select monthly transaction value."
          :selectData="transactionValues"
          :selectValue="questionnairePayload.transactionValue"
          @onSelectionChange="questionnairePayload.transactionValue = $event"
          isRequired
        />
        <div v-if="questionnairePayload.transactionValue === 'above-100000'">
          <TextFieldInput
            labelId="transactionValueOther"
            inputPlaceholder="Please Specify"
            :inputType="IInputType.Text"
            :inputValue="transactionValueOther"
            @inputChanged="transactionValueOther = $event"
            isRequired
            :errorHandler="{
              validator: 'validateRequired',
              message: 'Please specify a value.',
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
          @inputValidated="payloadValidity.email = $event"
          inputPlaceholder="hello@companyname.com"
          isRequired
          :errorHandler="{
            validator: 'validateEmail',
            message: 'Email is a required field.',
          }"
        />

        <TextFieldInput
          :labelCompact="false"
          labelId="compliance"
          isRequired
          labelTitle="Compliance"
          :inputType="IInputType.Text"
          :inputValue="questionnairePayload.compliance"
          @inputChanged="questionnairePayload.compliance = $event"
          @inputValidated="payloadValidity.compliance = $event"
          inputPlaceholder="Description"
          :errorHandler="{
            validator: 'validateRequired',
            message: 'Compliance is a required field.',
          }"
        />

        <div class="mb-4">
          <h2 class="mb-4 text-sm font-semibold text-grey-900">
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
          <h2 class="mb-4 text-sm font-semibold text-grey-900">
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
          <h2 class="mb-4 text-sm font-semibold text-grey-900">
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
          class="w-full my-5 btn btn-primary"
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
import { useEvents, useString } from "@packages/hooks";
import { countryCurrencies } from "@packages/constants";

interface IQuestionnairePayload {
  companyName: string;
  phoneNumber: string;
  website: string;
  subMerchants: string;
  countries: string[];
  transactionValue: string;
  email: string;
  compliance: string;
}

interface IFinalQuestionnairePayload extends IQuestionnairePayload {
  documents: {
    businessRegistration: string;
    directorsDetails: string;
    directorId: string;
  };
}

const { processAPIRequest } = useEvents();
const { renderImg } = useImage();
const { uploadFile, getBusinessCountries } = useGlobalStore();
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

const payloadValidity = ref({
  companyName: false,
  phoneNumber: false,
  website: false,
  email: false,
  compliance: false,
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

const getCountryName = computed(() => {
  const country = countryCurrencies.find(
    (country) => country.dialing_code === phoneCountryCode.value
  );

  return country?.country || "Nigeria";
});

const fetchCountries = async () => {
  const response = await processAPIRequest({
    action: getBusinessCountries,
    payload: {},
  });

  if (response.code === 200) {
    const country = response.data.find(
      (country: { name: string }) => getCountryName.value === country.name
    );
    console.log(country?.name, country?.id);
    return country?.id;
  }
};

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
    (
      payload.companyName &&
      payload.phoneNumber &&
      payload.website &&
      payload.subMerchants &&
      payload.transactionValue &&
      payload.countries.length > 0 &&
      payload.email &&
      payload.compliance &&
      // businessDoc.value &&
      // directorsDoc.value &&
      // directorsId.value &&
      payloadValidity.value.companyName &&
      payloadValidity.value.phoneNumber &&
      payloadValidity.value.website &&
      payloadValidity.value.email &&
      payloadValidity.value.compliance
    )
 
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
// console.log(getUploadedDocumentContent);

const handleSubmit = () => {
  if (isQuestionnaireReady.value) {
    fetchCountries();
  } else {
    console.error("Form is not ready for submission");
  }
};
</script>
