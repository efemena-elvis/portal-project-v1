<template>
  <ModalDialog
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-xs' }"
    place_center
  >
    <template #modal-cover-body>
      <div class="modal-cover-body mt-6">
        <div class="title-text">Update Payment Link</div>

        <div class="description-text">
          Manage your payment links by updating the current status of the
          selected link.
        </div>

        <div class="w-full">
          <TextFieldInput
            labelId="amount"
            labelTitle="Amount"
            :labelCompact="false"
            :inputType="IInputType.Number"
            inputPlaceholder="Provide an amount for the payment"
            :inputValue="paymentPayload.amount"
            isRequired
            @inputChanged="paymentPayload.amount = $event"
            :errorHandler="{
              validator: 'validateNumberEntry',
              message: 'Amount is required',
            }"
          />

          <TextFieldInput
            labelId="description"
            labelTitle="Description"
            :labelCompact="false"
            :inputType="IInputType.Text"
            inputPlaceholder="Provide a description for the payment"
            :inputValue="paymentPayload.description"
            isRequired
            @inputChanged="paymentPayload.description = $event"
            :errorHandler="{
              validator: 'validateRequired',
              message: 'Description is required',
            }"
          />

          <p>Status</p>
          <SelectFieldInput
            labelId="status"
            labelTitle=""
            inputPlaceholder="Select payment link status"
            :inputValue="paymentPayload.status"
            :selectData="paymentLinkStatusOptions"
            :hasBottomPadding="false"
            isRequired
            @onSelectionChange="paymentPayload.status = $event"
          />

          <p class="mt-4">Reusable</p>
          <SelectFieldInput
            labelId="is_reusable"
            labelTitle=""
            inputPlaceholder="Select if reusable"
            :inputValue="paymentPayload.is_reusable"
            :selectData="[
              { name: 'Yes', value: 'true' },
              { name: 'No', value: 'false' },
            ]"
            :hasBottomPadding="false"
            isRequired
            @onSelectionChange="paymentPayload.is_reusable = $event"
          />
        </div>
      </div>
    </template>

    <template #modal-cover-footer>
      <div class="modal-cover-footer flex justify-between gap-x-4 mt-3 mb-1">
        <button
          class="btn btn-sm btn-primary w-full"
          ref="updateLinkBtnRef"
          @click="handleUpdatePaymentLink"
        >
          Update Payment Link
        </button>
      </div>
    </template>
  </ModalDialog>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useEvents } from "@packages/hooks";
import { ModalDialog, SelectFieldInput, TextFieldInput } from "@packages/uikit";
import { usePaymentStore } from "../store";
import { IInputType } from "@packages/models";

type IPaymentLinkType = {
  amount?: string;
  description?: string;
  is_reusable?: string;
  status?: string;
};

const emits = defineEmits(["closeTriggered", "reloadPaymentLinks"]);

const props = defineProps({
  paymentLinkDetails: {
    type: Object,
    required: true,
  },
});

const { processAPIRequest } = useEvents();
const { updatePaymentLink } = usePaymentStore();

const updateLinkBtnRef = ref(null);

const paymentLinkStatusOptions = computed(() => [
  {
    name: "Active",
    value: "active",
  },
  {
    name: "Inactive",
    value: "inactive",
  },
]);

const paymentPayload = ref<IPaymentLinkType>({
  amount: props.paymentLinkDetails.amount || "",
  description: props.paymentLinkDetails.description || "",
  is_reusable: props.paymentLinkDetails.is_reusable ? "true" : "false",
  status: props.paymentLinkDetails.status || "active",
});

const handleUpdatePaymentLink = async () => {
  const updatedFields = Object.entries(paymentPayload.value).reduce(
    (acc, [key, value]) => {
      let newValue: any = value;

      if (key === "is_reusable") {
        newValue = value === "true"; // convert string to boolean for API
      }

      const originalValue =
        key === "is_reusable"
          ? props.paymentLinkDetails.is_reusable
          : props.paymentLinkDetails[
              key as keyof typeof props.paymentLinkDetails
            ];

      if (newValue !== originalValue) {
        acc[key as keyof typeof acc] = newValue;
      }

      return acc;
    },
    {} as Partial<IPaymentLinkType & { reference: string }>,
  );

  updatedFields.reference = props.paymentLinkDetails.reference;

  const response = await processAPIRequest({
    action: updatePaymentLink,
    payload: updatedFields,
    btnText: "Update Payment Link",
    btnRef: updateLinkBtnRef,
    alertHandler: {
      200: {
        message: "Updated successfully",
        description: "The payment link has been updated",
        type: "success",
      },
      400: {
        message: "Payment status update failed",
        description: "Please provide a valid payment status",
        type: "error",
      },
    },
  });

  if (response.code === 200) {
    emits("reloadPaymentLinks");
    emits("closeTriggered");
  }
};
</script>

<style lang="scss" scoped>
.modal-cover-body {
  @apply flex flex-col pt-6;
  .title-text {
    @apply text-grey-800 font-bold mb-2.5;
  }

  .description-text {
    @apply text-sm leading-[22px] text-grey-700 mb-5;
  }
}
</style>
