<template>
  <div>
    <label
      :for="header.name"
      class="flex items-center gap-2 text-green-600 cursor-pointer"
    >
      <div class="icon-file"></div>
      <!-- <span v-if="docPayload[row.id]?.[header.key]?.link">
        <a
          :href="docPayload[row.id][header.key].link"
          target="_blank"
          class="text-green-600 underline"
        >
          {{ docPayload[row.id][header.key].name }}
        </a>
      </span>
      <span v-else>Upload document</span> -->
      <span>Upload document</span>
    </label>

    <input
      :id="header.name"
      type="file"
      class="hidden w-full h-12 px-0 py-1 bg-transparent focus:outline-none"
    />
    <!-- @change="processDocumentUpload($event, row.id, header.key, rowIndex)" -->
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BulkUploadTableType, IMerchantBaseType } from "@packages/models";

const props = defineProps<{
  header: BulkUploadTableType;
  body: IMerchantBaseType;
}>();
</script>

<style lang="scss" scoped></style>
