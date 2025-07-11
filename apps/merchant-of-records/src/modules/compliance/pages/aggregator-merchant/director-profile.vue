<template>
  <OnboardingWrapper
    :isPrimaryActionDisabled="!isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'MerchantBusinessProfile' })"
    @onContinueClick="handleDirectorDetailsUpdate"
    :showActionRow="true"
  >
    <BulkUploadTable
      :headers="tableHeaders"
      :data="tableData"
      :showAddButton="false"
      :showDeleteButton="false"
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
const route = useRoute();
const { processAPIRequest } = useEvents();
const { getBusinessCountries } = useGlobalStore();
const merchantStore = useMerchantUtils();

interface TableRow {
  id: number;
  business_name: string;
  full_name: string;
  country_id: string;
  address: string;
  directors_id: string;
}

const tableHeaders = ref([
  {
    key: "business_name",
    label: "Business Name",
    type: "text",
    readonly: true,
  },
  { key: "full_name", label: "Full Name", type: "text" },
  { key: "country_id", label: "Country", type: "select", options: [] },
  { key: "address", label: "Address", type: "text" },
  { key: "directors_id", label: "Director's ID", type: "file" },
]);

const tableData = ref<TableRow[]>([]);
const stopClickHandler = ref(false);

const loadCountryList = async () => {
  const response = await processAPIRequest({
    action: getBusinessCountries,
    payload: {},
  });

  if (response.code === 200) {
    const countries = response.data.map(
      (item: { id: string; name: string }) => ({
        value: item.id,
        label: item.name,
      })
    );

    const countryHeader = tableHeaders.value.find(
      (h) => h.key === "country_id"
    );
    if (countryHeader) countryHeader.options = countries;
  }
};

const initializeTableData = () => {
  if (merchantStore.business.length) {
    tableData.value = merchantStore.business.map((merchant, idx) => {
      const existingRep = merchantStore.representative.find(
        (rep) => rep.id === idx + 1 && rep.business_role?.includes("director")
      );

      return {
        id: idx + 1,
        business_name: merchant.business_name || "",
        full_name: existingRep?.full_name || "",
        country_id: existingRep?.country_id || "",
        address: existingRep?.address || "",
        directors_id: existingRep?.directors_id || "",
      };
    });
  } else {
    tableData.value = [
      {
        id: 1,
        business_name: "",
        full_name: "",
        country_id: "",
        address: "",
        directors_id: "",
      },
    ];
  }
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

const isActionReady = computed(() =>
  tableData.value.every(
    (row) =>
      row.business_name &&
      row.full_name &&
      row.country_id &&
      row.address &&
      row.directors_id
  )
);

const handleDirectorDetailsUpdate = async () => {
  const data = [...tableData.value];

  const updatedReps = data.map((row) => ({
    id: row.id,
    full_name: row.full_name,
    country_id: row.country_id,
    address: row.address,
    directors_id: row.directors_id,
    business_role: ["director"],
  }));

  merchantStore.addRepresentatives([
    ...merchantStore.representative,
    ...updatedReps,
  ]);

  router.push({name: route.path.includes('/director-details') ?  "DirectorDetails2" : "UboDetails1"});

  console.log("✅ Final merchant payload:", merchantStore.getFullPayload());
};

onMounted(async () => {
  await loadCountryList();
  initializeTableData();
});
</script>
