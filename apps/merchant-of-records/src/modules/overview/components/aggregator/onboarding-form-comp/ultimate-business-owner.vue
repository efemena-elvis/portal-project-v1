<template>
  <div class="p-6">
    <TableComponent
      title="Ultimate Business Owner"
      :headers="tableHeaders"
      :data="tableData"
      @update-row="handleUpdateRow"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, onMounted, defineExpose, watch } from "vue";
import TableComponent from "../../table-component.vue";

import {
  IDirectorOrOwnerType,
  IMerchantType,
  ITableHeaderType,
} from "@packages/models";
import { useGlobalStore } from "@/modules/global/store";
import { useEvents } from "@packages/hooks";

const props = defineProps<{
  merchantPayload: IMerchantType[];
  uboKey: "ultimate_business_owner1" | "ultimate_business_owner2";
}>();

const emit = defineEmits<{
  (e: "update:merchantPayload", payload: any[]): void;
  (e: "stepComplete"): void;
  (e: "showError", message: string): void;
}>();

const { processAPIRequest } = useEvents();
const { getBusinessCountries } = useGlobalStore();

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
  { key: "full_name", label: "Full Name", type: "text" },
  {
    key: "ultimate_business_owners_country",
    label: "Country",
    type: "select",
    options: [],
  },
  {
    key: "ultimate_business_owners_address",
    label: "Address",
    type: "text",
  },
]);

const tableData = ref<any[]>([]);

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
      (header) => header.key === "ultimate_business_owners_country"
    );
    if (countryHeader) {
      countryHeader.options = countryList.value;
    }
  }
};

watchEffect(() => {
  tableData.value = props.merchantPayload.map((merchant) => {
    const ubo = merchant[props.uboKey] as IDirectorOrOwnerType;
    return {
      id: `${merchant.id}-${props.uboKey}`,
      merchantId: merchant?.id,
      uboKey: props.uboKey,
      business_name: merchant?.business_name,
      full_name: ubo?.full_name || "",
      ultimate_business_owners_country:
        ubo?.ultimate_business_owners_country || "",
      ultimate_business_owners_address:
        ubo?.ultimate_business_owners_address || "",
    };
  });
});

function validate(): boolean {
  for (const row of tableData.value) {
    const isEmpty =
      !row.full_name &&
      !row.ultimate_business_owners_country &&
      !row.ultimate_business_owners_address;

    if (props.uboKey === "ultimate_business_owner2" && isEmpty) {
      continue;
    }

    if (
      !row.full_name ||
      !row.ultimate_business_owners_country ||
      !row.ultimate_business_owners_address
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
  const rowIdStr = typeof rowId === "number" ? rowId.toString() : rowId;
  const [merchantIdStr, uboKey] = rowIdStr.split("-");
  const merchantId = Number(merchantIdStr);

  const updated = props.merchantPayload.map((merchant) => {
    if (merchant.id === merchantId) {
      return {
        ...merchant,
        [uboKey]: {
          ...merchant[uboKey],
          [field]: value,
        },
      };
    }
    return merchant;
  });

  emit("update:merchantPayload", updated);
}

watch(
  tableData,
  () => {
    if (validate()) {
      emit("stepComplete");
    } else if (props.uboKey === "ultimate_business_owner1") {
      emit("showError", "Please complete all required UBO 1 fields.");
    }
  },
  { deep: true }
);

onMounted(() => {
  loadCountryList();
});

defineExpose({ validate });
</script>
