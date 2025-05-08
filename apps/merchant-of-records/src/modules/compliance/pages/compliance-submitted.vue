<template>
  <div class="layout-wrapper">
    <div class="submitted-layout transition duration-300 ease-in-out">
      <template v-if="businesActivated">
        <!-- ICON IMAGE -->
        <div class="icon-img">
          <img src="@images/pending-icon.png" alt="emptyComplianceSection" />
        </div>

        <!-- TITLE TEXT -->
        <div class="title-text">Your Compliance Submission is Under Review</div>

        <!-- DESCRIPTION TEXT -->
        <div class="description-text">
          <p>
            Thank you for submitting your compliance information. Our team is
            currently reviewing your documents to ensure it meets necessary
            requirements. This process typically takes between 24 - 36 business
            hours, and we'll notify you once the review is complete.
          </p>
        </div>

        <!-- ACTION BUTTON -->
        <button
          class="btn btn-primary mt-2 mb-1 sm:mb-0"
          @click="accessDashboard"
        >
          Go to Dashboard
        </button>
      </template>

      <template v-else>
        <!-- SKELETON COMPLIANCE -->
        <ComplianceSuccessSkeleton />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEvents } from "@packages/hooks";
import { ComplianceSuccessSkeleton } from "@packages/uikit";
import { useComplianceStore } from "@/modules/compliance/store";

const route = useRoute();
const router = useRouter();

const { processAPIRequest } = useEvents();
const { activateBusiness } = useComplianceStore();

const businesActivated = ref<boolean>(false);

const accessDashboard = () => {
  router.push("/overview");
};

const activateMyBusiness = async (complianceId: string) => {
  const response = await processAPIRequest({
    action: activateBusiness,
    payload: { complianceId },
    alertHandler: {
      400: {
        message: "Unable to activate business at this time",
        type: "error",
      },
    },
  });

  if (response.code === 200) {
    setTimeout(() => (businesActivated.value = true), 1500);
  }
};

watch(
  () => route.params.complianceId,
  (newComplianceId) => {
    if (newComplianceId) activateMyBusiness(newComplianceId as string);
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.layout-wrapper {
  @apply w-full h-auto sm:pt-1 flex justify-center sm:justify-start items-start;

  .submitted-layout {
    @apply w-[36%] xl:w-[40%] lg:w-[45%] md:w-1/2 sm:w-full pt-8 flex flex-col justify-center items-center gap-y-6;

    .icon-img {
      img {
        @apply w-[75px] lg:w-[70px] sm:w-[60px] h-auto;
      }
    }

    .title-text {
      @apply text-center text-teal-900/85 font-semibold text-[22px] lg:text-xl sm:text-[18px] w-[75%] mdLg:w-4/5 sm:w-[85%];
    }

    .description-text {
      @apply flex flex-col gap-y-4 text-center text-grey-600 w-[90%] xl:w-full;

      p {
        @apply text-[15.5px] lg:text-[14.5px] leading-[24px];
      }
    }
  }
}
</style>
