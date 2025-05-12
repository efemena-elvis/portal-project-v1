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
        @submit.prevent="handleSubmitQuestionnaire"
        class="flex flex-col w-full max-w-xl gap-4 mx-auto"
      >
        <TextFieldInput
          :labelCompact="false"
          labelId="fullName"
          labelTitle="Full Name"
          :inputType="IInputType.Text"
          inputPlaceholder="eg. John Doe."
          isRequired
          :inputValue="questionnairePayload.full_name"
          @inputChanged="questionnairePayload.full_name = $event"
          @inputValidated="payloadValidity.full_name = $event"
          :errorHandler="{
            validator: 'validateRequired',
            message: 'Full name is a required field.',
          }"
        />
        <TextFieldInput
          :labelCompact="false"
          labelId="companyName"
          labelTitle="Company Name"
          :inputType="IInputType.Text"
          inputPlaceholder="Provide a registered company name."
          isRequired
          :inputValue="questionnairePayload.company_name"
          @inputChanged="questionnairePayload.company_name = $event"
          @inputValidated="payloadValidity.company_name = $event"
          :errorHandler="{
            validator: 'validateRequired',
            message: 'Company name is a required field.',
          }"
        />

        <TextFieldInput
          :labelCompact="false"
          labelId="email"
          labelTitle="Business Email Address"
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
          @inputValidated="payloadValidity.phone_number = $event"
          :errorHandler="{
            validator: 'validatePhone',
            message: 'Phone number is a required field.',
          }"
        />

        <TextFieldInput
          :labelCompact="false"
          labelId="website"
          labelTitle="Company Website"
          isRequired
          inputPlaceholder="www.companyname.com"
          :inputType="IInputType.Url"
          :inputValue="questionnairePayload.website_link"
          @inputChanged="questionnairePayload.website_link = $event"
          @inputValidated="payloadValidity.website_link = $event"
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
          :selectValue="questionnairePayload.sub_merchant_range"
          @onSelectionChange="questionnairePayload.sub_merchant_range = $event"
          isRequired
        />
        <div v-if="questionnairePayload.sub_merchant_range === 'above-1000'">
          <TextFieldInput
            labelId="subMerchantsOther"
            inputPlaceholder="Please Specify"
            :inputType="IInputType.Text"
            :inputValue="subMerchantsOther"
            @inputChanged="subMerchantsOther = $event"
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
          :selectValue="
            questionnairePayload.estimated_monthly_transactions_value
          "
          @onSelectionChange="
            questionnairePayload.estimated_monthly_transactions_value = $event
          "
          isRequired
        />
        <div
          v-if="
            questionnairePayload.estimated_monthly_transactions_value ===
            'above-1000000'
          "
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
              message: 'Please specify a value.',
            }"
          />
        </div>

        <div class="mb-4">
          <h2 class="mb-4 text-sm font-semibold text-grey-900">
            Business Registration Document
          </h2>

          <FileUploadInput
            id="business_registration_document_url"
            :hasDocumentUploaded="
              !!questionnairePayload.business_registration_document_url
            "
            :uploadAction="uploadFile"
            @onDocumentUploaded="
              questionnairePayload.business_registration_document_url = $event
            "
          />
        </div>

        <div class="mb-4">
          <h2 class="mb-4 text-sm font-semibold text-grey-900">
            Directors and Shareholders Details (Form 3)
          </h2>

          <FileUploadInput
            id="director_and_shareholders_document_url"
            :hasDocumentUploaded="
              !!questionnairePayload.director_and_shareholders_document_url
            "
            :uploadAction="uploadFile"
            @onDocumentUploaded="
              questionnairePayload.director_and_shareholders_document_url =
                $event
            "
          />
        </div>

        <div class="mb-4">
          <h2 class="mb-4 text-sm font-semibold text-grey-900">
            Director's ID
          </h2>

          <FileUploadInput
            :hasDocumentUploaded="
              !!questionnairePayload.directors_id_document_url
            "
            :uploadAction="uploadFile"
            @onDocumentUploaded="
              questionnairePayload.directors_id_document_url = $event
            "
            id="directors_id_document_url"
          />
        </div>

        <button
          ref="questionnaireBtnRef"
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
import { useEvents, useString } from "@packages/hooks";
import { countryCurrencies } from "@packages/constants";
import { useExternalStore } from "../store";
import axios from "axios";

interface IQuestionnairePayload {
  full_name: string;
  company_name: string;
  phone_number: string;
  website_link: string;
  sub_merchant_range: string;
  country_uuid: string;
  countries: string[];
  estimated_monthly_transactions_value: string;
  email: string;
  business_registration_document_url: string;
  directors_id_document_url: string;
  director_and_shareholders_document_url: string;
  [key: string]: any;
}

const { processAPIRequest, pushToastAlert } = useEvents();
const { renderImg } = useImage();
const { getBusinessCountries, uploadFile } = useGlobalStore();
const { formatPhoneNumber } = useString();
const { submitQuestionnaire } = useExternalStore();

const phoneCountryCode = ref("234");
const phoneNumberInput = ref("");
const subMerchantsOther = ref("");
const transactionValueOther = ref("");

const questionnaireBtnRef = ref(null);

const subMerchantsOptions = [
  { name: "1–100", value: "1-100" },
  { name: "101–500", value: "101-500" },
  { name: "501–1000", value: "501-1000" },
  { name: "Above 1000", value: "above-1000" },
];

const transactionValues = [
  { value: "500001-1000000", name: "$500001 - $1000000" },
  { value: "1000001-5000000", name: "$1000001 - $5000000" },
  { value: "5000001-10000000", name: "$5000001 - $10000000" },
  { value: "above-1000000", name: "Above $1000,000" },
];

const questionnairePayload = ref<IQuestionnairePayload>({
  full_name: "",
  phone_number: "",
  company_name: "",
  website_link: "",
  sub_merchant_range: "",
  countries: [] as string[],
  estimated_monthly_transactions_value: "",
  country_uuid: "",
  email: "",
  directors_id_document_url: "",
  business_registration_document_url: "",
  director_and_shareholders_document_url: "",
});

const payloadValidity = ref({
  full_name: false,
  company_name: false,
  phone_number: false,
  website_link: false,
  sub_merchant_range: false,
  countries: false,
  estimated_monthly_transactions_value: false,
  email: false,
});

const getCountryName = computed(() => {
  const country = countryCurrencies.find(
    (country) => country.dialing_code === phoneCountryCode.value
  );

  return country?.country || "Nigeria";
});

const fetchSingleCountryUUID = async (): Promise<string> => {
  const response = await processAPIRequest({
    action: getBusinessCountries,
    payload: {},
  });

  if (response.code === 200) {
    const country = response.data.find(
      (item: { name: string }) =>
        item.name.trim().toLowerCase() ===
        getCountryName.value.trim().toLowerCase()
    );
    return country?.id || "";
  }
  return "";
};

const fetchCountriesUUID = async (): Promise<string[]> => {
  const response = await processAPIRequest({
    action: getBusinessCountries,
    payload: {},
  });

  if (response.code === 200) {
    return questionnairePayload.value.countries.map((countryName) => {
      const match = response.data.find(
        (item: { name: string }) =>
          item.name.trim().toLowerCase() === countryName.trim().toLowerCase()
      );
      return match?.id || countryName;
    });
  }
  return [];
};

const finalTransactionValue = computed(() =>
  questionnairePayload.value.estimated_monthly_transactions_value ===
  "above-1000000"
    ? transactionValueOther.value
    : questionnairePayload.value.estimated_monthly_transactions_value
);
const finalSubMerchants = computed(() =>
  questionnairePayload.value.sub_merchant_range === "above-1000"
    ? subMerchantsOther.value
    : questionnairePayload.value.sub_merchant_range
);

const isQuestionnaireReady = computed(() => {
  const payload = questionnairePayload.value;
  return !!(
    payload.full_name &&
    payload.company_name &&
    payload.phone_number &&
    payload.website_link &&
    payload.sub_merchant_range &&
    payload.estimated_monthly_transactions_value &&
    payload.countries.length > 0 &&
    payload.email &&
    payload.business_registration_document_url &&
    payload.director_and_shareholders_document_url &&
    payload.directors_id_document_url &&
    payloadValidity.value.full_name &&
    payloadValidity.value.company_name &&
    payloadValidity.value.phone_number &&
    payloadValidity.value.website_link &&
    payloadValidity.value.email
  );
});

const handleSubmitQuestionnaire = async () => {
  const country_uuid = await fetchSingleCountryUUID();
  const countries = await fetchCountriesUUID();

  try {
    if (isQuestionnaireReady.value) {
      const response = await processAPIRequest({
        action: submitQuestionnaire,
        btnRef: questionnaireBtnRef,
        btnText: "Submit Questionnaire",
        payload: {
          ...questionnairePayload.value,
          estimated_monthly_transactions_value: finalTransactionValue.value,
          sub_merchant_range: finalSubMerchants.value,
          country_uuid,
          countries,
        },

        showAlert: true,
      });
      if (response.code === 201) {
        pushToastAlert({
          message: "Response submitted successfully.",
          type: "success",
        });

       
      } else if (response.code === 400) {
        pushToastAlert({
          message: "Email already exists.",
          type: "error",
        });
      } else {
        pushToastAlert({
          message: "Response submission failed.",
          type: "error",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

watch([phoneNumberInput, phoneCountryCode], () => {
  questionnairePayload.value.phone_number = formatPhoneNumber(
    phoneNumberInput.value,
    phoneCountryCode.value
  );
});
</script>
