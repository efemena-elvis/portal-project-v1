<template>
  <div class="flex items-center gap-2">
    <component
      :is="isText ? 'span' : 'a'"
      v-bind="!isText ? { href: link, target: '_blank' } : {}"
      class="truncate max-w-[240px] text-grey-900"
    >
      {{ link }}
    </component>

    <div
      class="icon icon-copy cursor-pointer text-grey-500 hover:text-grey-700"
      @click="copyLink"
    />
  </div>
</template>

<script setup lang="ts">
import { useEvents } from "@packages/hooks";

const { pushToastAlert } = useEvents();

const props = defineProps<{
  link: string;
  isText?: boolean;
}>();

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(props.link);
    pushToastAlert({
      type: "success",
      message: "Copied to clipboard",
    });
  } catch (error) {
    console.error("Copy failed");
  }
};
</script>
