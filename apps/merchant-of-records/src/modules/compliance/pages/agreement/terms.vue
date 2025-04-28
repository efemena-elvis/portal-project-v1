<template>
  <ComplianceWrapper
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'ComplianceBankAccount' })"
    @onContinueClick="handleMerchantAgreementUpdate"
  >
    <!-- AGREEMENT ALERT -->
    <div class="agreement-alert">
      <div class="icon icon-info-circle"></div>

      <div>
        <div class="alert-secondary-msg">
          Please ensure the information you provided is accurate.
        </div>

        <div class="alert-primary-msg">
          Do not accept this agreement if your business details are incorrect.
        </div>
      </div>
    </div>

    <div class="merchant-agreement-block">
      <div class="agreement-copy-section">
        <div class="title-text">Merchant Agreement</div>

        <div class="decription-text">
          <span>The Vesicash Merchant Agreement</span> is a contract between you
          and Vesicash, outlining the responsibilities of both parties. It also
          emphasizes specific risks and conditions associated with using our
          Services, which you should review thoroughly. By using this website or
          any of our Services, you agree to the terms of this Agreement.
        </div>
      </div>

      <div class="agreement-copy-section">
        <div class="title-text">Accept Agreement</div>

        <div class="decription-text">
          If you are accepting this Agreement on behalf of your employer or
          another entity, you affirm that you have the legal authority as a
          signatory officer to bind your employer or the entity to these terms
          and conditions. If you do not have the signatory rights, please
          refrain from signing the agreement below.
        </div>
      </div>

      <div class="agreement-copy-section">
        <div class="decription-text text-grey-900 font-semibold">
          By signing this agreement, I am accepting this agreement on behalf of
          {{ getBusinessProfile?.businessName ?? "-------" }}. I represent and
          warrant that (a) I have the full legal authority to bind the entity to
          this Agreement, (b) I have read and understand this Agreement, and (c)
          I agree to all the terms and conditions of this Agreement on behalf of
          the entity that I represent.
        </div>
      </div>

      <div class="mt-8 mb-2">
        <label
          for="acceptAgreement"
          class="flex justify-start items-center gap-x-3 cursor-pointer"
        >
          <input
            type="checkbox"
            class="sm-size"
            id="acceptAgreement"
            v-model="businessPayload.signed_agreement"
          />
          <div class="text-grey-900 font-medium text-sm">
            I accept the Merchant Terms & Agreement
          </div>
        </label>
      </div>
    </div>
  </ComplianceWrapper>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useProfile, useComplianceUtil } from "@packages/hooks";
import { ComplianceWrapper } from "@/modules/compliance/components";
import { useComplianceStore } from "@/modules/compliance/store";
import { useAuthStore } from "@/modules/auth/store";

type IBusinessType = {
  signed_agreement: boolean;
};

const router = useRouter();

const authStore = useAuthStore();
const complianceStore = useComplianceStore();

const profileUtil = new useProfile(authStore);
const complianceUtil = new useComplianceUtil(complianceStore);

const getBusinessProfile = computed(() => profileUtil.getBusiness());
const { getComplianceAgreement } = storeToRefs(complianceStore);

const stopClickHandler = ref<boolean>(false);

const businessPayload = ref<IBusinessType>({
  signed_agreement: getComplianceAgreement.value?.signed_agreement || false,
});

const isActionReady = computed(() => {
  return businessPayload.value.signed_agreement ? false : true;
});

const getBusinessPayload = computed(() => {
  const { signed_agreement } = businessPayload.value;
  return { signed_agreement };
});

const handleMerchantAgreementUpdate = async () => {
  await complianceUtil.handleComplianceRequest({
    payload: getBusinessPayload,
    redirectRoute: "ComplianceSummary",
    stopClickHandler,
    succesMsg: "Merchant agreement submitted",
    errorMsg: "Merchant agreement update failed",
    payloadType: "terms",
  });
};

watch(
  getComplianceAgreement,
  (newValue) => {
    if (newValue) {
      businessPayload.value = {
        signed_agreement: newValue.signed_agreement || false,
      };
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.agreement-alert {
  @apply mb-8 px-6 py-[22px] rounded-md bg-yellow-100/60 flex justify-start items-start gap-x-4;

  .icon {
    @apply text-grey-700 text-lg leading-4 relative top-[2.5px];
  }

  .alert-secondary-msg {
    @apply text-yellow-800 text-sm mb-2;
  }

  .alert-primary-msg {
    @apply text-yellow-800 font-semibold text-sm uppercase;
  }
}

.merchant-agreement-block {
  @apply border border-grey-200/80 rounded-lg px-6 py-5 bg-neutral-10/60;

  .agreement-copy-section {
    @apply mb-5;

    .title-text {
      @apply text-grey-800 text-[14.75px] mb-2 font-semibold;
    }

    .decription-text {
      @apply text-grey-700/95 text-[14.25px];

      span {
        @apply text-green-600 cursor-pointer transition duration-300 ease-in-out hover:text-green-500/95;
      }
    }
  }
}
</style>
