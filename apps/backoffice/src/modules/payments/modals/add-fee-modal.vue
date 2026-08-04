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
        <h2>Configure fee</h2>

      </div>
    </template>

    <template #modal-cover-body>
      <div class="modal-cover-body fee-modal-body">
        <p class="merchant-field-readonly">
          <span class="readonly-label">Merchant</span>
          <span class="readonly-value">{{ selectedMerchantName }}</span>
        </p>


        <SelectFieldInput
          labelId="method"
          labelTitle="Method"
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
            labelId="feeType"
            labelTitle="Fee Type"
            :labelCompact="false"
            inputPlaceholder="Select type"
            :selectData="typeOptions"
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
          ref="addFeeBtnRef"
          class="btn btn-sm btn-primary"
          type="button"
          :disabled="isActionReady"
          @click="handleAddFee"
        >
          Save config
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
import { ModalDialog, SelectFieldInput } from "@packages/uikit";

type IFeePayload = {
  merchant: string;
  user_id: string;
  method: string;
  country_code: string;
  type: string;
  amount: number | string;
  cap_amount?: number | string;
  payment_method: string;
};

const props = withDefaults(
  defineProps<{
    merchantId?: string;
    merchantName?: string;
  }>(),
  {
    merchantId: "",
    merchantName: "",
  },
);

const emits = defineEmits<{
  closeTriggered: [];
  feeAdded: [];
}>();

const { processAPIRequest, pushToastAlert } = useEvents();
const { createFee } = useFeeStore();
const { countryOptions, fetchCountries } = useCountries();

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

const addFeeBtnRef = ref(null);

const feePayload = ref<IFeePayload>({
  merchant: "",
  user_id: "",
  method: "payin",
  country_code: "NG",
  payment_method: "",
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

const selectedMerchantName = computed(() => {
  return props.merchantName;
});

onMounted(() => {
  fetchCountries();
  if (props.merchantId) {
    feePayload.value.merchant = props.merchantId;
  }
});

const validPaymentMethods: Record<string, string[]> = {
  payin: ["mobilemoney", "card"],
  payout: ["mobilemoney"],
};

watch(
  () => feePayload.value.method,
  (newMethod) => {
    const valid = validPaymentMethods[newMethod] || [];
    if (!valid.includes(feePayload.value.payment_method)) {
      feePayload.value.payment_method = "";
    }
  },
);

const isActionReady = computed(() => {
  return !(
    feePayload.value.merchant &&
    feePayload.value.method &&
    feePayload.value.country_code &&
    feePayload.value.type &&
    feePayload.value.amount !== "" &&
    feePayload.value.payment_method !== ""
  );
});

const handleAddFee = async () => {
  feePayload.value.user_id = feePayload.value.merchant;

  const { merchant: _, ...payload } = feePayload.value;
  const apiPayload = {
    ...payload,
    amount: parseFloat(payload.amount as string) || 0,
    cap_amount: payload.cap_amount && parseFloat(payload.cap_amount as string),
  };

  const response = await processAPIRequest({
    action: async () => createFee(apiPayload),
    payload: apiPayload,
    btnRef: addFeeBtnRef,
    btnText: "Save config",
    showAlert: false,
  });

  if (response?.code >= 200 && response?.code < 300) {
    pushToastAlert({
      message: "Fee configured successfully",
      type: "success",
    });
    emits("feeAdded");
    emits("closeTriggered");
  } else {
    pushToastAlert({
      message: "Unable to configure fee",
      description: response?.error?.message || "Please try again",
      type: "error",
    });
  }
};
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
  @apply flex flex-col mb-4;

  .readonly-label {
    @apply text-sm font-semibold text-grey-900 mb-2;
  }

  .readonly-value {
    @apply text-base text-grey-900 font-semibold bg-green-50 p-3  rounded-lg border border-green-200;
  }
}

.field-grid {
  @apply grid grid-cols-2 gap-8 sm:grid-cols-1 sm:gap-5;
}

.fee-modal-footer {
  @apply flex justify-end gap-8 px-10 pb-10 pt-8 sm:flex-col sm:px-5 sm:pb-6;
}
</style>
