<template>
  <div class="p-6">
    <TableComponent
      title="Director's Details"
      :headers="tableHeaders"
      :data="tableData"
      @update-row="handleUpdateRow"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, watch, defineExpose, onMounted } from "vue";
import TableComponent from "../../table-component.vue";
import { useEvents } from "@packages/hooks";
import { useGlobalStore } from "@/modules/global/store";
import {
  ITableHeaderType,
  IMerchantType,
  IDirectorOrOwnerType,
} from "@packages/models";

const props = defineProps<{
  merchantPayload: IMerchantType[];
  directorKey: "director1" | "director2";
}>();

const emit = defineEmits<{
  (e: "update:merchantPayload", payload: IMerchantType[]): void;
  (e: "stepComplete"): void;
  (e: "showError", message: string): void;
}>();

const { processAPIRequest } = useEvents();
const { getBusinessCountries } = useGlobalStore();

const countryList = ref<{ value: string; label: string }[]>([]);
const countryNameToIdMap = ref<Record<string, string>>({});
const countryIdToNameMap = ref<Record<string, string>>({});
const tableData = ref<any[]>([]);

const tableHeaders = ref<ITableHeaderType[]>([
  {
    key: "business_name",
    label: "Business Name",
    type: "text",
    readonly: true,
  },
  { key: "full_name", label: "Full Name", type: "text" },
  {
    key: "directors_country",
    label: "Country",
    type: "select",
    options: [],
  },
  { key: "directors_address", label: "Address", type: "text" },
  { key: "directors_id", label: "Director's ID", type: "file" },
]);

const loadCountryList = async () => {
  const response = await processAPIRequest({
    action: getBusinessCountries,
    payload: {},
  });

  if (response.code === 200) {
    countryList.value = response.data.map((item: { id: string; name: string }) => {
      const nameLower = item.name.trim().toLowerCase();
      countryNameToIdMap.value[nameLower] = item.id;
      countryIdToNameMap.value[item.id] = item.name;
      return {
        value: item.id,
        label: item.name,
      };
    });

    const countryHeader = tableHeaders.value.find(
      (header) => header.key === "directors_country"
    );
    if (countryHeader) {
      countryHeader.options = countryList.value;
    }
  }
};

watchEffect(() => {
  tableData.value = props.merchantPayload.map((merchant) => {
    const director = merchant[props.directorKey] as IDirectorOrOwnerType;
    return {
      id: `${merchant.id}-${props.directorKey}`,
      merchantId: merchant?.id,
      directorKey: props.directorKey,
      business_name: merchant?.business_name,
      full_name: director?.full_name || "",
      directors_country: director?.directors_country || "",
      directors_address: director?.directors_address || "",
      directors_id: director?.directors_id || "",
    };
  });
});

function handleUpdateRow(
  rowId: string | number,
  field: string,
  value: string | number | File
) {
  const [merchantIdStr, directorKey] = rowId.toString().split("-");
  const merchantId = Number(merchantIdStr);

  const updated = props.merchantPayload.map((merchant) => {
    if (merchant.id === merchantId) {
      return {
        ...merchant,
        [directorKey]: {
          ...merchant[directorKey],
          [field]: value,
        },
      };
    }
    return merchant;
  });

  emit("update:merchantPayload", updated);

}

function validate(): boolean {
  for (const row of tableData.value) {
    const isEmpty = !row.full_name && !row.directors_country && !row.directors_address && !row.directors_id;

    if (props.directorKey === "director2" && isEmpty) {
      continue; 
    }

    if (
      !row.full_name ||
      !row.directors_country ||
      !row.directors_address ||
      !row.directors_id
    ) {
      return false;
    }
  }
  return true;
}

watch(
  tableData,
  () => {
    if (validate()) {
      emit("stepComplete");
    }
    else if (props.directorKey === "director1") {
    emit("showError", "Please complete all required Director 1 fields.");
  }
  },
  { deep: true }
);

onMounted(() => {
  loadCountryList();
});

defineExpose({ validate });
</script>
