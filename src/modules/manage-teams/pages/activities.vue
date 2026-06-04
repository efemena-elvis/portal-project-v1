<template>
  <PageContentWrapper
    description="View team activity history"
    :showTitle="true"
    pageDescription="Manage Teams"
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

        <div class="flex justify-end">
          <button type="button" class="btn btn-sm btn-secondary">
            Export
          </button>
        </div>

        <TableContainer
          :tableHeader="tableHeader"
          :tableBody="tableBody"
          :isLoading="isLoading"
          :emptyData="{
            title: 'No activities yet',
            description: 'Team activities will appear here.',
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
</template>

<script lang="ts" setup>
import { ref, h, computed, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router"
import { TableHeaderType } from "@packages/models"
import { useString, useEvents, useDate } from "@packages/hooks"
import { useTeamStore } from "../store"
import {
  PageContentWrapper,
  TableContainer,
  TableContainerBody,
  TableDoubleColumn,
} from "@packages/uikit"

defineOptions({ name: "ManageTeamsActivities" })

const router = useRouter()
const route = useRoute()
const { processAPIRequest } = useEvents()
const { getActivities } = useTeamStore()

const tabs = [
  { label: "Team Members", value: "members" },
  { label: "Roles", value: "roles" },
  { label: "Activities", value: "activities" },
] as const

const activeTab = computed(() => {
  const path = route.path.replace(/\/$/, "")
  if (path.endsWith("/roles")) return "roles"
  if (path.endsWith("/activities")) return "activities"
  return "members"
})

const tabButtonClass = (tabValue: string) =>
  activeTab.value === tabValue ? "tab-btn tab-btn--active" : "tab-btn"

const navigateToTab = (tab: string) => {
  if (tab === "members") {
    router.push("/manage-teams")
  } else {
    router.push(`/manage-teams/${tab}`)
  }
}

const isLoading = ref(true)

const tableHeader = ref<TableHeaderType[]>([
  { title: "Email", slug: "email" },
  { title: "Date", slug: "date" },
  { title: "Activity", slug: "activity" },
])

const dummyActivities = [
  { email: "john.doe@company.com", date: "2025-05-25T09:30:00Z", activity: "Logged in to the dashboard" },
  { email: "jane.smith@company.com", date: "2025-05-25T10:15:00Z", activity: "Updated merchant profile" },
  { email: "sam.wilson@company.com", date: "2025-05-24T14:45:00Z", activity: "Approved withdrawal request #1234" },
]

const getDateFormatted = (date: string) => {
  const { w2, m3, d3, y1 } = useDate.formatDate(date).getAll()
  return `${w2}, ${d3} ${m3}, ${y1}`
}

const mapActivityToRow = (data: any) => ({
  email: h("span", { class: "font-semibold text-grey-800" }, data.email),
  date: h(TableDoubleColumn, {
    entry: {
      primaryText: getDateFormatted(data.date),
      secondaryText: useDate.formatTime(data.date),
    },
  }),
  activity: data.activity,
})

const tableBody = ref<any[]>([])

const fetchActivities = async () => {
  isLoading.value = true
  tableBody.value = dummyActivities.map(mapActivityToRow)

  try {
    const response = await processAPIRequest({
      action: getActivities,
      payload: {},
      showAlert: false,
    })
    if (response?.code === 200 && response.data?.length) {
      tableBody.value = response.data.map(mapActivityToRow)
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => fetchActivities())
</script>

<style scoped lang="scss">
.tab-btn {
  @apply text-sm font-medium text-grey-700 px-4 py-2 rounded-md transition duration-200 ease-in-out border-0 cursor-pointer bg-transparent;
}

.tab-btn--active {
  @apply bg-white text-teal-800;
}

:deep(tbody tr td:first-child) {
  padding-left: 1.25rem;
}

:deep(tbody tr td:last-child) {
  padding-right: 1.25rem;
  text-align: left;
}
</style>
