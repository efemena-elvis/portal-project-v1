<template>
  <PageContentWrapper

    pageDescription="Merchant Storefront"
    :showCustomActionBtn="true"
    customActionBtnText="Create a storefront"
    @customActionBtnClicked="toggleCreateStorefrontModal"
  >

  <template v-slot:pageContent>
      <TableContainer
        :tableHeader="tableHeader"
        :tableBody="tableBody"
        :isLoading="false"
        :emptyData="{
          title: 'No storefront yet',
          description:
            'You haven\'t created any storefront yet. This is where you\'ll be able to see all your created storefronts.',
        }"
      >
        <TableContainerBody
          v-for="(payload, index) in tableBody"
          :key="index"
          :tableHeader="tableHeader"
          :tableData="payload"
        />
      </TableContainer>
    </template>

     
  </PageContentWrapper>
   <teleport to="body" v-if="showCreateStorefrontModal">
    <CreateStoreFrontModal
      @closeTriggered="toggleCreateStorefrontModal"
  
    />
  </teleport>
</template>

<script setup lang="ts">
import {    
  PageContentWrapper,
  TableContainer,
  TableContainerBody
} from "@packages/uikit";
import { TableHeaderType } from "@packages/models";
import { ref } from "vue";
import CreateStoreFrontModal from "../modals/create-storefront-modal.vue";


const tableBody = ref<any[]>([]);

const tableHeader = ref<TableHeaderType[]>([
  { title: "S/N", slug: "counter" },
  { title: "Name", slug: "name" },
  { title: "Orders", slug: "orders" },
  { title: "Revenue", slug: "revenue" },
  { title: "Link", slug: "link" },
  { title: "Status", slug: "status" },
  { title: "", slug: "action" },
]);

const showCreateStorefrontModal = ref(false);
const showDeleteStorefrontModal = ref(false);

const toggleCreateStorefrontModal = () => {
  showCreateStorefrontModal.value = !showCreateStorefrontModal.value;
 

};

</script> 

<style scoped>

</style>