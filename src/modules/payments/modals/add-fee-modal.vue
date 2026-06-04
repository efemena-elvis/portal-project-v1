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
            labelId="country"
            labelTitle="Country"
            :labelCompact="false"
            inputPlaceholder="Select country"
            :selectData="countryOptions"
            isRequired
            @onSelectionChange="feePayload.country = $event"
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
import { computed, ref, onMounted } from "vue"
import { IInputType } from "@packages/models"
import { useEvents } from "@packages/hooks"
import { ModalDialog, SelectFieldInput, TextFieldInput } from "@packages/uikit"

type IFeePayload = {
  merchant: string
  method: string
  country: string
  fee_type: string
  amount: number
  cap_amount: number
  payment_method: string
}

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
  closeTriggered: []
  feeAdded: []
}>()

const { processAPIRequest } = useEvents()

const methodOptions = [{ value: "payin", name: "Payin" }, { value: "payout", name: "Payout" }]
const paymentMethodOptions = [

  { value: "mobilemoney", name: "Mobile Money" },
  { value: "card", name: "Card" },

];
const countryOptions = [
  { value: "nigeria", name: "Nigeria" },
  { value: "tanzania", name: "Tanzania" },
  { value: "ghana", name: "Ghana" },
  { value: "zambia", name: "Zambia" },
]
const typeOptions = [{ value: "percentage", name: "Percentage" }, { value: "fixed", name: "Fixed" }]

const addFeeBtnRef = ref(null)

const feePayload = ref<IFeePayload>({
  merchant: "",
  method: "payin",
  country: "nigeria",
  payment_method: "",
  fee_type: "percentage",
  amount: "",
  capAmount: "",
})

const selectedMerchantName = computed(() => {
  return props.merchantName || "Select merchant"
})

onMounted(() => {
  if (props.merchantId) {
    feePayload.value.merchant = props.merchantId
  }
})

const isActionReady = computed(() => {
  return !(
    feePayload.value.merchant &&
    feePayload.value.method &&
    feePayload.value.country &&
    feePayload.value.type &&
    feePayload.value.amount !== "" &&
    feePayload.value.capAmount !== ""
  )
})

const handleAddFee = async () => {
  const response = await processAPIRequest({
    action: async () => {

      return { code: 200 }
    },
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
  })

  if (response.code === 200) {
    emits("feeAdded")
    emits("closeTriggered")
  }
}
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
