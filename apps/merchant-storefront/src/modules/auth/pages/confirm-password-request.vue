<template>
  <AuthCenterWrapper
    title_text="Check your email"
    :meta_text="`We've sent a password reset link to
  <span class='text-green-500 font-medium'>menaelvisjones@gmail.com</span>`"
    icon_display_type="icon-mail"
  >
    <router-link
      :to="{ name: 'StoroLogin' }"
      class="btn btn-primary w-full my-2 hover:text-white"
      >Continue to login</router-link
    >
  </AuthCenterWrapper>
</template>

<script lang="ts" setup>
import AuthCenterWrapper from "@/modules/auth/components/auth-center-wrapper.vue";
</script>
