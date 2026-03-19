<template>
  <div class="flex items-center gap-2">
    <a
      :href="link"
      target="_blank"
      class="truncate max-w-[240px] text-grey-900"
    >
      {{ link }}
    </a>

    <div
      class="icon icon-copy cursor-pointer text-grey-500 hover:text-grey-700"
      @click="copyLink"
    />
  </div>
</template>

<script setup lang="ts">
import { useEvents } from '@packages/hooks';

const { pushToastAlert } = useEvents();

const props = defineProps<{
  link: string;
}>();

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(props.link);
    pushToastAlert({
      type: "success",
      message: "Payment link copied to clipboard",
    });
  } catch (e) {
    console.error("Copy failed");
  }
};
</script>