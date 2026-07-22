<template>
  <div>
    <PageContentWrapper :showTitle="false">
      <template v-slot:pageContent>
        <div class="add-fee-panel">
          <p class="add-fee-description">
            Add a fee to this merchant's account. Fees can be used for
            administrative charges, penalties, or service costs.
          </p>
          <button
            class="btn btn-primary btn-sm"
            type="button"
            @click="showAddFeeModal = true"
          >
            Add Config
          </button>
        </div>
      </template>
    </PageContentWrapper>

    <AddFeeModal
      v-if="showAddFeeModal"
      :merchantId="merchantId"
      :merchantName="merchantName"
      @closeTriggered="showAddFeeModal = false"
      @feeAdded="showAddFeeModal = false"
    />
  </div>
</template>

<script setup lang="ts">
/* eslint-disable vue/valid-define-props */
import { ref, computed, withDefaults, defineProps } from "vue";
import { PageContentWrapper } from "@packages/uikit";
import AddFeeModal from "@/modules/payments/modals/add-fee-modal.vue";

const props = withDefaults(
  defineProps<{
    merchantId?: string;
    merchantDetails?: Record<string, any> | null;
    businessName?: string;
  }>(),
  {
    merchantId: "",
    merchantDetails: null,
    businessName: "",
  },
);

const merchantName = computed(() => {
  if (props.businessName) return props.businessName;
  return props.merchantDetails?.name || "";
});

const showAddFeeModal = ref(false);
</script>

<style scoped lang="scss">
.add-fee-panel {
  @apply flex flex-col items-start gap-6 rounded-lg bg-white p-8 shadow-sm;
}

.add-fee-description {
  @apply text-sm leading-6 text-grey-600;
}
</style>
