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
import { useEvents } from "@packages/hooks";
import { useMerchantStore } from "@/modules/merchants/store";
import { useFeeStore } from "@/modules/fees/store";
import { useCountries } from "@/modules/global/composables/useCountries";
import { ModalDialog, SelectFieldInput, SearchableSelectFilter } from "@packages/uikit";

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
const { getAllMerchants } = useMerchantStore();
const { createFee } = useFeeStore();
const { countryOptions, fetchCountries } = useCountries();

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
    { value: "card", name: "Card" },
  ];
});
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
  payment_method: ""
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

const mapMerchantOptions = (merchants: any[]) =>
  merchants.map((m: any) => ({
    value: m.uuid || "",
    name: m.business_name || m.email || "-",
  }));

const fetchMerchants = async () => {
  try {
    const response = await processAPIRequest({
      action: getAllMerchants,
      showAlert: false,
    });
    if (Array.isArray(response)) {
      merchantOptions.value = mapMerchantOptions(response);
    }
  } catch {
    console.error("Failed to fetch merchants");
  }
};

const handleSaveFee = async () => {
  const payload = {
    ...feePayload.value,
    amount: parseFloat(feePayload.value.amount as string) || 0,
    cap_amount: feePayload.value.cap_amount && parseFloat(feePayload.value.cap_amount as string),
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
        : ["mobilemoney", "card"];
    if (!validMethods.includes(feePayload.value.payment_method)) {
      feePayload.value.payment_method = "";
    }
  },
);

onMounted(() => {
  fetchCountries();
  fetchMerchants();
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
