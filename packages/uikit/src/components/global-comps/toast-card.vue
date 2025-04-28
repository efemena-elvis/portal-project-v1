<template>
  <div class="toast-card" :class="`${type}-toast`">
    <div class="toast-card-content">
      <!-- LEFT SECTION -->
      <div class="toast-card-content--left">
        <div class="icon" :class="getAlertIcon"></div>
      </div>

      <!-- RIGHT SECTION -->
      <div class="toast-card-content--right">
        <div>
          <div class="message-text">{{ message }}</div>
          <div class="description-text" v-if="description">
            {{ description }}
          </div>
        </div>

        <div class="icon icon-times" @click="closeToastAlert"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, onMounted } from "vue";
import { Emitter } from "mitt";

// Define the type of the event bus
type Events = {
  closeToastAlert: void;
};

interface IAlertType {
  message: string;
  description: string;
  type: string;
}

const props = withDefaults(defineProps<IAlertType>(), {
  message: "Successful",
  description: "Succesful entry",
  type: "success", // success | warning | error
});

const eventBus = inject<Emitter<Events>>("eventBus");

const getAlertIcon = computed(() => {
  if (props.type === "success") return "icon-tick-circle";
  if (props.type === "warning") return "icon-info-circle";
  return "icon-danger";
});

const closeToastAlert = () => {
  eventBus?.emit("closeToastAlert");
};

onMounted(() => {
  setTimeout(() => closeToastAlert(), 4000);
});
</script>

<style lang="scss" scoped>
.toast-card {
  @apply fixed overflow-hidden rounded-md top-9 right-3 min-w-[auto] max-w-[45%] md:max-w-[60%] sm:max-w-[80%] xs:max-w-[94%] w-auto animate-drift-right;
  z-index: 5999;
  filter: drop-shadow(2px 3px 3px rgba(0, 54, 27, 0.1));

  &-content {
    @apply relative flex justify-start items-center;

    &--left {
      @apply w-9 h-full py-[14.5px] px-3 rounded-tl-md rounded-bl-md flex justify-center items-center;

      .icon {
        @apply text-neutral-10 text-xl;
      }
    }

    &--right {
      @apply h-full py-[14px] px-4 xs:px-3 leading-[18px] flex justify-between items-center gap-x-6 sm:gap-x-4;

      .message-text {
        @apply font-medium text-[13.5px] leading-6;
      }

      .description-text {
        @apply text-[12.25px] leading-5;
      }

      .icon {
        @apply text-lg cursor-pointer;
      }
    }
  }
}

.success-toast {
  .toast-card-content {
    @apply bg-[#19AF66];

    .toast-card-content--right {
      @apply bg-[#EEF9F4] text-[#0e5f38];
    }
  }
}

.warning-toast {
  .toast-card-content {
    @apply bg-[#BC661A];

    .toast-card-content--right {
      @apply bg-[#f7e9dd] text-[#a55815];
    }
  }
}

.error-toast {
  .toast-card-content {
    @apply bg-[#f34545];

    .toast-card-content--right {
      @apply bg-[#ffffff] text-[#ae2222];
    }
  }
}
</style>
