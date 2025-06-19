<template>
  <StorefrontSetupWrapper
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'SetupStoreDetails' })"
    @onContinueClick="handleContactDetailsUpdate"
  >
    <TextFieldInput
      labelId="storeAddress"
      labelTitle="Contact Address"
      :labelCompact="false"
      :inputType="IInputType.Text"
      :inputValue="storefrontPayload.address"
      :isTextArea="true"
      inputPlaceholder="Provide a contact address for your store"
      :isRequired="true"
      @inputChanged="storefrontPayload.address = $event"
      :errorHandler="{
        validator: 'validateRequired',
        message: 'Store address is a required field',
      }"
    />

    <TextFieldInput
      labelId="storeEmail"
      labelTitle="Email Address"
      :labelCompact="false"
      :inputType="IInputType.Email"
      :inputValue="storefrontPayload.email"
      inputPlaceholder="Provide a unique email for your store"
      :isRequired="true"
      @inputChanged="storefrontPayload.email = $event"
      :errorHandler="{
        validator: 'validateEmail',
        message: 'Please provide a valid email address',
      }"
    />

    <PhoneFieldInput
      labelId="storePhoneNumber"
      labelTitle="Phone Number"
      :labelCompact="false"
      :inputValue="storefrontPayload.phone_number"
      inputPlaceholder="Provide a business phone number"
      :isRequired="true"
      :activeCountryCode="phoneCountryCode"
      @countryCodeChanged="phoneCountryCode = $event"
      @inputChanged="storefrontPayload.phone_number = $event"
      @inputValidated="phoneValidity = $event"
      :errorHandler="{
        validator: 'validatePhone',
      }"
    />

    <div class="form-block mt-1">
      <label class="form-label-basic">Social profiles</label>

      <div class="form-wrapper">
        <div class="form-input-block form-control form-input">
          <div class="form-placeholder">https://facebook.com/</div>
          <input
            type="text"
            class=""
            placeholder="facebook name"
            v-model="storefrontPayload.facebook"
          />
        </div>

        <div class="form-input-block form-control form-input">
          <div class="form-placeholder">https://instagram.com/</div>
          <input
            type="text"
            class=""
            placeholder="instagram username"
            v-model="storefrontPayload.instagram"
          />
        </div>

        <div class="form-input-block form-control form-input">
          <div class="form-placeholder">https://twitter.com/</div>
          <input
            type="text"
            class=""
            placeholder="twitter username"
            v-model="storefrontPayload.twitter"
          />
        </div>

        <div class="form-input-block form-control form-input">
          <div class="form-placeholder">https://tiktok.com/@</div>
          <input
            type="text"
            class=""
            placeholder="tiktok username"
            v-model="storefrontPayload.tikTok"
          />
        </div>
      </div>
    </div>
  </StorefrontSetupWrapper>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { IInputType } from "@packages/models";
import { TextFieldInput, PhoneFieldInput } from "@packages/uikit";
import StorefrontSetupWrapper from "@/modules/storefront/components/storefront-setup-wrapper.vue";

type IStorefrontType = {
  address: string;
  email: string;
  phone_number: string;
  facebook: "";
  instagram: "";
  twitter: "";
  tikTok: "";
};

const storefrontPayload = ref<IStorefrontType>({
  address: "",
  email: "",
  phone_number: "",
  facebook: "",
  instagram: "",
  twitter: "",
  tikTok: "",
});

const router = useRouter();
const stopClickHandler = ref<boolean>(false);

const phoneValidity = ref<boolean>(false);

const phoneCountryCode = ref<string>("260");

const isActionReady = computed(() => {
  return storefrontPayload.value.address &&
    storefrontPayload.value.email &&
    storefrontPayload.value.phone_number &&
    phoneValidity.value
    ? false
    : true;
});

const handleContactDetailsUpdate = () => {
  router.push({ name: "SetupPaymentDetails" });
};
</script>

<style scoped lang="scss">
.form-wrapper {
  @apply flex flex-col justify-start items-start gap-y-3;

  .form-input-block {
    @apply relative w-full;
  }

  .form-input {
    @apply w-full text-grey-600 text-[13.5px] placeholder:text-[13.5px] py-[12.75px] px-4 border-grey-300 hover:border-green-400/80 focus:border-green-400;
  }

  .form-input-block {
    @apply relative w-full flex justify-start items-center;

    .form-placeholder {
      @apply text-grey-500/65 mr-[1px];
    }

    .icon-caret-down {
      @apply absolute top-1/2 right-4 transform -translate-y-1/2 text-grey-700 text-sm z-10;
    }
  }
}
</style>
