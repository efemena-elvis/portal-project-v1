<template>
  <div class="p-8">
    <FullPageSidebar
      :routeList="merchantOnboardingRouteList"
      :activeRouteCategory="getActiveRouteCategory"
    />

    <!-- CONTENT AREA -->
    <FullPageContent :pageRouteData="getActiveRouteData">
      <!-- <template v-if="isMerchantsDataLoading">
        <ComplianceSkeleton />
      </template> -->

      <div class="form-data-block">
        <div class="form-data">
          <slot></slot>
        </div>

        <div class="form-action-row" v-if="showActionRow">
          <button
            class="btn btn-sm btn-secondary"
            @click="$emit('onBackClick')"
          >
            Back
          </button>

          <button
            class="btn btn-sm btn-primary"
            ref="btnRef"
            @click = "triggerPrimaryActionClick"
        
          >
            {{ primaryActionText }}
          </button>
        </div>
      </div>
    </FullPageContent>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { useEvents, useProfile } from "@packages/hooks";
import {
  FullPageSidebar,
  FullPageContent,
  ComplianceSkeleton,
} from "@packages/uikit";

import { useAuthStore } from "@/modules/auth/store";
import { merchantOnboardingRouteList } from "@/modules/overview/constants/route-list";
import { useMerchantUtils } from "@packages/hooks/src/useMerchantUtils";

type IPageRouteType = {
  name: string;
  route: string;
  title: string;
  description: string;
};

interface IOnboardingInfoType {
  showActionRow?: boolean;
  primaryActionText?: string;
  isPrimaryActionDisabled?: boolean;
  stopClickHandler?: boolean;

}

const route = useRoute();
const emits = defineEmits(["onBackClick", "onContinueClick"]);

const props = withDefaults(defineProps<IOnboardingInfoType>(), {
  showActionRow: false,
  primaryActionText: "Continue",
  // isPrimaryActionDisabled: false,
  stopClickHandler: false,
});



const { processAPIRequest, clickHandler } = useEvents();
const merchanStore = useMerchantUtils();

const btnRef = ref(null);


/* Get active route category */
const getActiveRouteCategory = computed(() => {
  const { title } = route.meta?.pageMeta as {
    title: string;
  };

  return title.split("-")[0]?.toLowerCase() || "";
});

/* Get active route data */
const getActiveRouteData = computed(() => {
  return merchantOnboardingRouteList.find(
    (route) => route.category === getActiveRouteCategory.value
  )?.metadata as IPageRouteType[];
});

/* Trigger primary action click */
const triggerPrimaryActionClick = () => {
  clickHandler(btnRef);
  emits("onContinueClick");
};

// Fetch all compliance data
// const fetchComplianceData = async () => {
//   const response = await processAPIRequest({
//     action: getCompliance,
//     payload: {},
//     showAlert: false,
//   });

//   if ([200, 400].includes(response.code || response.status)) {
//     isComplianceLoading.value = false;
//     mutateCompliance(response);
//   }
// };

// Fetch compliance data
// fetchComplianceData();

/* Watch for props changes **/
watch(
  props,
  () => {
    if (props.stopClickHandler)
      clickHandler(btnRef, props.primaryActionText, false);
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
.form-data-block {
  @apply relative;

  .form-data {
    @apply mb-10;
  }

  .form-action-row {
    @apply flex justify-between items-center gap-6;

    .btn {
      @apply min-w-[130px] w-auto py-2.5 xs:text-[13.75px];
    }
  }
}
</style>
