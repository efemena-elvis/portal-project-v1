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
        <p>Merchant: {{ selectedMerchantName }}</p>
      </div>
    </template>

    <template #modal-cover-body>
      <div class="modal-cover-body fee-modal-body">
        <p class="merchant-field-readonly">
          <span class="readonly-label">Merchant</span>
          <span class="readonly-value">{{ selectedMerchantName }}</span>
        </p>

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

        <SelectFieldInput
          labelId="method"
          labelTitle="Method"
          :labelCompact="false"
          inputPlaceholder="Select type"
          :selectData="methodOptions"
          isRequired
          @onSelectionChange="feePayload.method = $event"
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
            @onSelectionChange="feePayload.fee_type = $event"
          />
        </div>

        <div class="field-grid">
          <TextFieldInput
            labelId="amount"
            labelTitle="Amount"
            :labelCompact="false"
            :inputType="IInputType.Number"
            inputPlaceholder="Enter amount"
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
import { IInputType } from "@packages/models";
import { useEvents } from "@packages/hooks";
import { ModalDialog, SelectFieldInput, TextFieldInput } from "@packages/uikit";

type IFeePayload = {
  merchant: string;
  user_id: string;
  method: string;
  country_code: string;
  fee_type: string;
  amount: number | string;
  cap_amount: number | string;
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

const { processAPIRequest } = useEvents();

const methodOptions = [
  { value: "payin", name: "Payin" },
  { value: "payout", name: "Payout" },
];
const paymentMethodOptions = computed(() => {
  const methods = [{ value: "mobilemoney", name: "Mobile Money" }];
  if (feePayload.value.method === "payin") {
    methods.push({ value: "card", name: "Card" });
  } else {
    methods.push({ value: "bank", name: "Bank" });
  }
  return methods;
});
const countryOptions = [
  { value: "NG", name: "Nigeria" },
  { value: "TZ", name: "Tanzania" },
  { value: "GH", name: "Ghana" },
  { value: "ZM", name: "Zambia" },
];
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
  fee_type: "percentage",
  amount: "",
  cap_amount: "",
});

const selectedMerchantName = computed(() => {
  return props.merchantName || "Select merchant";
});

onMounted(() => {
  if (props.merchantId) {
    feePayload.value.merchant = props.merchantId;
  }
});

const validPaymentMethods: Record<string, string[]> = {
  payin: ["mobilemoney", "card"],
  payout: ["mobilemoney", "bank"],
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
    feePayload.value.fee_type &&
    feePayload.value.amount !== "" &&
    feePayload.value.cap_amount !== "" &&
    feePayload.value.payment_method !== ""
  );
});

const handleAddFee = async () => {
  feePayload.value.user_id = feePayload.value.merchant;

  const { merchant: _, ...payload } = feePayload.value;
  const apiPayload = {
    ...payload,
    amount: parseFloat(payload.amount as string) || 0,
    cap_amount: parseFloat(payload.cap_amount as string) || 0,
  };

  const response = await processAPIRequest({
    action: async () => {
      return { code: 200 };
    },
    payload: apiPayload,
    btnRef: addFeeBtnRef,
    btnText: "Save config",
    alertHandler: {
      200: {
        message: "Fee configured successfully",
        type: "success",
      },
      400: {
        message: "Unable to configure fee",
        type: "error",
      },
    },
  });

  if (response.code === 200) {
    emits("feeAdded");
    emits("closeTriggered");
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
  @apply flex flex-col;

  .readonly-label {
    @apply text-sm font-medium text-grey-700 mb-0.5;
  }

  .readonly-value {
    @apply text-base text-grey-900 font-semibold bg-green-50 px-3 py-2 rounded-lg border border-green-200;
  }
}

.field-grid {
  @apply grid grid-cols-2 gap-8 sm:grid-cols-1 sm:gap-5;
}

.fee-modal-footer {
  @apply flex justify-end gap-8 px-10 pb-10 pt-8 sm:flex-col sm:px-5 sm:pb-6;
}
</style>
