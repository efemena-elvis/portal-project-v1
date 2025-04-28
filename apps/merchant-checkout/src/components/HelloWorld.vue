<template>
  <div
    class="w-full flex flex-col justify-center items-center mx-auto border border-red-500"
  >
    <h1>{{ msg }}</h1>

    <div class="card">
      <button type="button" @click="count++">count is {{ count }}</button>
      <p>
        Edit
        <code>components/HelloWorld.vue</code> to test HMR
      </p>
    </div>

    <img src="@images/customer-service.png" alt="" class="size-32" />

    <div class="border border-white py-6 mx-auto w-3/5">
      <TextFieldInput
        labelId="businessEmail"
        labelTitle="Email address"
        :inputType="IInputType.Email"
        inputPlaceholder="hello@companyname.com"
        :isRequired="true"
        :hasBottomPadding="false"
        :errorHandler="{
          validator: 'validateEmail',
        }"
      ></TextFieldInput>

      <button class="btn btn-primary btn-md w-full mt-2">
        <span class="icon-calendar"></span> Create Account
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { IInputType } from "@packages/models";
import { TextFieldInput } from "@packages/uikit";

defineProps<{ msg: string }>();

const count = ref(0);
</script>

<style scoped></style>
