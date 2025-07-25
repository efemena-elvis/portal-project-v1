<template>
  <div class="p-8 sm:px-4 xs:px-2">
    <FullPageSidebar
      :routeList="merchantOnboardingRouteList"
      :activeRouteCategory="getActiveRouteCategory"
    />

    <!-- CONTENT AREA -->
    <FullPageContent :pageRouteData="getActiveRouteData" isContentLg>
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
            :disabled="validateActionButton"
            @click="triggerPrimaryActionClick"
          >
            {{ primaryActionText }}
          </button>
        </div>
      </div>
    </FullPageContent>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useEvents } from "@packages/hooks";
import { FullPageSidebar, FullPageContent } from "@packages/uikit";
import { useComplianceStore } from "@/modules/compliance/store";
import { merchantOnboardingRouteList } from "@/modules/compliance/constants/route-list";

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
  isPrimaryActionDisabled: false,
  stopClickHandler: false,
});

const { clickHandler, processAPIRequest } = useEvents();
const {
  getMerchantOnDraft,
  transformCleanedMerchantData,
  bulkUpdateMerchantData,
  addMerchantData,
} = useComplianceStore();

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

/* Validate action button */
const validateActionButton = computed(() => {
  return props.isPrimaryActionDisabled;
});

/* Trigger primary action click */
const triggerPrimaryActionClick = () => {
  clickHandler(btnRef);
  emits("onContinueClick");
};

const getAggregatorDraftedMerchants = async () => {
  try {
    const response = await processAPIRequest({
      action: getMerchantOnDraft,
      payload: {},
    });

    if (response.code === 200) {
      if (!response.data && response.data.data.length) {
        const transformedData = transformCleanedMerchantData(
          response.data.data
        );
        bulkUpdateMerchantData(transformedData);
      } else addMerchantData(true);
    }

    // return response;
  } catch (error) {
    console.error("Error fetching drafted merchants:", error);
    throw error;
  }
};

/* Watch for props changes **/
watch(
  props,
  () => {
    if (props.stopClickHandler)
      clickHandler(btnRef, props.primaryActionText, false);
  },
  { deep: true }
);

onMounted(async () => await getAggregatorDraftedMerchants());
</script>

<style lang="scss" scoped>
.form-data-block {
  @apply relative;

  .form-data {
    @apply mb-20;
  }

  .form-action-row {
    @apply flex justify-between items-center gap-6;

    .btn {
      @apply min-w-[150px] w-auto py-2.5 xs:text-[13.75px];
    }
  }
}
</style>
