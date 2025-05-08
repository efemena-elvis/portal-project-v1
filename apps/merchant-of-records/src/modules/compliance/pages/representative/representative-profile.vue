<template>
  <ComplianceWrapper
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'RedstoneRegistrationConfirm' })"
    @onContinueClick="handleRepresentativeProfileUpdate"
  >
    <MultiSelectFieldInput
      labelId="businessRole"
      labelTitle="Business Role"
      :labelCompact="false"
      inputPlaceholder="Select your representative business role"
      :inputValueList="businessPayload.business_role"
      :selectData="[
        { value: 'director', name: 'Director' },
        { value: 'shareholder', name: 'Shareholder' },
      ]"
      isRequired
      @onSelectionChange="businessPayload.business_role = $event"
    />

    <TextFieldInput
      labelId="legalFullName"
      labelTitle="Legal Full Name"
      :labelCompact="false"
      :inputType="IInputType.Text"
      :inputValue="businessPayload.legal_full_name"
      inputPlaceholder="Provide legal full name"
      :isRequired="true"
      @inputChanged="businessPayload.legal_full_name = $event"
      :errorHandler="{
        validator: 'validateRequired',
        message: 'Legal fullname is a required field',
      }"
    />

    <TextFieldInput
      labelId="dateOfBirth"
      labelTitle="Date of Birth"
      :labelCompact="false"
      :inputType="IInputType.Date"
      :inputValue="businessPayload.dob"
      inputPlaceholder="Provide representative date of birth"
      :isRequired="true"
      @inputChanged="businessPayload.dob = $event"
      @inputValidated="payloadValidity.dob = $event"
      :errorHandler="{
        validator: 'validateDateRange',
        range: 18,
        message: 'Date of birth should be over 18 years',
      }"
    />

    <SelectFieldInput
      labelId="nationality"
      labelTitle="Nationality"
      :labelCompact="false"
      inputPlaceholder="Select your representative nationality"
      :inputValue="businessPayload.nationality"
      :selectData="countryList"
      isRequired
      @onSelectionChange="businessPayload.nationality = $event"
    />

    <!-- { value: 'owner', name: 'Owner' }, -->

    <!-- <TextFieldInput
      v-if="
        businessPayload.business_role.includes('owner') ||
        businessPayload.business_role.includes('shareholder')
      "
      labelId="percentageOwnership"
      :labelCompact="false"
      labelTitle="Percentage ownership of the business"
      :inputType="IInputType.Number"
      :inputValue="businessPayload.percentage_ownership"
      inputPlaceholder="Provide the percentage ownership of the business"
      :isRequired="true"
      @inputChanged="businessPayload.percentage_ownership = $event"
      :errorHandler="{
        validator: 'validateRequired',
        message: 'Percentage ownership is a required field',
      }"
    /> -->
  </ComplianceWrapper>
</template>

<script setup lang="ts">
import { ref, computed, toRaw, watch } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { IInputType } from "@packages/models";
import {
  TextFieldInput,
  SelectFieldInput,
  MultiSelectFieldInput,
} from "@packages/uikit";
import { useComplianceUtil } from "@packages/hooks";
import { ComplianceWrapper } from "@/modules/compliance/components";
import { useComplianceStore } from "@/modules/compliance/store";
import { countryCurrencies } from "@packages/constants";

type IBusinessType = {
  legal_full_name: string;
  dob: string;
  nationality: string;
  business_role: string[];
  percentage_ownership: string;
};

type IInputValidity = {
  dob: boolean;
};

const router = useRouter();
const compliancStore = useComplianceStore();

const complianceUtil = new useComplianceUtil(compliancStore);
const { getComplianceRepresentative } = storeToRefs(compliancStore);

const countryList = ref<{ value: string; name: string }[]>([]);
const stopClickHandler = ref<boolean>(false);

const formatBusinessRoles = (
  businessRoleData: string | string[] | undefined
): string[] => {
  try {
    if (!businessRoleData) return []; // Return an empty array if undefined

    if (Array.isArray(businessRoleData)) {
      // Check if the first element of the array is a string with square brackets
      const firstElement = businessRoleData[0];
      if (
        typeof firstElement === "string" &&
        firstElement.startsWith("[") &&
        firstElement.endsWith("]")
      ) {
        // If it has square brackets, parse the string as JSON
        const parsedInnerArray = JSON.parse(firstElement);
        return Array.isArray(parsedInnerArray) ? parsedInnerArray : [];
      }
      // Otherwise, return the array as is
      return businessRoleData;
    }

    // If it's a string, attempt to parse it as JSON
    const parsedString = JSON.parse(businessRoleData);

    // Ensure the parsed string is an array
    return Array.isArray(parsedString) ? parsedString : [];
  } catch (error) {
    console.error("Error parsing business roles:", error);
    return []; // Return an empty array in case of error
  }
};

const getFullName = computed(() => {
  return getComplianceRepresentative.value?.[0]?.legal_first_name.length
    ? `${getComplianceRepresentative.value?.[0]?.legal_first_name} ${getComplianceRepresentative.value?.[0]?.legal_last_name}`
    : "";
});

const businessPayload = ref<IBusinessType>({
  legal_full_name: getFullName.value,
  dob: getComplianceRepresentative.value?.[0]?.dob || "",
  nationality: getComplianceRepresentative.value?.[0]?.nationality || "",
  business_role:
    formatBusinessRoles(
      getComplianceRepresentative.value?.[0]?.business_role
    ) || [],

  percentage_ownership:
    getComplianceRepresentative.value?.[0]?.percentage_ownership || "",
});

const payloadValidity = ref<IInputValidity>({
  dob: false,
});

const percentageOwnershipProvided = computed(() => {
  const { business_role, percentage_ownership } = businessPayload.value;

  if (
    business_role.includes("owner") ||
    business_role.includes("shareholder")
  ) {
    return parseFloat(percentage_ownership) > 0 ? true : false;
  }

  return true;
});

const isActionReady = computed(() => {
  return businessPayload.value.legal_full_name &&
    businessPayload.value.dob &&
    payloadValidity.value.dob &&
    businessPayload.value.nationality &&
    businessPayload.value.business_role.length &&
    percentageOwnershipProvided.value
    ? false
    : true;
});

const getBusinessPayload = computed(() => {
  const {
    legal_full_name,
    dob,
    nationality,
    business_role,
    percentage_ownership,
  } = businessPayload.value;

  return {
    legal_first_name: legal_full_name.split(" ")[0],
    legal_last_name: legal_full_name.split(" ")[1],
    dob,
    nationality,
    business_role: toRaw(business_role),
    percentage_ownership: percentage_ownership.toString(),
  };
});

const handleRepresentativeProfileUpdate = async () => {
  await complianceUtil.handleComplianceRequest({
    payload: getBusinessPayload,
    redirectRoute: "ComplianceRepresentativeIdentity",
    stopClickHandler,
    succesMsg: "Representative profile submitted",
    errorMsg: "Representative update failed",
    payloadType: "representatives",
  });
};

watch(
  getComplianceRepresentative,
  (newValue) => {
    if (newValue && newValue.length > 0) {
      const fullName = newValue[0]?.legal_first_name.length
        ? `${newValue[0]?.legal_first_name} ${newValue[0]?.legal_last_name}`
        : "";

      businessPayload.value = {
        legal_full_name: fullName,
        dob: newValue[0]?.dob || "",
        nationality: newValue[0]?.nationality || "",
        business_role: formatBusinessRoles(newValue[0]?.business_role) || [],
        percentage_ownership: newValue[0]?.percentage_ownership || "",
      };
    }
  },
  { immediate: true }
);

const loadCountryList = () => {
  countryList.value = countryCurrencies.map(({ country }) => {
    const countryData = {
      value: country.toLowerCase(),
      name: country,
    };

    return countryData;
  });
};

loadCountryList();
</script>

<style lang="scss" scoped></style>
