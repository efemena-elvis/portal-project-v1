<template>
  <ComplianceWrapper
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'ComplianceRepresentativeProfile' })"
    @onContinueClick="handleRepresentativeIdentityUpdate"
  >
    <UploadGuidelines
      title="Please upload a document that:"
      :guidelines="[
        'Is government issued',
        'Is full-sized, original and unedited',
      ]"
    />

    <div
      v-for="(rep, index) in representativeProfile"
      :key="index"
      class="border rounded-md bg-white pb-1 pt-4 px-4 mb-4 cursor-pointer"
    >
      <div class="flex justify-between items-center relative">
        <span class="text-[14px] font-[500] text-gray-700"
          >{{ rep.legal_first_name }} {{ rep.legal_last_name }}</span
        >
        <div
          class="icon icon-caret-down transition-transform duration-200"
          @click="toggleRep(index)"
          :class="{ 'rotate-180': activeRep === index }"
        ></div>
      </div>

      <transition name="fade-slide">
        <div v-if="activeRep === index" class="mt-6">
          <SelectFieldInput
            labelId="selectDocumentID"
            labelTitle="Select Identification Document"
            inputPlaceholder="Select identification document"
            inputBaseColor="bg-grey-10"
            :inputValue="repPayloads[index]?.type"
            :selectData="documentList"
            isRequired
            @onSelectionChange="(val) => handleSelectChange(index, val)"
          />

          <div class="mb-4">
            <FileUploadInput
              showSkip
              skipRoute="ComplianceBankAccount"
              :hasDocumentUploaded="!!repPayloads[index]?.url"
              :uploadedDocumentContent="getUploadedDocumentContent(index)"
              :uploadAction="uploadFile"
              @onDocumentUploaded="
                ($event) => {
                  repPayloads[index].url = $event;
                }
              "
            />
          </div>
        </div>
      </transition>
    </div>
  </ComplianceWrapper>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import {
  UploadGuidelines,
  FileUploadInput,
  SelectFieldInput,
} from "@packages/uikit";
import { useComplianceUtil, useAppVariant } from "@packages/hooks";
import { ComplianceWrapper } from "@/modules/compliance/components";
import { useGlobalStore } from "@/modules/global/store";
import { useComplianceStore } from "@/modules/compliance/store";

type IBusinessType = {
  type: string;
  value: string;
  url: string;
  percentage_ownership?: number | string;
  business_role?: string[];
  legal_full_name?: string;
  dob?: string;
  nationality?: string;
};

const router = useRouter();
const appVariant = ref<string>(useAppVariant());

const stopClickHandler = ref<boolean>(false);

const { uploadFile } = useGlobalStore();

const complianceStore = useComplianceStore();
const { getComplianceRepresentative } = storeToRefs(complianceStore);

const complianceUtil = new useComplianceUtil(complianceStore);

const representativeProfile = ref<any[]>([]);
const activeRep = ref<number | null>(null);

const repPayloads = ref<Record<number, IBusinessType>>({});

const documentList = ref<{ value: string; name: string }[]>([
  { value: "drivers_license", name: "Driver's License" },
  {
    value: appVariant.value === "alexpay" ? "ghana_card" : "national_id_card",
    name:
      appVariant.value === "alexpay"
        ? "Ghana Card"
        : "National Identification Number",
  },
  { value: "voters_card", name: "Voter's Card" },
  { value: "passport", name: "International Passport" },
]);

const handleSelectChange = (index: number, value: string): void => {
  const selected = documentList.value.find((doc) => doc.value === value);
  if (!repPayloads.value[index]) {
    repPayloads.value[index] = { type: "", value: "", url: "" };
  }
  repPayloads.value[index].type = selected ? selected.value : "";
  repPayloads.value[index].value = selected ? selected.name : "";
};

const getUploadedDocumentContent = (index: number) => {
  const payload = repPayloads.value[index];
  return payload?.type
    ? {
        name: payload.type.split("_").join(" "),
        link: payload.url,
      }
    : {};
};

const isActionReady = computed(() => {
  return representativeProfile.value.some((_, index) => {
    const payload = repPayloads.value[index];
    return !payload || !payload.type || !payload.url;
  });
});

const getBusinessPayload = computed(() => {
  return representativeProfile.value.map((rep: any, index: number) => {
    const repDoc: IBusinessType = repPayloads.value[index] || {
      type: "",
      value: "",
      url: "",
    };

    return {
      ...rep,
      doc: {
        type: repDoc.type, 
        value: repDoc.value,
        url: repDoc.url,
      },
    };
  });
});

const handleRepresentativeIdentityUpdate = async () => {
  await complianceUtil.handleComplianceRequest({
    payload: { representatives: getBusinessPayload.value },
    redirectRoute: "ComplianceBankAccount",
    stopClickHandler,
    succesMsg: "Representative identity submitted",
    errorMsg: "Representative update failed",
    payloadType: "representatives",
  });
};

const toggleRep = (index: number) => {
  activeRep.value = activeRep.value === index ? null : index;
};

watch(
  getComplianceRepresentative,
  (newValue) => {
    if (newValue && newValue.length > 0) {
      representativeProfile.value = newValue;
      newValue.forEach((rep: any, i: number) => {
        repPayloads.value[i] = {
          type: rep?.doc?.type || "",
          value: rep?.doc?.value || "",
          url: rep?.doc?.url || "",
        };
      });
    }

  },
  { immediate: true }
);


</script>

<style lang="scss" scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
.rotate-180 {
  transform: rotate(180deg);
}
</style>
