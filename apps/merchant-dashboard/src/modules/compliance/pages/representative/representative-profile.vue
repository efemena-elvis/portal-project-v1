<template>
  <ComplianceWrapper
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'RedstoneRegistrationConfirm' })"
    @onContinueClick="handleRepresentativeProfileUpdate"
  >
    <div v-if="businessPayload.length > 0 || addNewRepresentative" class="mb-6">
      <div
        v-for="(rep, index) in businessPayload"
        :key="index"
        class="border border-green-400  rounded-lg bg-white p-6 mb-8 items-center shadow-sm relative flex justify-between"
      >
        <div>
          <p class="font-semibold text-[18px]">
            {{ rep.legal_full_name }}
          </p>
          <span class="capitalize text-gray-400 text-[14px]">
            {{ rep.business_role.join(", ") }}
          </span>
          <div
            class="text-red-600 absolute -top-4 -right-2 border text-[16px] bg-red-50 rounded-full cursor-pointer min-w-8 min-h-8 flex justify-center items-center  icon icon-times"
            @click="removeRepresentative(index)"
          >
          
          </div>
        </div>

        <button
          type="button"
          class="btn btn-primary-outline btn-sm p-4 w-[70px] !h-[33px]"
          @click="editRepresentative(index)"
        >
          Edit
        </button>
      </div>
    </div>

    <MultiSelectFieldInput
  v-if="addNewRepresentative || isEditing"
      labelId="businessRole"
      labelTitle="Business Role"
      :labelCompact="false"
      inputPlaceholder="Select your representative business role"
      :inputValueList="currentRep.business_role"
      :selectData="[
        { value: 'director', name: 'Director' },
        { value: 'shareholder', name: 'Shareholder' },
      ]"
      isRequired
      @onSelectionChange="handleBusinessRoleChange"
    />

    <TextFieldInput 
     v-if="addNewRepresentative || isEditing" 
      labelId="legalFullName"
      labelTitle="Legal Full Name"
      :labelCompact="false"
      :inputType="IInputType.Text"
      :inputValue="currentRep.legal_full_name"
      inputPlaceholder="Provide legal full name"
      :isRequired="true"
      @inputChanged="(val) => (currentRep.legal_full_name = val)"
      :errorHandler="{
        validator: 'validateRequired',
        message: 'Legal fullname is a required field',
      }"
    />

    <TextFieldInput 
     v-if="addNewRepresentative || isEditing"
      labelId="dateOfBirth"
      labelTitle="Date of Birth"
      :labelCompact="false"
      :inputType="IInputType.Date"
      :inputValue="currentRep.dob"
      inputPlaceholder="Provide representative date of birth"
      :isRequired="true"
      @inputChanged="(val) => (currentRep.dob = val)"
      @inputValidated="(val) => (payloadValidity.dob = val)"
      :errorHandler="{
        validator: 'validateDateRange',
        range: 18,
        message: 'Date of birth should be over 18 years',
      }"
    />

    <SelectFieldInput
      v-if="addNewRepresentative || isEditing"
      labelId="nationality"
      labelTitle="Nationality"
      :labelCompact="false"
      inputPlaceholder="Select your representative nationality"
      :inputValue="currentRep.nationality"
      :selectData="countryList"
      isRequired
      @onSelectionChange="(val) => (currentRep.nationality = val)"
    />

    <button 
      type="button"
      @click="handleAddNewRepresentative"
      class="btn btn-primary-outline mt-12 "
    >
      {{ isEditing ? "Update Representative" : "+ Add Representative" }}
    </button>
  </ComplianceWrapper>
</template>

<script setup lang="ts">
import { ref, computed, toRaw, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { IInputType } from "@packages/models";
import {
  TextFieldInput,
  SelectFieldInput,
  MultiSelectFieldInput,
} from "@packages/uikit";
import { useComplianceUtil, useStorage } from "@packages/hooks";
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
const complianceStore = useComplianceStore();
const complianceUtil = new useComplianceUtil(complianceStore);
const { getComplianceRepresentative } = storeToRefs(complianceStore);
const { setStorage } = useStorage();

const countryList = ref<{ value: string; name: string }[]>([]);
const stopClickHandler = ref<boolean>(false);
const payloadValidity = ref<IInputValidity>({ dob: false });
const addNewRepresentative = ref<boolean>(false);

const deepClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

const businessPayload = ref<IBusinessType[]>([]);

const formatBusinessRoles = (
  businessRoleData: string | string[] | undefined
): string[] => {
  try {
    if (!businessRoleData) return [];
    if (Array.isArray(businessRoleData)) {
      const firstElement = businessRoleData[0];
      if (
        typeof firstElement === "string" &&
        firstElement.startsWith("[") &&
        firstElement.endsWith("]")
      ) {
        const parsedInnerArray = JSON.parse(firstElement);
        return Array.isArray(parsedInnerArray) ? parsedInnerArray : [];
      }
      return businessRoleData;
    }
    const parsedString = JSON.parse(businessRoleData);
    return Array.isArray(parsedString) ? parsedString : [];
  } catch (error) {
    console.error("Error parsing business roles:", error);
    return [];
  }
};

const createBlankRep = (): IBusinessType => ({
  legal_full_name: "",
  dob: "",
  nationality: "",
  business_role: [],
  percentage_ownership: "",
});

const currentRep = ref<IBusinessType>({
  legal_full_name: "",
  dob: "",
  nationality: "",
  business_role: [],
  percentage_ownership: "",
});

const isEditing = ref(false);
const editIndex = ref<number | null>(null);



const handleBusinessRoleChange = (val: string[] | any) => {
  currentRep.value.business_role = Array.isArray(val) ? [...val] : [];
};


const removeRepresentative = (index: number) => {
  businessPayload.value.splice(index, 1);

  if (isEditing.value && editIndex.value === index) {
    isEditing.value = false;
    editIndex.value = null;
    Object.assign(currentRep.value, createBlankRep());
    payloadValidity.value.dob = false;
  }
 
};

const editRepresentative = (index: number) => {
  Object.assign(currentRep.value, deepClone(businessPayload.value[index]));
  isEditing.value = true;
  editIndex.value = index;
};


const getBusinessPayload = computed(() =>
  businessPayload.value.map((rep) => ({
    legal_first_name: (rep.legal_full_name || "").split(" ")[0] || "",
    legal_last_name: (rep.legal_full_name || "").split(" ")[1] || "",
    dob: rep.dob,
    nationality: rep.nationality,
    business_role: toRaw(rep.business_role),
    percentage_ownership: rep.percentage_ownership.toString(),
  }))
);

const handleRepresentativeProfileUpdate = async () => {
  await complianceUtil.handleComplianceRequest({
    payload: { representatives: getBusinessPayload.value },
    redirectRoute: "ComplianceRepresentativeIdentity",
    stopClickHandler,
    succesMsg: "Representative profile submitted",
    errorMsg: "Representative update failed",
    payloadType: "representatives",
  });
};

const loadCountryList = () => {
  countryList.value = countryCurrencies.map(({ country }) => ({
    value: country.toLowerCase(),
    name: country,
  }));
};
loadCountryList();


const handleAddNewRepresentative = () => {
  addNewRepresentative.value = true;

  const rep = {
    legal_full_name: currentRep.value.legal_full_name.trim(),
    dob: currentRep.value.dob.trim(),
    nationality: currentRep.value.nationality.trim(),
    business_role: [...currentRep.value.business_role],
    percentage_ownership: currentRep.value.percentage_ownership.trim(),
  };

  if (
    !rep.legal_full_name ||
    !rep.dob ||
    !rep.nationality ||
    rep.business_role.length === 0
  ) {
    return;
  }

  if (isEditing.value && editIndex.value !== null) {
    businessPayload.value.splice(editIndex.value, 1, rep);
    isEditing.value = false;
    editIndex.value = null;
  } else {
    businessPayload.value.push(rep);
  }

  Object.assign(currentRep.value, createBlankRep());
  payloadValidity.value.dob = false;
  addNewRepresentative.value = false;
};

const isActionReady = computed(() => {
  return businessPayload.value.length === 0;
});

watch(
  getComplianceRepresentative,
  (newValue) => {
    if (newValue && newValue.length > 0) {
      
      if (businessPayload.value.length === 0) {
        businessPayload.value = newValue
            .map((item: any) => ({
              legal_full_name:
                (item?.legal_first_name || "") +
                (item?.legal_last_name ? ` ${item?.legal_last_name}` : ""),
              dob: item?.dob || "",
              nationality: item?.nationality || "",
              business_role: formatBusinessRoles(item?.business_role) || [],
              percentage_ownership: item?.percentage_ownership || "",
            })).filter((rep: IBusinessType) => rep.legal_full_name);

       
      }
    }
  },
  { deep: true }
);




</script>
