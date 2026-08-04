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
          <div class="form-block form-text-block mb-5">
            <label for="amount" class="bg-neutral-10 form-label-basic">
              Amount
            </label>
            <div class="form-block-input">
              <input
                id="amount"
                class="form-control"
                type="text"
                inputmode="decimal"
                pattern="[0-9]*([.][0-9]{0,2})?"
                placeholder="Enter amount"
                :value="feePayload.amount"
                required
                @input="updateDecimalValue('amount', $event)"
              />
            </div>
          </div>

          <div class="form-block form-text-block mb-5">
            <label for="capAmount" class="bg-neutral-10 form-label-basic">
              Cap Amount
            </label>
            <div class="form-block-input">
              <input
                id="capAmount"
                class="form-control"
                type="text"
                inputmode="decimal"
                pattern="[0-9]*([.][0-9]{0,2})?"
                placeholder="Enter cap amount"
                :value="feePayload.cap_amount"
                required
                @input="updateDecimalValue('cap_amount', $event)"
              />
            </div>
          </div>
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
import { useEvents } from "@packages/hooks";
import { useFeeStore } from "@/modules/fees/store";
import { useCountries } from "@/modules/global/composables/useCountries";
import { countryCurrencies } from "@packages/constants";
import { ModalDialog, SelectFieldInput } from "@packages/uikit";

type IFeePayload = {
  method: string;
  country_code: string;
  type: string;
  amount: string;
  payment_method: string;
  cap_amount?: string;
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
const { countryOptions, fetchCountries } = useCountries();

const editFeeBtnRef = ref(null);
const merchantDisplayName = ref("");


const feeData = ref<Record<string, any> | null>(null);

const methodOptions = [
  { value: "payin", name: "Payin" },
  { value: "payout", name: "Payout" },
];

const paymentMethodOptions = computed(() => {
  if (feePayload.value.method === "payout") {
    return [{ value: "mobilemoney", name: "Mobile Money" }];
  }
  return [
    { value: "mobilemoney", name: "Mobile Money" },
    { value: "card", name: "Card" },
  ];
});

const typeOptions = [
  { value: "percentage", name: "Percentage" },
  { value: "fixed", name: "Fixed" },
];

const feePayload = ref<IFeePayload>({
  method: "payin",
  payment_method: "",
  country_code: "",
  type: "percentage",
  amount: ""
});

const updateDecimalValue = (
  field: "amount" | "cap_amount",
  event: Event,
) => {
  const input = event.target as HTMLInputElement;
  const normalizedValue = input.value
    .replace(/,/g, ".")
    .replace(/[^\d.]/g, "");
  const [wholeNumber, ...decimalParts] = normalizedValue.split(".");
  const decimalPart = decimalParts.join("").slice(0, 2);
  const value = decimalParts.length
    ? `${wholeNumber || "0"}.${decimalPart}`
    : wholeNumber;

  feePayload.value[field] = value;
  input.value = value;
};

const isActionReady = computed(() => {
  return !(
    feePayload.value.method &&
    feePayload.value.country_code &&
    feePayload.value.type &&
    feePayload.value.amount !== "" &&
    feePayload.value.payment_method !== ""
  );
});

const normalizeIncomingFee = (data: Record<string, any>) => {
  const resolveCountryCode = (value: string | undefined) => {
    if (!value) return "";
    const normalized = value.toString().trim().toUpperCase();
    const match = countryCurrencies.find(
      (country) =>
        country.code?.toUpperCase() === normalized ||
        country.country?.toUpperCase() === normalized ||
        country.currency?.short?.toUpperCase() === normalized,
    );
    return match?.code?.toUpperCase() || "";
  };

  const countryCode =
    resolveCountryCode(data?.country_code) ||
    resolveCountryCode(data?.currency) ||
    resolveCountryCode(data?.country) ||
    "NG";

  return {
    method: (data?.method ?? "payin").toString().toLowerCase(),
    country_code: countryCode,
    type: (data?.type ?? "percentage").toString().toLowerCase(),
    amount: data?.amount ?? "",
    cap_amount: data?.cap_amount ?? "",
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
        ? ["mobilemoney"]
        : ["mobilemoney", "card"];
    if (!validMethods.includes(feePayload.value.payment_method)) {
      feePayload.value.payment_method = "";
    }
  },
);

onMounted(() => {
  fetchCountries();
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
