<template>
  <div class="content-card" @click="goToSection">
    <div class="content-card-text">{{ title }}</div>

    <div class="content-card-option">
      <div class="text">{{ completed ? "Manage" : "View" }}</div>

      <div class="check-wrapper">
        <div class="icon icon-arrow-right"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";

interface IContentCardType {
  title: string;
  sectionRoute: string;
  completed?: boolean;
}

const props = withDefaults(defineProps<IContentCardType>(), {
  title: "Document section",
  sectionRoute: "",
  completed: false,
});

const router = useRouter();

const goToSection = () => router.push({ name: props.sectionRoute });
</script>

<style lang="scss" scoped>
.content-card {
  @apply rounded-lg border border-grey-200 p-4 w-full flex justify-between items-center gap-x-4 cursor-pointer transition duration-300 ease-in-out hover:bg-grey-10;

  &-text {
    @apply text-grey-700/85 font-semibold text-sm;
  }

  &-option {
    @apply flex justify-end items-center gap-x-3;

    .text {
      @apply text-sm font-medium text-grey-500/80;
    }

    .check-wrapper {
      @apply rounded-full size-[22px] min-h-[22px] min-w-[22px] bg-grey-400 flex justify-center items-center;

      .icon {
        @apply text-neutral-10 text-[15px];
      }
    }
  }
}

.incomplete-content {
  .content-card-option {
    .text {
      @apply text-green-500 font-medium;
    }

    .check-wrapper {
      @apply bg-green-500;
    }
  }
}
</style>
