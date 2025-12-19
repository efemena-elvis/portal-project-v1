<template>
  <tr @click="handleTableRowClicked">
    <td
      v-for="(header, index) in tableHeader"
      :key="index"
      @click="header?.tableAction"
class = "px-4"
     
    >
      <div
        :class="[
          header.tableDataClass,
          renderLogicClass(header, tableData[header.slug]),
        ]"

        class="break-all whitespace-normal max-w-[200px]"
      >
        <template v-if="isVNode(tableData[header.slug])" >
          <!-- Render the VNode directly if it is a component -->
          <component :is="tableData[header.slug]"   />
        </template>
        
        <template v-else>
          <span
           
            v-if="isHtmlString(tableData[header.slug])"
            v-html="tableData[header.slug]"
          />
          <span v-else >{{ tableData[header.slug] }}</span>
        </template>
      </div>
    </td>
  </tr>
</template>

<script setup>
import { isVNode } from "vue";


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


const isHtmlString = (str) => {
  const pattern = /<\/?[a-z][\s\S]*>/i;
  return typeof str === "string" && pattern.test(str);
};


const renderLogicClass = (headerData, tableData) => {
  if (headerData.tableLogicClass !== undefined) {
    return headerData.tableLogicClass[tableData];
  }
  return "";
};


const handleTableRowClicked = (event) => {
  if (!event.target.classList.contains("checkbox-select-input")) {
    props.onTableClicked?.(1);
  }
};
</script>

<style scoped>

</style>
