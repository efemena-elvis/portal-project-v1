<!-- eslint-disable no-undef, vue/valid-define-props, vue/valid-define-emits -->
<template>
  <ModalDialog
    place_center
    :modal_style="{
      shape: 'rounded-2xl',
      size: 'modal-md',
      background: 'bg-white',
    }"
    @closeModal="$emit('closeTriggered')"
  >
    <template #modal-cover-header>
      <div class="fee-modal-header">
        <h2>Update fee config</h2>
      </div>
    </template>

    <template #modal-cover-body>
      <div class="modal-cover-body fee-modal-body">
        <p class="merchant-field-readonly">
          <span class="readonly-label">Merchant</span>
          <span class="readonly-value">{{ merchantDisplayName || "-" }}</span>
        </p>
        <SelectFieldInput
          labelId="method"
          labelTitle="Payment Type"
          :labelCompact="false"
          inputPlaceholder="Select type"
          :selectData="methodOptions"
          :inputValue="feePayload.method"
          isRequired
          @onSelectionChange="feePayload.method = $event"
        />

        <SelectFieldInput
          labelId="paymentMethod"
          labelTitle="Payment Method"
          :labelCompact="false"
          inputPlaceholder="Select method"
          :selectData="paymentMethodOptions"
          :inputValue="feePayload.payment_method"
          isRequired
          @onSelectionChange="feePayload.payment_method = $event"
        />

        <div class="field-grid">
          <SelectFieldInput
            labelId="country_code"
            labelTitle="Country"
            :labelCompact="false"
            inputPlaceholder="Select country"
            :selectData="countryOptions"
            :inputValue="feePayload.country_code"
            isRequired
            @onSelectionChange="feePayload.country_code = $event"
          />

          <SelectFieldInput
            labelId="type"
            labelTitle="Fee Type"
            :labelCompact="false"
            inputPlaceholder="Select type"
            :selectData="typeOptions"
            :inputValue="feePayload.type"
            isRequired
            @onSelectionChange="feePayload.type = $event"
          />
        </div>

        <div class="field-grid">
          <TextFieldInput
            labelId="amount"
            labelTitle="Amount"
            :labelCompact="false"
            :inputType="IInputType.Number"
            inputPlaceholder="Enter amount"
            :inputValue="feePayload.amount"
            isRequired
            @inputChanged="feePayload.amount = $event"
            :errorHandler="{
              validator: 'validateNumberEntry',
              message: 'Please enter a valid amount',
            }"
          />

          <TextFieldInput
            labelId="capAmount"
            labelTitle="Cap Amount"
            :labelCompact="false"
            :inputType="IInputType.Number"
            inputPlaceholder="Enter cap amount"
            :inputValue="feePayload.cap_amount"
            isRequired
            @inputChanged="feePayload.cap_amount = $event"
            :errorHandler="{
              validator: 'validateNumberEntry',
              message: 'Please enter a valid cap amount',
            }"
          />
        </div>
      </div>
    </template>

    <template #modal-cover-footer>
      <div class="modal-cover-footer fee-modal-footer">
        <button
          class="btn btn-sm btn-secondary"
          type="button"
          @click="$emit('closeTriggered')"
        >
          Cancel
        </button>
        <button
          ref="editFeeBtnRef"
          class="btn btn-sm btn-primary"
          type="button"
          :disabled="isActionReady"
          @click="handleUpdateFee"
        >
          Update config
        </button>
      </div>
    </template>
  </ModalDialog>
</template>

<script lang="ts" setup>
import { computed, ref, watch, onMounted } from "vue";
import { IInputType } from "@packages/models";
import { useEvents } from "@packages/hooks";
import { useFeeStore } from "@/modules/fees/store";
import {
  getCountryByCurrencyShort,
  countryCurrencies,
} from "@packages/constants";
import { ModalDialog, SelectFieldInput, TextFieldInput } from "@packages/uikit";

type IFeePayload = {
  method: string;
  country_code: string;
  type: string;
  amount: string;
  payment_method: string;
  cap_amount: string;
};

const props = defineProps<{
  feeId: string;
}>();

const emits = defineEmits<{
  closeTriggered: [];
  feeUpdated: [];
}>();

const { processAPIRequest, pushToastAlert } = useEvents();
const { getSingleFee, updateFee } = useFeeStore();

const editFeeBtnRef = ref(null);
const merchantDisplayName = ref("");

// local fee data (populated from API)
const feeData = ref<Record<string, any> | null>(null);

const methodOptions = [
  { value: "payin", name: "Payin" },
  { value: "payout", name: "Payout" },
];

const paymentMethodOptions = computed(() => {
  if (feePayload.value.method === "payout") {
    return [
      { value: "mobilemoney", name: "Mobile Money" },
      { value: "bank", name: "Bank" },
    ];
  }
  return [
    { value: "mobilemoney", name: "Mobile Money" },
    { value: "card", name: "Card" },
  ];
});

const countryOptions = [
  { name: "Nigeria", value: "NG" },
  { name: "Ghana", value: "GH" },
  { name: "Zambia", value: "ZM" },
  { name: "Tanzania", value: "TZ" },
];

const typeOptions = [
  { value: "percentage", name: "Percentage" },
  { value: "fixed", name: "Fixed" },
];

const feePayload = ref<IFeePayload>({
  method: "payin",
  payment_method: "",
  country_code: "",
  type: "percentage",
  amount: "",
  cap_amount: "",
});

const isActionReady = computed(() => {
  return !(
    feePayload.value.method &&
    feePayload.value.country_code &&
    feePayload.value.type &&
    feePayload.value.amount !== "" &&
    feePayload.value.cap_amount !== "" &&
    feePayload.value.payment_method !== ""
  );
});

const normalizeIncomingFee = (data: Record<string, any>) => {
  let countryCode = "NG";
  if (data?.currency) {
    const match = getCountryByCurrencyShort(data.currency);
    if (match) countryCode = match.code.toUpperCase();
  } else if (data?.country) {
    countryCode = data.country.toString().toUpperCase();
  }

  return {
    method: (data?.method ?? "payin").toString().toLowerCase(),
    country_code: countryCode,
    type: (data?.type ?? "percentage").toString().toLowerCase(),
    amount: data?.amount ?? "",
    cap_amount: data?.cap_amount ?? data?.cap_mount ?? "",
    payment_method: data?.payment_method ?? "",
  };
};

const initialiseFromFeeData = () => {
  if (!feeData.value) return;

  merchantDisplayName.value =
    (feeData.value.user && feeData.value.user.business_name) || "";

  feePayload.value = normalizeIncomingFee(feeData.value);
};

const fetchFeeDetail = async () => {
  if (!props.feeId) return;

  const response = await processAPIRequest({
    action: getSingleFee,
    payload: { merchant_config_uuid: props.feeId },

    showAlert: false,
  });

  if (response?.code === 200 && response.data) {
    feeData.value = response.data;
    initialiseFromFeeData();
  }
};

const handleUpdateFee = async () => {
  const payload = {
    ...feePayload.value,
    amount: parseFloat(feePayload.value.amount as string) || 0,
    cap_amount: parseFloat(feePayload.value.cap_amount as string) || 0,
  };

  const response = await processAPIRequest({
    action: async () => updateFee(props.feeId, payload),
    payload,
    btnRef: editFeeBtnRef,
    btnText: "Update config",
    showAlert: false,
  });

  if (response?.code >= 200 && response?.code < 300) {
    pushToastAlert({
      message: "Fee configuration updated successfully",
      type: "success",
    });
    emits("feeUpdated");
    emits("closeTriggered");
  } else {
    pushToastAlert({
      message: "Unable to update fee configuration",
      description: response?.message || "Please try again",
      type: "error",
    });
  }
};

watch(
  () => feePayload.value.method,
  (newMethod) => {
    const validMethods =
      newMethod === "payout"
        ? ["mobilemoney", "bank"]
        : ["mobilemoney", "card"];
    if (!validMethods.includes(feePayload.value.payment_method)) {
      feePayload.value.payment_method = "";
    }
  },
);

onMounted(() => {
  fetchFeeDetail();
});
</script>

<style scoped lang="scss">
.fee-modal-header {
  @apply px-10 pt-9 sm:px-5 sm:pt-6;

  h2 {
    @apply text-[24px] font-bold leading-tight text-grey-900 sm:text-xl;
  }

  p {
    @apply mt-4 text-[15px] font-medium text-grey-600 sm:text-lg;
  }
}

.fee-modal-body {
  @apply flex flex-col gap-3 px-10 pt-10 sm:gap-5 sm:px-5 sm:pt-7;
}

.merchant-field-readonly {
  @apply flex flex-col;

  .readonly-label {
    @apply text-[15px] font-semibold text-grey-700 mb-2;
  }

  .readonly-value {
    @apply text-base text-grey-900 font-semibold bg-green-50 p-3 rounded-lg border border-green-200;
  }
}

.field-grid {
  @apply grid grid-cols-2 gap-8 sm:grid-cols-1 sm:gap-5;
}

.fee-modal-footer {
  @apply flex justify-end gap-8 px-10 pb-10 pt-8 sm:flex-col sm:px-5 sm:pb-6;
}
</style>
