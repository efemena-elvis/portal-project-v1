<template>
  <div class="sm:mt-16">
    <div class="flex items-center justify-between">
      <button class="btn-row w-[70px]" @click="handleGoBack">Back</button>
      <button class="btn-row w-[120px]">Delete merchant</button>
    </div>
    <div class="flex flex-col gap-8 my-8">
      <div>
        <p class="mb-2 text-3xl font-semibold">TerraFirma Solutions</p>
        <div class="flex items-center gap-4">
          <P class="text-grey-600">ID - {{ merchantID }}</P>
          <span class="text-green-400 bg-green-50/75 border-green-100/40 w-[70px] p-1 rounded-full text-center"
            >Verified</span
          >
        </div>
      </div>
      <div class="max-w-xl p-6 border rounded-md border-grey-100">
        
      </div>
        
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const merchantID = route.params.id;

const handleGoBack = () => {
  router.back();
};

</script>

<style scoped>
.btn-row {
  @apply p-2 border rounded-md cursor-pointer hover:bg-gray-100 border-grey-100;
}
</style>
