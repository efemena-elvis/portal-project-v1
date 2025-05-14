<template>
  <MerchantWrapper
    :title="'Add Merchants'"
    :description="'Expand Your Network. Add Individual Merchants or Upload in Bulk for Faster Growth.'"
  >
    <router-link to="onboard" class="option-field mb-6">
      <span>Add merchants manually</span>
      <div class="icon-caret-right"></div>
    </router-link>
    <router-link to="add/bulk" class="option-field">
      <span>Bulk upload merchants</span>
      <div class="icon-caret-right"></div>
    </router-link>
  </MerchantWrapper>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import MerchantWrapper from "../../components/aggregator/merchant-wrapper.vue";
import { useRouter } from "vue-router";
</script>

<style scoped lang="scss">
.option-field {
  @apply rounded-lg py-3 px-4 font-semibold cursor-pointer border border-grey-200 w-full flex items-center justify-between;
}
</style>
