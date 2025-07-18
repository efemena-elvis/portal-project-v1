<template>
  <AuthWrapper
    title_text="Create an account"
    meta_text="Get started with a secure and seamless sign-up flow."
    :center_placement="appVariant === 'alexpay' ? true : false"
    :show_logo="appVariant === 'alexpay' ? true : false"
    hasBottomPadding
  >
    <form @submit.prevent="handleUserSignup">
      <!-- BUSINESS NAME -->
      <TextFieldInput
        labelId="businessName"
        labelTitle="Business name"
        :labelCompact="false"
        :inputType="IInputType.Text"
        :inputValue="signupPayload.business_name"
        inputPlaceholder="Provide a registered business name"
        isRequired
        @inputChanged="signupPayload.business_name = $event"
        @inputValidated="payloadValidity.business_name = $event"
        :errorHandler="{
          validator: 'validateRequired',
          message: 'Business name is a required field',
        }"
      />

      <!-- BUSINESS LOCATION -->
      <SelectFieldInput
        labelId="businessCountry"
        labelTitle="Business location"
        :labelCompact="false"
        inputPlaceholder="Select country of business registeration"
        :inputValue="signupPayload.country_id"
        :selectData="validCountries"
        isRequired
        @onSelectionChange="signupPayload.country_id = $event"
      />

      <!-- EMAIL ADDRESS -->
      <TextFieldInput
        labelId="businessEmail"
        labelTitle="Email address"
        :labelCompact="false"
        :inputType="IInputType.Email"
        :inputValue="signupPayload.email"
        inputPlaceholder="hello@companyname.com"
        isRequired
        @inputChanged="signupPayload.email = $event"
        @inputValidated="payloadValidity.email = $event"
        :errorHandler="{
          validator: 'validateEmail',
        }"
      />

      <!-- PASSWORD -->
      <TextFieldInput
        labelId="userPassword"
        labelTitle="Choose a password"
        :labelCompact="false"
        :inputType="IInputType.Password"
        :inputValue="signupPayload.password"
        inputPlaceholder="Please enter your password"
        isRequired
        @inputChanged="signupPayload.password = $event"
        @inputValidated="payloadValidity.password = $event"
        :errorHandler="{
          validator: 'validatePasswordStrength',
        }"
      />

      <div class="helper-row mt-5 mb-6">
        <div class="text">
          By clicking the “<span class="font-semibold">Create your account</span
          >” button, you agree to
          {{ appVariant === "alexpay" ? "AlexPay" : "Redstone" }}
          <a href="">terms and conditions</a>.
        </div>
      </div>

      <button
        class="btn btn-primary w-full my-5"
        ref="signupBtnRef"
        :disabled="isSignupReady"
      >
        Create your account
      </button>

      <div class="helper-row justify-center mt-5">
        <div class="text">
          Already have an account?
          <router-link :to="{ name: 'VesicashLogin' }">Login</router-link>
        </div>
      </div>
    </form>
  </AuthWrapper>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { IInputType } from "@packages/models";
import { TextFieldInput, SelectFieldInput } from "@packages/uikit";
import { useEvents, useAppVariant } from "@packages/hooks";
import AuthWrapper from "@/modules/auth/components/auth-wrapper.vue";
import merchantCountries from "@/shared/utilities/merchant-countries";
import { useAuthStore } from "@/modules/auth/store";
import { useGlobalStore } from "@/modules/global/store";

type ISignupInputType = {
  business_name: string;
  country_id: string;
  email: string;
  password: string;
};

type IInputValidity = {
  business_name: boolean;
  email: boolean;
  password: boolean;
};

const router = useRouter();

const { signupUser } = useAuthStore();
const { getBusinessCountries } = useGlobalStore();
const { processAPIRequest } = useEvents();

const appVariant = ref<string>(useAppVariant());

const signupBtnRef = ref(null);

const signupPayload = ref<ISignupInputType>({
  business_name: "",
  country_id: "98e7ad5b-d718-41d1-ab38-10a245ff4279",
  email: "",
  password: "",
});

const payloadValidity = ref<IInputValidity>({
  business_name: false,
  email: false,
  password: false,
});

const validCountries = ref<{ value: string; name: string }[]>([
  {
    value: "98e7ad5b-d718-41d1-ab38-10a245ff4279",
    name: "Nigeria",
  },
]);

const isSignupReady = computed(() => {
  return signupPayload.value.email &&
    signupPayload.value.password &&
    signupPayload.value.business_name &&
    signupPayload.value.country_id &&
    payloadValidity.value.email &&
    payloadValidity.value.password &&
    payloadValidity.value.business_name
    ? false
    : true;
});

const getSignupPayload = computed(() => {
  const { email, password, business_name, country_id } = signupPayload.value;
  return { email, password, business_name, country_id };
});

// Handle fetching of country details
const fetchCountries = async () => {
  const response = await processAPIRequest({
    action: getBusinessCountries,
    payload: {},
  });

  if (response.code === 200) {
    // Step 1: Create a Set of merchant country codes (lowercased)
    const merchantCountryCodes = new Set(
      merchantCountries.map((merchant) => merchant.code.toLowerCase())
    );

    // Step 2: Filter the countries array based on the Set
    const filteredCountries = response.data
      .filter((country: any) =>
        merchantCountryCodes.has(country.country_code.toLowerCase())
      )
      .map((country: any) => ({
        name: country.name,
        value: country.id,
      }))
      .sort((a: any, b: any) => a.name.localeCompare(b.name));

    const getNigeria = filteredCountries.find(
      (country: any) => country.name === "Nigeria"
    );

    validCountries.value = filteredCountries;
    signupPayload.value.country_id = getNigeria.value;
  }
};

const handleUserSignup = async () => {
  const response = await processAPIRequest({
    action: signupUser,
    payload: getSignupPayload.value,
    btnRef: signupBtnRef,
    btnText: "Create your account",
    alertHandler: {
      201: {
        message: "Merchant account created",
        description: "Proceed to verify your account email address",
        type: "success",
      },

      400: {
        message: "Account creation failed",
        type: "error",
      },
    },
  });

  // REDIRECT TO EMAIL VERIFICATION PAGE
  if (response.code === 201) {
    setTimeout(() => {
      router.push({
        name: "VesicashVerifyAccount",
        query: { email: encodeURIComponent(signupPayload.value.email) },
      });

      localStorage.clear();
    }, 2000);
  }
};

// FETCH ALL COUNTRIES ON MOUNT
fetchCountries();
</script>

<style lang="scss" scoped></style>
