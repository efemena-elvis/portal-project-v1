<template>
  <AuthCenterWrapper
    title_text="Email verified"
    :meta_text="`Your email has been successfully verified.<br>
        Click below to access your dashboard`"
    icon_display_type="icon-mail"
  >
    <div class="account-content-area w-[70%]">
      <router-link
        :to="{ name: 'VesicashOverview' }"
        class="btn btn-primary w-full hover:text-white"
        >Continue</router-link
      >
    </div>
  </AuthCenterWrapper>
</template>

<script setup lang="ts">
import AuthCenterWrapper from "@/modules/auth/components/auth-center-wrapper.vue";
</script>

<style lang="scss" scoped></style>
