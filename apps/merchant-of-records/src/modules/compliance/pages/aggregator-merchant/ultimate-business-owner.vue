This too:
<template>
  <OnboardingWrapper
    :isPrimaryActionDisabled="!isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'DirectorDetails1' })"
    @onContinueClick="handleUBODetailsUpdate"
    :showActionRow="true"
  >
    <BulkUploadTable
      :headers="tableHeaders"
      :data="tableData"
      @update-row="handleUpdateRow"
    />
  </OnboardingWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import BulkUploadTable from "@packages/uikit/src/components/table-comps/bulk-upload-table.vue";
import OnboardingWrapper from "./onboarding-wrapper.vue";
import { useEvents } from "@packages/hooks";
import { useGlobalStore } from "@/modules/global/store";
import { useMerchantUtils } from "@packages/hooks/src/useMerchantUtils";

const router = useRouter();
const route = useRoute()
const { processAPIRequest } = useEvents();
const { getBusinessCountries } = useGlobalStore();
const merchantStore = useMerchantUtils();

const stopClickHandler = ref(false);

const countryList = ref<{ value: string; label: string }[]>([]);
const countryNameToIdMap = ref<Record<string, string>>({});
const countryIdToNameMap = ref<Record<string, string>>({});

interface TableHeader {
  key: string;
  label: string;
  type: string;
  readonly?: boolean;
  options?: { value: string; label: string }[];
}

const tableHeaders = ref<TableHeader[]>([
  {
    key: "business_name",
    label: "Business name",
    type: "text",
    readonly: true,
  },
  { key: "full_name", label: "Full Name", type: "text" },
  {
    key: "country_id",
    label: "Country",
    type: "select",
    options: [],
  },
  {
    key: "address",
    label: "Address",
    type: "text",
  },
]);

interface TableRow {
  id: number | string;
  business_name: string;
  full_name: string;
  country_id: string;
  address: string;
}

const tableData = ref<TableRow[]>([]);

const loadCountryList = async () => {
  const response = await processAPIRequest({
    action: getBusinessCountries,
    payload: {},
  });

  if (response.code === 200) {
    countryList.value = response.data.map(
      (item: { id: string; name: string }) => {
        countryNameToIdMap.value[item.name.trim().toLowerCase()] = item.id;
        countryIdToNameMap.value[item.id] = item.name;
        return { value: item.id, label: item.name };
      }
    );

    const countryHeader = tableHeaders.value.find(
      (h) => h.key === "country_id"
    );
    if (countryHeader) {
      countryHeader.options = countryList.value;
    }
  }
};

const initializeTableData = () => {
  if (merchantStore.business.length) {
    tableData.value = merchantStore.business.map((merchant, idx) => {
      const existingRep = merchantStore.representative.find(
        (rep) => rep.id === idx + 1 && rep.business_role?.includes("ubo")
      );

      return {
        id: idx + 1,
        business_name: merchant.business_name || "",
        full_name: existingRep?.full_name || "",
        country_id: existingRep?.country_id || "",
        address: existingRep?.address || "",
      };
    });
  } else {
    tableData.value = [
      {
        id: 1,
        business_name: "",
        country_id: "",
        address: "",
        full_name: "",
      },
    ];
  }
};

const isActionReady = computed(() =>
  tableData.value.every((row) => row.full_name && row.country_id && row.address)
);

const handleUBODetailsUpdate = async () => {
  const data = [...tableData.value];

  const updatedUBOs = data.map((row) => ({
    id: typeof row.id === "string" ? Number(row.id) : row.id,
    full_name: row.full_name,
    country_id: row.country_id,
    address: row.address,
    business_role: ["ubo"]
  }));

  merchantStore.addRepresentatives([
    ...merchantStore.representative,
    ...updatedUBOs,
  ]);
  router.push({name: route.path.includes('/ultimate-business-owner') ?  "UboDetails2" : "BusinessDocuments"})
  console.log("✅ Final merchant payload:", merchantStore.getFullPayload());
};

const handleUpdateRow = (
  rowId: number | string,
  field: string,
  value: string | number | File
) => {
  const id = typeof rowId === "string" ? Number(rowId) : rowId;
  tableData.value = tableData.value.map((row) =>
    row.id === id ? { ...row, [field]: value } : row
  );
};

onMounted(async () => {
  await loadCountryList();
  initializeTableData();
});
</script>
