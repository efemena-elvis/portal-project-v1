<template>
  <div class="p-6">
    <TableComponent
      title="Business Address"
      :headers="tableHeaders"
      :data="tableData"
      @update-row="handleUpdateRow"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, onMounted, watch, defineExpose } from "vue";
import TableComponent from "../../table-component.vue";
import { ITableHeaderType } from "@packages/models";
import { useGlobalStore } from "@/modules/global/store";
import { useEvents } from "@packages/hooks";

interface TableRow {
  id: number;
  business_name: string;
  country: string;
  address: string;
  billing_descriptor_1: string;
  billing_descriptor_2: string;
}

const props = defineProps<{
  merchantPayload: Partial<TableRow>[];
}>();

const emit = defineEmits<{
  (e: "update:merchantPayload", payload: TableRow[]): void;
  (e: "stepComplete"): void;
  (e: "showError", message: string): void;
}>();

const { processAPIRequest } = useEvents();
const { getBusinessCountries } = useGlobalStore();

const tableData = ref<TableRow[]>([]);
const countryList = ref<{ value: string; label: string }[]>([]);
const countryNameToIdMap = ref<Record<string, string>>({});
const countryIdToNameMap = ref<Record<string, string>>({});

const tableHeaders = ref<ITableHeaderType[]>([
  {
    key: "business_name",
    label: "Business name",
    type: "text",
    readonly: true,
  },
  {
    key: "country",
    label: "Country",
    type: "select",
    options: [],
  },
  { key: "address", label: "Address", type: "text" },
  { key: "billing_descriptor_1", label: "Billing Descriptor 1", type: "text" },
  { key: "billing_descriptor_2", label: "Billing Descriptor 2", type: "text" },
]);

const loadCountryList = async () => {
  const response = await processAPIRequest({
    action: getBusinessCountries,
    payload: {},
  });

  if (response.code === 200) {
    countryList.value = response.data.map(
      (item: { id: string; name: string }) => {
        const nameLower = item.name.trim().toLowerCase();
        countryNameToIdMap.value[nameLower] = item.id;
        countryIdToNameMap.value[item.id] = item.name;
        return {
          value: item.id,
          label: item.name,
        };
      }
    );

    const countryHeader = tableHeaders.value.find(
      (header) => header.key === "country"
    );
    if (countryHeader) {
      countryHeader.options = countryList.value;
    }
  }
};

watchEffect(() => {
  tableData.value = props.merchantPayload.map((merchant, index) => ({
    id: merchant.id ?? index + 1,
    business_name: merchant.business_name ?? "",
    country: merchant.country ?? "",
    address: merchant.address ?? "",
    billing_descriptor_1: merchant.billing_descriptor_1 ?? "",
    billing_descriptor_2: merchant.billing_descriptor_2 ?? "",
  }));
});

let stepCompleted = false;

function validate(): boolean {
  for (const row of tableData.value) {
    if (
      !row.business_name ||
      !row.country ||
      !row.address ||
      !row.billing_descriptor_1 ||
      !row.billing_descriptor_2
    ) {
      return false;
    }
  }
  return true;
}

function handleUpdateRow(
  rowId: string | number,
  field: string,
  value: string | number | File
) {
  const id = typeof rowId === "string" ? Number(rowId) : rowId;
  let updatedRow: TableRow | undefined;

  tableData.value = tableData.value.map((row) => {
    if (row.id === id) {
      const updated = { ...row, [field]: value };
      updatedRow = updated;
      return updated;
    }
    return row;
  });

  emit("update:merchantPayload", [...tableData.value]);
}

watch(
  tableData,
  () => {
    if (validate()) {
      stepCompleted = true;
      emit("stepComplete");
    } else {
      emit("showError", "Please complete all required address fields.");
    }
  },
  { deep: true }
);

onMounted(() => {
  loadCountryList();
});

defineExpose({ validate });
</script>
