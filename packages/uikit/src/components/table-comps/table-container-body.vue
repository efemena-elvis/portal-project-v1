<template>
  <tr @click="handleTableRowClicked">
    <td
      v-for="(header, index) in tableHeader"
      :key="index"
      @click="header?.tableAction"
    >
      <div
        :class="[
          header.tableDataClass,
          renderLogicClass(header, tableData[header.slug]),
        ]"
      >
        <template v-if="isVNode(tableData[header.slug])">
          <!-- Render the VNode directly if it is a component -->
          <component :is="tableData[header.slug]" />
        </template>
        
        <template v-else>
          <span
            v-if="isHtmlString(tableData[header.slug])"
            v-html="tableData[header.slug]"
          />
          <span v-else>{{ tableData[header.slug] }}</span>
        </template>
      </div>
    </td>
  </tr>
</template>

<script setup>
import { isVNode } from "vue";

// Define props
const props = defineProps({
  tableHeader: {
    type: Array,
    required: true,
  },
  tableData: {
    type: Object,
    required: true,
  },
  onTableClicked: Function,
});

// Utility function to check if a string is HTML content
const isHtmlString = (str) => {
  const pattern = /<\/?[a-z][\s\S]*>/i;
  return typeof str === "string" && pattern.test(str);
};

// Function to apply logic-based classes
const renderLogicClass = (headerData, tableData) => {
  if (headerData.tableLogicClass !== undefined) {
    return headerData.tableLogicClass[tableData];
  }
  return "";
};

// Function to handle table row click
const handleTableRowClicked = (event) => {
  if (!event.target.classList.contains("checkbox-select-input")) {
    props.onTableClicked?.(1);
  }
};
</script>

<style scoped>
/* Add your styles here if needed */
</style>
