<template >
    <div class="flex flex-col gap-8 mt-8">
        <div v-for = "(profile, index) in profiles" :key = "index" class="flex flex-col gap-6 bg-teal-50/40 p-8 rounded-[8px] border border-teal-100">
        <h1 class="text-grey-900 font-bold text-2xl">{{ profile.section }}</h1>
        <div class="grid grid-cols-4 gap-8">
        <div class="" v-for = "(field, index) in profile.fields" :key = "index">
        <div class="flex flex-col gap-2">
            <p class="uppercase text-grey-600">{{ field.label }}</p>
            <p class="text-grey-900 font-[600]">{{ field.value }}</p>
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
      { label: "Business name", value: "TerraFirma Solutions" },
      { label: "Established year", value: "2015" },
      { label: "Director's", value: "Jane Smith" },
      { label: "Website", value: "www.terrafirma.com" },
    ]
  },
  {
    section: "Business contacts",
    fields: [
      { label: "Business Address", value: "123 Green Lane, Springfield" },
      { label: "Phone number", value: "08145671903" },
      { label: "X", value: "https://x.com/terra" },
      { label: "Email", value: "contact@terrafirma.com" },
    ]
  }
]
</script>

<style scoped>

</style>