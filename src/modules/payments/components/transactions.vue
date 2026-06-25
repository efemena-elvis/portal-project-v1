<template>
  <section class="transactions-panel">
    <div class="filters-row">
      <FilterBar
        :filters="filterConfig"
        :values="filterValues"
        variant="panel"
        @change="onFilterChange"
      />

      <button
        class="btn btn-sm btn-secondary mt-8"
        type="button"
        @click="exportToExcel"
      >
        Export
      </button>
    </div>

    <TableContainer
      :tableHeader="tableHeader"
      :tableBody="filteredTableBody"
      :isLoading="isLoading"
      :emptyData="{
        title: 'No transactions yet',
        description: 'This merchant has no transactions at the moment.',
      }"
    >
      <TableContainerBody
        v-for="(payload, index) in filteredTableBody"
        :key="index"
        :tableHeader="tableHeader"
        :tableData="payload"
      />
    </TableContainer>

    <Pagination
      v-if="tablePaging.page_count > 0"
      :pageDescription="`Page ${tablePaging.current_page} of ${tablePaging.total_pages_count}`"
      :pagingData="tablePaging"
      @page-change="onPageChange"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, ref, reactive, watch, onMounted, h } from "vue"
import { TableHeaderType } from "@packages/models"
import { useDate, useString, useEvents } from "@packages/hooks"
import {
  FilterBar,
  Pagination,
  TableContainer,
  TableContainerBody,
  TableDoubleColumn,
} from "@packages/uikit"
import { usePaymentStore } from "@/modules/payments/store"
import { safeExport } from "@/shared/utils/export"

interface MerchantTransaction {
  date: string
  createdAt: string
  customer: string
  customerSecondary: string
  paymentMethod: string
  amount: string
  status: string
  reference: string
  type: string
}

const props = withDefaults(
  defineProps<{
    merchantId?: string
    merchantDetails?: Record<string, any> | null
  }>(),
  { merchantId: "", merchantDetails: null },
)

const { getTransactions } = usePaymentStore()
const { processAPIRequest } = useEvents()
const { getStatus, formatNumber, getBoldTableText, capitalizeFirstLetter } = useString()

const isLoading = ref(false)
const page = ref(1) 
const tablePaging = ref<any>({})

const filterValues = reactive({
  search: "",
  paymentMethod: "",
  status: "",
  period: null as [Date, Date] | null,
})

const filterConfig = [
  { type: "search" as const, key: "search", placeholder: "Search" },
  {
    type: "select" as const,
    key: "paymentMethod",
    options: ["Card", "Mobilemoney", "Bank Transfer", "Reversal"],
    placeholder: "Payment method",
  },
  {
    type: "select" as const,
    key: "status",
    options: ["Completed", "Pending", "Failed"],
    placeholder: "Status",
  },
  { type: "date" as const, key: "period" },
]

const onFilterChange = ({ key, value }: { key: string; value: any }) => {
  if (key === "period") {
    filterValues.period = value?.length === 2
      ? [new Date(value[0]), new Date(value[1])]
      : null
  } else {
    (filterValues as any)[key] = value
  }
  page.value = 1
}

const tableHeader: TableHeaderType[] = [
  { title: "Date", slug: "date" },
  { title: "Customer", slug: "customer" },
  { title: "Payment Method", slug: "payment_method" },
  { title: "Reference", slug: "reference" },
  { title: "Amount", slug: "amount" },
  { title: "Status", slug: "status" },
]

const formatDate = (date?: string) => {
  if (!date) return "-"
  const { m3, d3, y1, h1, b2, a0 } = useDate.formatDate(date).getAll()
  return `${m3} ${d3}, ${y1} ${h1}:${b2} ${a0}`
}

const getDateCreated = (date: string) => {
  const { w2, m3, d3, y1 } = useDate.formatDate(date).getAll()
  return `${w2}, ${d3} ${m3}, ${y1}`
}

const getCustomerName = (data: any) => {
  if (!data) return "-"
  const firstName = data.first_name
  const lastName = data.last_name
  if (firstName || lastName) return `${firstName || ""} ${lastName || ""}`.trim()
  const account = data.account_number
  if (account) return account
  return data.reference || "-"
}

const getCustomerSecondary = (data: any) => {
  if (!data) return "-"
  const email = data.email
  if (email) return email
  const phone = data.phone
  if (phone) return phone
  return "-"
}

const normalizeTransaction = (
  transaction: Record<string, any>,
): MerchantTransaction => ({
  date: formatDate(transaction.created_at),
  createdAt: transaction.created_at,
  customer: getCustomerName(transaction),
  customerSecondary: getCustomerSecondary(transaction),
  paymentMethod: transaction.method || "-",
  reference: transaction.reference || "-",
  amount: transaction.amount ? `${transaction.currency} ${formatNumber(transaction.amount)}` : "-",
  status: (transaction.status || "").toLowerCase(),
  type: transaction.type || "-",
})

const fmtStartISO = (date: Date) => date.toISOString().replace(/\.\d+Z$/, "Z")
const fmtEndISO = (date: Date) => {
  const end = new Date(date)
  end.setHours(23, 59, 59, 999)
  return end.toISOString().replace(/\.\d+Z$/, "Z")
}

const apiFilters = computed(() => {

  let filters = `?page=${page.value}&user_id=${props.merchantId}&status=${filterValues.status}&reference=${filterValues.search}`

  if (filterValues.paymentMethod)
    filters += `&method=${filterValues.paymentMethod === "bank transfer" ? "bank" : filterValues.paymentMethod}`

  if (filterValues.period) {
    filters += `&from_created_at=${fmtStartISO(filterValues.period[0])}`
    filters += `&to_created_at=${fmtEndISO(filterValues.period[1])}`
  }
  return filters
})

const transactions = ref<MerchantTransaction[]>([])
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const fetchTransactions = async () => {
  if (!props.merchantId) return
  isLoading.value = true

  const response = await processAPIRequest({
    action: getTransactions,
    payload: { filters: apiFilters.value, page: page.value },
    showAlert: false,
  })

  isLoading.value = false

  if (response?.code !== 200) return

  const data = response.data
  const transactionsList = Array.isArray(data)
    ? data
    : data?.transactions || []

  transactions.value = transactionsList
    .map((t: Record<string, any>) => {
      try { return normalizeTransaction(t) } catch { return null }
    })
    .filter(Boolean) as MerchantTransaction[]

  const src = response.pagination?.[0] || data
  const totalRecords = src.total_records || 0
  const pageSize = src.page_size || 10
  const pageCount = Math.ceil(totalRecords / pageSize) || 0
  tablePaging.value = {
    current_page: src.current_page || src.page || page.value,
    page_count: pageCount,
    total_pages_count: pageCount,
  }
}

const onPageChange = (pageNum: number) => {
  page.value = pageNum
}


const filteredTableBody = computed(() =>
  transactions.value.map((transaction) => {
    const key = transaction.status === "completed" ? "successful" : transaction.status
    const label = transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)
    return {
      date: h(TableDoubleColumn, {
        entry: {
          primaryText: getDateCreated(transaction.createdAt),
          secondaryText: useDate.formatTime(transaction.createdAt),
        },
      }),
      customer: h(TableDoubleColumn, {
        entry: {
          primaryText: transaction.customer,
          secondaryText: transaction.customerSecondary,
        },
      }),
      payment_method: h(TableDoubleColumn, {
        entry: {
          primaryText: capitalizeFirstLetter(transaction.paymentMethod.replace(/_/g, " ")),
          secondaryText: capitalizeFirstLetter(transaction.type.replace(/_/g, " ")),
        },
      }),
      reference: transaction.reference,
      amount: getBoldTableText(transaction.amount),
      status: getStatus(key, label),
    }
  }),
)

watch(
  () => [props.merchantId, apiFilters.value] as const,
  () => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(fetchTransactions, 300)
  },
)

onMounted(() => {
  if (props.merchantId) fetchTransactions()
})

const exportToExcel = () => {
  const cleanData = transactions.value.map(
    ({ date, customer, customerSecondary, paymentMethod, amount, status }) => ({
      Date: date,
      Customer: customer,
      Email: customerSecondary,
      "Payment Method": paymentMethod,
      Amount: amount,
      Status: status,
    }),
  )

  safeExport(cleanData, `Merchant_${props.merchantId}_Transactions.xlsx`, 'Merchant Transactions')
}
</script>

<style scoped lang="scss">
.transactions-panel {
  @apply flex flex-col gap-5;
}

.filters-row {
  @apply flex flex-wrap items-center gap-5;
}

:deep(tbody tr td:last-child) {
  text-align: left;
}
</style>
