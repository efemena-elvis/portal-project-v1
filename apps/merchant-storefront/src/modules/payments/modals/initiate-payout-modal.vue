<template>
  <ModalDialog @closeModal="$emit('closeTriggered')" place_center>
    <!-- MODAL COVER HEADER -->
    <template #modal-cover-header>
      <div class="modal-cover-header">
        <div class="modal-cover-title">Initiate Payout</div>
      </div>
    </template>

    <template #modal-cover-body>
      <div class="modal-cover-body">
        <!-- PAYOUT AMOUNT -->
        <TextFieldInput
          labelId="payoutAmount"
          labelTitle="Payout amount"
          :labelCompact="false"
          :inputType="IInputType.Number"
          inputPlaceholder="Enter a payout amount"
          isRequired
          @inputChanged="payoutPayload.amount = $event"
          :errorHandler="{
            validator: 'validateNumberEntry',
            message: 'Please a valid payout amount',
          }"
        />

        <!-- PAYOUT NARRATION -->
        <TextFieldInput
          labelId="payoutNarration"
          labelTitle="Payout narration"
          :labelCompact="false"
          :inputType="IInputType.Text"
          inputPlaceholder="Enter a payout request narration"
          isRequired
          isTextArea
          @inputChanged="payoutPayload.narration = $event"
          :errorHandler="{
            validator: 'validateRequired',
            message: 'Please provide a payout request narration',
          }"
        />
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template #modal-cover-footer>
      <div class="modal-cover-footer -mt-2">
        <button
          class="btn btn-primary w-full"
          ref="initiatePayoutBtnRef"
          :disabled="isActionReady"
          @click="handlePayoutInitiation"
        >
          Confirm Request
        </button>
      </div>
    </template>
  </ModalDialog>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { IInputType } from "@packages/models";
import { useEvents, useString, useProfile } from "@packages/hooks";
import { ModalDialog, TextFieldInput, FileUploadInput } from "@packages/uikit";
import { useAuthStore } from "@/modules/auth/store";
// import { usePaymentStore } from "../store";

type IPayoutType = {
  amount: number;
  countryId: string;
  narration: string;
};

const emits = defineEmits(["closeTriggered", "reloadStorefront"]);

const authStore = useAuthStore();
const profileUtil = new useProfile(authStore);

const { capitalizeFirstLetter } = useString();
const { processAPIRequest, pushToastAlert } = useEvents();
// const { initiatePayout } = usePaymentStore();

const payoutPayload = ref<IPayoutType>({
  amount: 0,
  countryId: profileUtil.getUser()?.country.id || "",
  narration: "",
});

const initiatePayoutBtnRef = ref(null);

const isActionReady = computed(() => {
  return payoutPayload.value.amount && payoutPayload.value.narration
    ? false
    : true;
});

const handlePayoutInitiation = async () => {
  if (payoutPayload.value.amount < 100) {
    pushToastAlert({
      message: "Payout initiation failed",
      description: "Please provide a minimum payout amount of ZMW100.",
      type: "error",
    });
    return;
  }

  //   const response = await processAPIRequest({
  //     action: initiatePayout,
  //     payload: payoutPayload.value,
  //     btnRef: initiatePayoutBtnRef,
  //     btnText: "Confirm Request",
  //     alertHandler: {
  //       200: {
  //         message: "Payout initiated successfully",
  //         description: "You are being redirected to your payout dashboard",
  //         type: "success",
  //       },

  //       // 400: {
  //       //   message: "Payout initiation failed",
  //       //   description: "Please provide a valid payout details",
  //       //   type: "error",
  //       // },
  //     },
  //   });

  //   if (response.code === 200) {
  //     emits("reloadStorefront");
  //     emits("closeTriggered");
  //   }

  // HANDLE ANY NON 200 ERRORS
  else {
    // pushToastAlert({
    //   message: "Payout initiation failed",
    //   description: capitalizeFirstLetter(response.message),
    //   type: "error",
    // });
  }
};
</script>
