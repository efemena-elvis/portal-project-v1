<template>
  <div class="app-container">
    <!-- CONTENT AREA -->
    <FullPageContent :pageRouteData="pageData">
      <template v-if="isLoading">
        <ComplianceSkeleton />
      </template>

      <div class="form-data-block" v-else>
        <div class="form-data">
          <slot></slot>
        </div>

        <div class="form-action-row" v-if="showActionRow">
          <button
            class="btn btn-sm btn-secondary"
            :disabled="isSecondaryActionDisabled"
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
import { useEvents } from "@packages/hooks";
import { FullPageContent, ComplianceSkeleton } from "@packages/uikit";

interface IWrapperType {
  showActionRow?: boolean;
  primaryActionText?: string;
  isPrimaryActionDisabled?: boolean;
  isSecondaryActionDisabled?: boolean;
  stopClickHandler?: boolean;
  pageData?: Array<{
    name: string;
    route: string;
    title: string;
    description: string;
  }>;
}

const emits = defineEmits(["onBackClick", "onContinueClick"]);

const props = withDefaults(defineProps<IWrapperType>(), {
  showActionRow: false,
  primaryActionText: "Continue",
  isPrimaryActionDisabled: false,
  stopClickHandler: false,
  pageData: () => [],
});

const { clickHandler } = useEvents();

const btnRef = ref(null);
const isLoading = ref<boolean>(true);

/* Validate action button */
const validateActionButton = computed(() => {
  return props.isPrimaryActionDisabled;
});

/* Trigger primary action click */
const triggerPrimaryActionClick = () => {
  clickHandler(btnRef);
  emits("onContinueClick");
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

/* On mounted lifecycle hook */
onMounted(() => {
  setTimeout(() => (isLoading.value = false), 1000);
});
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

    .btn-primary {
      @apply min-w-[160px];
    }
  }
}
</style>
