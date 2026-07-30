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
        <div class="merchant-field">
          <label class="block text-sm font-semibold text-grey-900 mb-2">
            Merchant 
          </label>
          <SearchableSelectFilter
            v-model="feePayload.user_id"
            :options="merchantOptions"
            placeholder="merchant"
            widthClass="w-full"
          />
        </div>

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
import { computed, ref, watch, onMounted } from "vue";
import { IInputType } from "@packages/models";
import { useEvents } from "@packages/hooks";
import { useMerchantStore } from "@/modules/merchants/store";
import { useFeeStore } from "@/modules/fees/store";
import { countryCurrencies } from "@packages/constants";
import { ModalDialog, SelectFieldInput, TextFieldInput, SearchableSelectFilter } from "@packages/uikit";

type IFeePayload = {
  user_id: string;
  method: string;
  country_code: string;
  type: string;
  amount: number | string;
  payment_method: string;
  cap_amount?: number | string;
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
  feeSaved: [];
}>();

const { processAPIRequest, pushToastAlert } = useEvents();
const { getMerchants } = useMerchantStore();
const { createFee } = useFeeStore();

const addFeeBtnRef = ref(null);

const merchantOptions = ref<{ value: string; name: string }[]>([]);

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
    { value: "bank", name: "Bank" },
  ];
});
const countryOptions = [
  { value: "NG", name: "Nigeria" },
  { value: "TZ", name: "Tanzania" },
  { value: "GH", name: "Ghana" },
  { value: "ZM", name: "Zambia" },
   { value: "KES", name: "Kenya" },
    { value: "XOF", name: "Ivory Coast" },
];
const typeOptions = [
  { value: "percentage", name: "Percentage" },
  { value: "fixed", name: "Fixed" },
];

const feePayload = ref<IFeePayload>({
  user_id: "",
  method: "payin",
  country_code: "NG",
  type: "percentage",
  amount: "",
  payment_method: "",
  cap_amount: "",
});

const selectedMerchantName = computed(() => {
  if (feePayload.value.user_id) {
    const merchant = merchantOptions.value.find(
      (merchant) => merchant.value === feePayload.value.user_id,
    );
    if (merchant?.name) return merchant.name;
  }
  return props.merchantName || "";
});

const isActionReady = computed(() => {
  return !(
    feePayload.value.user_id &&
    feePayload.value.method &&
    feePayload.value.country_code &&
    feePayload.value.type &&
    feePayload.value.amount !== "" &&
    feePayload.value.payment_method !== "" 
  );
});

const fetchMerchants = async () => {
  try {
    const response = await processAPIRequest({
      action: async () => getMerchants({ filters: "?page=1&page_size=100" }),
      showAlert: false,
    });
    if (response?.code === 200 && response.data) {
      const merchants = response.data.merchants || [];
      merchantOptions.value = merchants.map((m: any) => ({
        value: m.uuid || "",
        name:
          m.business_name || m.email || 
          "-",
      }));
    }
  } catch {
    console.error("Failed to fetch merchants");
  }
};

const handleSaveFee = async () => {
  const payload = {
    ...feePayload.value,
    amount: parseFloat(feePayload.value.amount as string) || 0,
    cap_amount: parseFloat(feePayload.value.cap_amount as string) || 0,
  };

  const response = await processAPIRequest({
    action: async () => createFee(payload),
    payload,
    btnRef: addFeeBtnRef,
    btnText: "Save config",
    showAlert: false,
  });

  if (response?.code >= 200 && response?.code < 300) {
    pushToastAlert({
      message: "Fee configured successfully",
      type: "success",
    });
    emits("feeSaved");
    emits("closeTriggered");
  } else {
    pushToastAlert({
      message: "Unable to configure fee",
      description: response?.error?.message || "Please try again",
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
        : ["mobilemoney", "bank"];
    if (!validMethods.includes(feePayload.value.payment_method)) {
      feePayload.value.payment_method = "";
    }
  },
);

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

.merchant-field {
  @apply mb-4;
}

:deep(.scrollbar-hidden::-webkit-scrollbar) {
  display: none;
}
:deep(.scrollbar-hidden) {
  scrollbar-width: none;
}

.field-grid {
  @apply grid grid-cols-2 gap-8 sm:grid-cols-1 sm:gap-5;
}

.fee-modal-footer {
  @apply flex justify-end gap-8 px-10 pb-10 pt-8 sm:flex-col sm:px-5 sm:pb-6;
}
</style>
