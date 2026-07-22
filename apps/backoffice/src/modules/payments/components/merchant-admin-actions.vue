<template>
  <div class="admin-actions">
    <button
      class="outline-action outline-action--success"
      type="button"
      @click="$emit('actionSelected', 'reset-password')"
    >
      Reset account password
    </button>
    <button
      class="outline-action outline-action--success"
      type="button"
      @click="$emit('actionSelected', 'login')"
    >
      Login to account
    </button>
    <button
      class="outline-action outline-action--success"
      type="button"
      @click="$emit('actionSelected', 'reset-mfa')"
    >
      Reset MFA
    </button>
    <button
      class="outline-action outline-action--danger"
      type="button"
      @click="$emit('actionSelected', 'delete')"
    >
      Deactivate merchant's account
    </button>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  actionSelected: [action: "reset-password" | "login" | "reset-mfa" | "delete"];
}>();
</script>

<style scoped lang="scss">
.admin-actions {
  @apply flex flex-wrap items-center justify-end gap-5 md:w-full md:justify-start;
}

.outline-action {
  @apply h-10 rounded-lg border bg-white px-6 text-sm font-bold transition;
}

.outline-action--success {
  @apply border-green-500 text-green-500 hover:bg-green-50;
}

.outline-action--danger {
  @apply border-red-500 text-red-500 hover:bg-pink-50;
}
</style>
