<template>
  <AuthCenterWrapper
    title_text="Reset successful"
    :meta_text="`Your password reset was successful.<br>
          Click button below to login`"
    icon_display_type="icon-check-circle"
  >
    <div class="account-content-area w-[70%]">
      <router-link
        :to="{ name: 'VesicashLogin' }"
        class="btn btn-primary w-full hover:text-white"
        >Continue to login</router-link
      >
    </div>
  </AuthCenterWrapper>
</template>

<script setup lang="ts">
import AuthCenterWrapper from "@/modules/auth/components/auth-center-wrapper.vue";
</script>

<style lang="scss" scoped></style>
