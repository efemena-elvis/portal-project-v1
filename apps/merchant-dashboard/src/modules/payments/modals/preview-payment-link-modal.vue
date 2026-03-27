<template>
  <ModalDialog @closeModal="$emit('closeTriggered')">
    <template #modal-cover-body>
      <div :style="{ backgroundColor: paymentLinkPayload.background_color }" class="p-6">
        <img
        v-if="paymentLinkPayload?.logo_url"
          :src="paymentLinkPayload?.logo_url"
          alt="logo"
          class="w-[60px] h-[60px] aspect-square rounded-md border border-grey-200"
        />

        <div class="flex flex-col gap-1 mt-6 font-semibold">
          <label for="amount">Amount</label>
          <div  class=" border-b pb-1 font-bold flex gap-1 text-xl">
            <span>{{ currencySymbol}}</span>
            <input
              type="number"
              placeholder="0.00"
              :disabled="!paymentLinkPayload.allow_amount_edit"
              v-model="paymentLinkPayload.amount"
              class="bg-transparent focus:outline-none"
            />
            
          </div>
          <span class="text-sm text-grey-300 font-normal" v-if="paymentLinkPayload.allow_amount_edit">Enter Amount</span>
        </div>
        <div class=" space-y-2 mt-4">
          <p class="font-semibold">Description</p>
          <span class="ml-2">{{ paymentLinkPayload.description }}</span>
        </div>
        <div class="mt-4 modal-cover-footer -mx-6">
          <button
            class="w-full btn btn-primary cursor-pointer"
            ref="makePaymentBtnRef"
            :disabled="isActionReady"
            @click="handleMakePayment"
          >
            Make Payment
          </button>
        </div>
      </div>
    </template>
  </ModalDialog>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { ModalDialog} from "@packages/uikit";
import { countryCurrencies } from "@packages/constants";
import { useEvents, useString} from "@packages/hooks";
import { usePaymentStore } from "@/modules/payments/store";

type IPaymentLinkType = {
  amount: string;
  allow_amount_edit?: boolean;
  description: string;
  currency: string;
  logo_url?: string;
  background_color?: string;
  is_Reusable: boolean;
};

const emits = defineEmits(["closeTriggered", "reloadPaymentLinks"]);

const paymentStore = usePaymentStore();
const {pushToastAlert} = useEvents()
const {capitalizeFirstLetter} = useString()

const paymentLinkPayload = computed(() => {
  return paymentStore.previewPayload;
});

const makePaymentBtnRef = ref(null);


const currencySymbol = computed(() => {
  const countryCurrency = countryCurrencies.find(
    (country) => country.currency.short === paymentLinkPayload.value?.currency
  );
  return countryCurrency?.currency.sign;
});

const isActionReady = computed(() => {
  return paymentLinkPayload.value.amount ? false : true;
});

const handleMakePayment = async () => {

    pushToastAlert({
      message: capitalizeFirstLetter(
        "Unable to make payment",
      ),
      description: "You have to create a payment link first.",
      type: "warning",
    });
  
};


</script>

<style lang="scss" scoped>
.display-block {
  @apply border border-grey-300 rounded-md px-4 py-3 -mt-1 mb-8;

  .top-row {
    @apply flex justify-start items-center gap-x-2 mb-2;

    .icon {
      @apply text-lg text-grey-600;
    }

    .primary-text {
      @apply text-[14px] text-grey-700 font-semibold;
    }
  }

  .bottom-row {
    @apply flex justify-start items-start text-sm;

   
  }

  .modal-cover-footer {
    @apply absolute bottom-0 left-0 right-0 py-6 sm:py-4 bg-white;
  }
}
</style>
