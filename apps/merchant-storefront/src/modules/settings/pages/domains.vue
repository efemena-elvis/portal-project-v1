<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <p class="text-[18px] font-bold">Domains</p>

      <button class="text-white btn btn-small btn-primary">
        <div class="icon icon-add"></div>
        New domain
      </button>
    </div>
    <div class="p-6 bg-white border rounded-sm shadow-md border-grey-100">
   

      <div class="flex items-center justify-between text-lg">
        <div class="flex items-center gap-3">
            <p class="font-medium">mystore.storoapp.com</p>
            <span class="p-1 text-md text-white rounded-md w-[70px] text-center bg-grey-400">Default</span>
        </div>
        <div class="flex items-center gap-3">
            <div class="flex items-center justify-center p-1 text-white bg-green-500 rounded-full text-[16px] h-7 w-7 icon icon-checkmark"></div>
            <p class="mr-4 text-green-600">Connected</p>
            <div class = "text-red-800 cursor-pointer icon icon-trash text-[18px]"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
