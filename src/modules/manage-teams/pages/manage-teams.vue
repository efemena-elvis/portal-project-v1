<template>
  <PageContentWrapper
    description="Manage your team members and permissions"
    :showTitle="true"
    pageDescription="Manage Teams"
    @updatePage="(currentPage: number) => (page = currentPage)"
    :pagingData="tablePaging"
    @searchEntered="processSearchEntry"
  >
    <template v-slot:pageContent>
      <section class="flex flex-col gap-7">
        <div class="inline-flex bg-teal-100 w-full p-2 rounded-md">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            :class="tabButtonClass(tab.value)"
            @click="navigateToTab(tab.value)"
            type="button"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="flex flex-wrap justify-between gap-6 items-start">
          <div class="flex justify-start items-center gap-4 w-full">
            <div class="relative w-[20%]">
              <div
                class="absolute left-4 top-1/2 -translate-y-1/2 text-grey-700 icon icon-search-normal"
              ></div>
              <input
                v-model="searchQuery"
                type="search"
                class="w-full rounded-lg border border-grey-200 bg-white py-4 pl-12 pr-4 text-sm text-grey-900 shadow-sm outline-none transition duration-200 ease-in-out"
                placeholder="Search"
                aria-label="Search team members"
              />
            </div>

            <button
              class="ml-auto btn btn-sm btn-primary"
              type="button"
              @click="showAddModal = true"
            >
              Add team member
            </button>
          </div>
        </div>

        <TableContainer
          :tableHeader="tableHeader"
          :tableBody="tableBody"
          :isLoading="isLoading"
          :emptyData="{
            title: 'No team members yet',
            description: 'Invite your first team member to get started.',
          }"
        >
          <TableContainerBody
            v-for="(payload, index) in tableBody"
            :key="index"
            :tableHeader="tableHeader"
            :tableData="payload"
          />
        </TableContainer>
      </section>
    </template>
  </PageContentWrapper>

  <AddTeamMemberModal
    v-if="showAddModal"
    @closeTriggered="showAddModal = false"
    @memberAdded="handleMemberAdded"
  />

  <AddTeamMemberModal
    v-if="showEditModal"
    :member="selectedMember"
    @closeTriggered="showEditModal = false"
    @memberUpdated="handleMemberUpdated"
  />

  <DeleteTeamMemberModal
    v-if="showDeleteModal"
    :member="selectedMember"
    @closeTriggered="showDeleteModal = false"
    @memberDeleted="handleMemberDeleted"
  />
</template>

<script lang="ts" setup>
import { ref, h, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { TableHeaderType } from "@packages/models";
import { useString, useEvents } from "@packages/hooks";
import { useTeamStore } from "../store";
import {
  PageContentWrapper,
  TableContainer,
  TableContainerBody,
} from "@packages/uikit";
import AddTeamMemberModal from "../modals/add-team-member-modal.vue";
import DeleteTeamMemberModal from "../modals/delete-team-member-modal.vue";

const { getStatus, getBoldTableText, capitalizeFirstLetter } = useString();
const { processAPIRequest } = useEvents();
const { getTeams, teamList } = useTeamStore();
const router = useRouter();
const route = useRoute();

const formatCountries = (countries: string[]) => {
  if (!countries?.length) return "-";
  if (countries.length === 1) return getStatus("no-status", countries[0]);
  return `${getStatus("no-status", countries[0])} &nbsp; + ${countries.length - 1} more`;
};

const tabs = [
  { label: "Team Members", value: "members" },
  { label: "Roles", value: "roles" },
  { label: "Activities", value: "activities" },
] as const;

const activeTab = computed(() => {
  const path = route.path.replace(/\/$/, "");
  if (path.endsWith("/roles")) return "roles";
  if (path.endsWith("/activities")) return "activities";
  return "members";
});

const tabButtonClass = (tabValue: string) =>
  activeTab.value === tabValue ? "tab-btn tab-btn--active" : "tab-btn";

const navigateToTab = (tab: string) => {
  if (tab === "members") {
    router.push("/manage-teams");
  } else {
    router.push(`/manage-teams/${tab}`);
  }
};

const searchQuery = ref("");
const isLoading = ref(true);
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const selectedMember = ref<any>(null);
const page = ref(1);
const tablePaging = ref<any>({});

const processSearchEntry = (searchValue: string) => {
  searchQuery.value = searchValue.toLocaleLowerCase().trim();
};

const tableHeader = ref<TableHeaderType[]>([
  { title: "Name", slug: "name" },
  { title: "Email", slug: "email" },
  { title: "Role", slug: "role" },
  { title: "Country", slug: "country" },
  { title: "Status", slug: "status" },
  { title: "", slug: "action" },
]);

const tableBody = ref<any[]>([]);

const filters = computed(
  () => `?page=${page.value}&search=${searchQuery.value}`,
);

const mapMemberToRow = (data: any) => ({
  name: getBoldTableText(data.name),
  email: data.email,
  role: getStatus(data.role.toLowerCase(), capitalizeFirstLetter(data.role)),
  country: formatCountries(data.countries),
  status: getStatus(
    data.status.toLowerCase() === "active" ? "successful" : "no-status",
    data.status,
  ),
  action: h("div", { class: "flex items-center gap-8" }, [
    h("button", {
      class:
        "icon icon-pen-edit text-lg text-teal-800 hover:text-green-600 transition cursor-pointer",
      type: "button",
      title: "Edit",
      onClick: (e: Event) => {
        e.stopPropagation();
        handleEdit(data);
      },
    }),
    h("button", {
      class:
        "icon icon-trash text-lg text-red-500 hover:text-red-700 transition cursor-pointer",
      type: "button",
      title: "Delete",
      onClick: (e: Event) => {
        e.stopPropagation();
        handleDelete(data);
      },
    }),
  ]),
});

const fetchTeams = async (filters: string) => {
  isLoading.value = true;
  tableBody.value = teamList.map(mapMemberToRow);

  const response = await processAPIRequest({
    action: getTeams,
    payload: { filters, page: page.value },
    showAlert: false,
  });

  isLoading.value = false;

  if (response?.code === 200) {
    tableBody.value = response.data.map(mapMemberToRow);
    tablePaging.value = response.pagination?.[0] || {};
  }
};

const handleEdit = (member: any) => {
  selectedMember.value = {
    ...member,
    countries: member.countries || (member.country ? [member.country] : []),
  };
  showEditModal.value = true;
};

const handleDelete = (member: any) => {
  selectedMember.value = member;
  showDeleteModal.value = true;
};

const handleMemberAdded = () => {
  showAddModal.value = false;
  fetchTeams(filters.value);
};

const handleMemberUpdated = () => {
  showEditModal.value = false;
  selectedMember.value = null;
  fetchTeams(filters.value);
};

const handleMemberDeleted = () => {
  showDeleteModal.value = false;
  selectedMember.value = null;
  fetchTeams(filters.value);
};

watch(filters, (newFilters) => {
  fetchTeams(newFilters);
});

onMounted(() => fetchTeams(filters.value));
</script>

<style scoped lang="scss">
.tab-btn {
  @apply text-sm font-medium text-grey-700 px-4 py-2 rounded-md transition duration-200 ease-in-out border-0 cursor-pointer bg-transparent;
}

.tab-btn--active {
  @apply bg-white text-teal-800;
}
</style>

