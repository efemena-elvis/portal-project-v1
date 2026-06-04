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
        <p>
          <span v-if="selectedMerchantName">{{ selectedMerchantName }}</span>
        </p>
      </div>
    </template>

    <template #modal-cover-body>
      <div class="modal-cover-body fee-modal-body">
        <SelectFieldInput
          labelId="merchant"
          labelTitle="Merchant"
          :labelCompact="false"
          inputPlaceholder="Select merchant"
          :selectData="merchantOptions"
          :inputValue="feePayload.merchant"
          isRequired
          @onSelectionChange="feePayload.merchant = $event"
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

        <div class="field-grid">
          <SelectFieldInput
            labelId="country"
            labelTitle="Country"
            :labelCompact="false"
            inputPlaceholder="Select country"
            :selectData="countryOptions"
            :inputValue="feePayload.country"
            isRequired
            @onSelectionChange="feePayload.country = $event"
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
          ref="addFeeBtnRef"
          class="btn btn-sm btn-primary"
          type="button"
          :disabled="isActionReady"
          @click="handleSaveFee"
        >
          Save config
        </button>
      </div>
    </template>
  </ModalDialog>
</template>

<script lang="ts" setup>
/* eslint-disable no-undef, vue/valid-define-emits */
import { computed, ref, onMounted } from "vue";
import { IInputType } from "@packages/models";
import { useEvents } from "@packages/hooks";
import { useMerchantStore } from "@/modules/merchants/store";
import { useFeeStore } from "@/modules/fees/store";
import { ModalDialog, SelectFieldInput, TextFieldInput } from "@packages/uikit";

type IFeePayload = {
  merchant: string;
  method: string;
  country: string;
  fee_type: string;
  amount: number | string;
  payment_method: string;
  cap_amount: number | string;
};

const props = withDefaults(
  defineProps<{
    merchantId?: string
    merchantName?: string
  }>(),
  {
    merchantId: "",
    merchantName: "",
  },
)

const emits = defineEmits<{
  closeTriggered: [];
  feeSaved: [];
}>();

const { processAPIRequest } = useEvents();
const { getMerchants } = useMerchantStore();
const { createFee } = useFeeStore();

const addFeeBtnRef = ref(null);

const merchantOptions = ref<{ value: string; name: string }[]>([]);

const methodOptions = [
  { value: "payin", name: "Payin" },
  { value: "payout", name: "Payout" },
];

const paymentMethodOptions = [

  { value: "mobilemoney", name: "Mobile Money" },
  { value: "card", name: "Card" },

];
const countryOptions = [
  { value: "nigeria", name: "Nigeria" },
  { value: "tanzania", name: "Tanzania" },
  { value: "ghana", name: "Ghana" },
  { value: "zambia", name: "Zambia" },
];
const typeOptions = [
  { value: "percentage", name: "Percentage" },
  { value: "fixed", name: "Fixed" },
];

const feePayload = ref<IFeePayload>({
  merchant: "",
  method: "payin",
  country: "nigeria",
  fee_type: "percentage",
  amount: "",
  payment_method: "",
  cap_amount: "",
});

const selectedMerchantName = computed(() => {
  if (feePayload.value.merchant) {
    const merchant = merchantOptions.value.find(
      (m) => m.value === feePayload.value.merchant,
    )
    if (merchant?.name) return merchant.name
  }
  return props.merchantName || ""
})

const isActionReady = computed(() => {
  return !(
    feePayload.value.merchant &&
    feePayload.value.method &&
    feePayload.value.country &&
    feePayload.value.fee_type &&
    feePayload.value.amount !== "" &&
    feePayload.value.payment_method !== "" &&
    feePayload.value.cap_amount !== ""
  );
});

const fetchMerchants = async () => {
  try {
    const response = await processAPIRequest({
      action: async () => getMerchants({ page: 1 }),
      showAlert: false,
    });
    if (response?.code === 200 && response.data) {
      merchantOptions.value = response.data.map((m: any) => ({
        value: m.id ||  "",
        name: m.name || "",
      }))
    }
  } catch {
    console.error('Failed to fetch merchants');
  }

  if (props.merchantId) {
    feePayload.value.merchant = props.merchantId
  }
};

const handleSaveFee = async () => {
  const response = await processAPIRequest({
    action: async () => createFee(feePayload.value),
    payload: feePayload.value,
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
    emits("feeSaved");
    emits("closeTriggered");
  }
};

onMounted(fetchMerchants);
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

.field-grid {
  @apply grid grid-cols-2 gap-8 sm:grid-cols-1 sm:gap-5;
}

.fee-modal-footer {
  @apply flex justify-end gap-8 px-10 pb-10 pt-8 sm:flex-col sm:px-5 sm:pb-6;
}
</style>
