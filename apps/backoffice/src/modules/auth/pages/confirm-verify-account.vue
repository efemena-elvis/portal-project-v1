<template>
  <AuthWrapper
    title_text="Email verified"
    :meta_text="`Your email has been successfully verified.<br>
        Click below to access your dashboard`"
    icon_display_type="icon-mail"
  >
    <div class="account-content-area">
      <router-link
        :to="{ name: 'VesicashOverview' }"
        class="btn btn-primary w-full hover:text-white"
        >Continue</router-link
      >
    </div>
  </AuthWrapper>
</template>

<script setup lang="ts">
import AuthWrapper from "@/modules/auth/components/auth-wrapper.vue";
</script>

<style lang="scss" scoped></style>
