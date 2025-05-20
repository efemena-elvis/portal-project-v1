<template >
    <div class="flex flex-col gap-8 mt-8">
        <div v-for = "(profile, index) in profiles" :key = "index" class="flex flex-col gap-6 bg-teal-50/40 p-8 rounded-[8px] border border-teal-100 cursor-pointer">
        <h1 class="text-grey-900 font-bold text-2xl">{{ profile.section }}</h1>
        <div class="grid grid-cols-4 gap-8">
        <div class="" v-for = "(field, index) in profile.fields" :key = "index">
        <div class="flex flex-col gap-2">
            <p class="uppercase text-grey-600">{{ field.label }}</p>
            <p class="text-grey-900 font-bold">{{ field.value }}</p>
        </div>
        </div>
        </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const profiles = [
  {
    section: "Business information",
    fields: [
      { label: "Date created", value: "21st Apr 2023" },
      { label: "Last paid from", value: "United States" },
      { label: "Phone number", value: "08145671903" },
      { label: "Address", value: "21 Gregory Street, New York, United States." },
      { label: "Transacting parties", value: "Two parties" },
      { label: "Disbursement type", value: "One-off disbursement type" }
    ]
  },
  {
    section: "Business contacts",
    fields: [
      { label: "Date created", value: "21st Apr 2023" },
      { label: "Last paid from", value: "United States" },
      { label: "Phone number", value: "08145671903" },
      { label: "Address", value: "21 Gregory Street, New York, United States." },
      { label: "Transacting parties", value: "Two parties" },
      { label: "Disbursement type", value: "One-off disbursement type" }
    ]
  }
]
</script>

<style scoped>

</style>