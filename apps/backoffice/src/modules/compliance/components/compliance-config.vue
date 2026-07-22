<template>
  <div class="compliance-config" @click="closeMenu">
    <div class="w-[20%] -mt-8">
      <button
        class="btn btn-sm btn-primary"
        type="button"
        @click.stop="showCreateModal = true"
      >
        + Create new compliance
      </button>
    </div>

    <div class="compliance-config__section">
      <div class="compliance-config__section-header">
        <p class="compliance-config__section-title">Default compliance</p>
      </div>

      <div class="compliance-config__card compliance-config__card--default">
        <div>
          <p class="compliance-config__card-title">General compliance</p>
          <p class="compliance-config__card-text">
            General compliance covers all markets in different countries
          </p>
        </div>
        <button class="btn btn-secondary btn-sm w-[120px]" type="button">
          View
        </button>
      </div>
    </div>

    <div class="compliance-config__section">
      <div class="compliance-config__section-header">
        <p class="compliance-config__section-title">Custom compliance</p>
      </div>

      <div class="compliance-config__custom-list">
        <div
          v-for="item in customComplianceItems"
          :key="item.id"
          class="compliance-config__card compliance-config__card--custom first:border-b first:border-grey-200 first:pb-6"
        >
          <div>
            <p class="compliance-config__card-title">{{ item.title }}</p>
            <p class="compliance-config__card-text">{{ item.description }}</p>
          </div>

          <div class="compliance-config__actions">
            <span class="compliance-config__status" :class="item.statusClass">
              {{ item.statusLabel }}
            </span>

            <div class="compliance-config__menu-wrapper relative" @click.stop>
              <button
                class="compliance-config__menu-trigger"
                type="button"
                @click="toggleMenu(item.id)"
              >
                ···
              </button>
              <div
                v-if="openMenu === item.id"
                class="compliance-config__menu-dropdown"
              >
                <button
                  v-for="action in item.actions"
                  :key="action"
                  class="compliance-config__menu-item"
                  type="button"
                  @click="onMenuAction(action, item.id)"
                >
                  {{ action }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ComplianceSetupModal
    v-if="showCreateModal"
    @closeTriggered="showCreateModal = false"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import ComplianceSetupModal from "@/modules/compliance/modals/compliance-setup-modal.vue";

const openMenu = ref<number | null>(null);
const showCreateModal = ref(false);

interface CustomComplianceItem {
  id: number;
  title: string;
  description: string;
  statusLabel: string;
  statusClass: string;
  actions: string[];
}

const customComplianceItems: CustomComplianceItem[] = [
  {
    id: 1,
    title: "Simple merchant compliance",
    description: "For merchants in the food industry",
    statusLabel: "Unpublished",
    statusClass: "compliance-config__status--unpublished",
    actions: ["View", "Edit", "Publish", "Delete"],
  },
  {
    id: 2,
    title: "Aggregators",
    description: "For aggregators with over 20 merchants",
    statusLabel: "Published",
    statusClass: "compliance-config__status--published",
    actions: ["View", "Edit", "Un-publish", "Delete"],
  },
];

const toggleMenu = (id: number) => {
  openMenu.value = openMenu.value === id ? null : id;
};

const closeMenu = () => {
  openMenu.value = null;
};

const onMenuAction = (action: string, id: number) => {
  closeMenu();
};
</script>

<style lang="scss" scoped>
.compliance-config {
  @apply grid gap-6 w-full py-8;
}
.compliance-config__section {
  @apply grid gap-4 bg-white border border-grey-200 rounded-[24px] px-6 py-12;
}

.compliance-config__card {
  @apply flex  justify-between sm:items-center sm:justify-between;
}

.compliance-config__card--default {
  @apply border-grey-200;
}

.compliance-config__card--custom {
  @apply border-grey-200;
}

.compliance-config__card-title {
  @apply text-base font-semibold text-teal-900;
}

.compliance-config__card-text {
  @apply text-sm text-grey-600 mt-1;
}

.compliance-config__section-header {
  @apply relative bottom-4;
}

.compliance-config__section-title {
  @apply text-lg font-semibold text-teal-900;
}

.compliance-config__section-text {
  @apply text-sm text-grey-600;
}

.compliance-config__custom-list {
  @apply grid gap-8;
}

.compliance-config__actions {
  @apply flex items-center gap-3 justify-between sm:justify-end;
}

.compliance-config__status {
  @apply inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold;
}

.compliance-config__status--unpublished {
  @apply bg-[#FBEEF2] text-[#D92D5B];
}

.compliance-config__status--published {
  @apply bg-emerald-50 text-emerald-700;
}

.compliance-config__menu-trigger {
  @apply inline-flex text-grey-700 text-[20px] ml-3 font-semibold cursor-pointer;
}

.compliance-config__menu-dropdown {
  @apply absolute right-0 top-full mt-2 min-w-[130px] overflow-hidden rounded-2xl border border-grey-200 bg-white z-[100000];
}

.compliance-config__menu-item {
  @apply w-full text-left px-4 py-2 text-sm text-grey-900 transition duration-200 ease-in-out hover:bg-grey-100;
}
</style>
