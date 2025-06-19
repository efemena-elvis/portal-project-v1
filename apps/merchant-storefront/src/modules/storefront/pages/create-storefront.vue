<template>
  <StorefrontEntryWrapper
    showActionRow
    :pageData="[pageHeaderData]"
    :isPrimaryActionDisabled="isActionReady"
    :isSecondaryActionDisabled="isOnboardingPath"
    primaryActionText="Create Store"
  >
    <!-- STOREFRONT NAME -->
    <TextFieldInput
      labelId="storeName"
      labelTitle="What's the name of your store?"
      :labelCompact="false"
      :inputType="IInputType.Text"
      :inputValue="storefrontPayload.name"
      inputPlaceholder="Provide a unique name for your store"
      :isRequired="true"
      @inputChanged="storefrontPayload.name = $event"
      @inputValidated="storeNameValidity = $event"
      :errorHandler="{
        validator: 'validateAlphanumeric',
        message: 'Store name should only contain letters or numbers',
      }"
    />

    <!-- STOREFRONT URL -->
    <TextFieldInput
      labelId="storeUrl"
      labelTitle="Store Website URL"
      :labelCompact="false"
      :inputType="IInputType.Text"
      :inputValue="storefrontPayload.tag"
      inputPlaceholder="Provide a website store name"
      suffixText=".storoapp.com"
      :isRequired="true"
      @inputChanged="storefrontPayload.tag = $event"
      @inputValidated="storeNameValidity = $event"
      :errorHandler="{
        validator: 'validateAlphanumeric',
        message: 'Store URL should only contain letters or numbers',
      }"
    />

    <!-- STOREFRONT CURRENCY -->
    <SelectFieldInput
      labelId="storefrontCurrency"
      labelTitle="Select your store currency"
      :labelCompact="false"
      inputPlaceholder="Storefront currency"
      :inputValue="storefrontPayload.currency"
      :selectData="validCurrencies"
      isRequired
      @onSelectionChange="storefrontPayload.currency = $event"
    />

    <!-- STOREFRONT NICHES -->
    <SelectFieldInput
      labelId="storefrontCategory"
      labelTitle="Select your store category"
      :labelCompact="false"
      inputPlaceholder="Select storefront category"
      :inputValue="storefrontPayload.tag"
      :selectData="storefrontNicheOptions"
      isRequired
      @onSelectionChange="storefrontPayload.tag = $event"
    />
  </StorefrontEntryWrapper>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { IInputType } from "@packages/models";
import { TextFieldInput, SelectFieldInput } from "@packages/uikit";
import StorefrontEntryWrapper from "@/modules/storefront/components/storefront-entry-wrapper.vue";
import { useAuthStore } from "@/modules/auth/store";
import { useProfile } from "@packages/hooks";
import { storefrontNiches } from "@/modules/storefront/constants/storefront-niches";

type IStorefrontType = {
  name: string;
  currency: string;
  tag: string;
  business_id: string;
};

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const profileUtil = new useProfile(authStore);

const getBusinessProfile = computed(() => profileUtil.getBusiness());

const pageHeaderData = ref({
  name: "Create Storefront",
  route: "StorefrontCreate",
  title: "Define Your Store's Identity",
  description:
    "Every great store starts with a strong identity, let's lay the foundation today. You are just some few clicks away.",
});

const storefrontPayload = ref<IStorefrontType>({
  name: "",
  currency: "ZMW",
  tag: "",
  business_id: getBusinessProfile?.value?.businessId || "",
});

const storeNameValidity = ref<boolean>(false);

const validCurrencies = ref<{ value: string; name: string }[]>([
  { value: "ZMW", name: "Zambian Kwacha" },
]);

const storefrontNicheOptions = computed(() => {
  return storefrontNiches.map((niche) => {
    return { value: niche.slug, name: niche.nicheTitle };
  });
});

const createStorefrontBtnRef = ref(null);

const isActionReady = computed(() => {
  return storefrontPayload.value.name &&
    storeNameValidity.value &&
    storefrontPayload.value.tag
    ? false
    : true;
});

const isOnboardingPath = computed(() => {
  return route.query?.onboarding === "true";
});
</script>

<style lang="scss" scoped></style>
