<template>
  <PageContentWrapper
    description="Manage roles and permissions"
    :showTitle="true"
    pageDescription="Manage Teams"
  >
    <template v-slot:pageContent>
      <section class="flex flex-col gap-7">
        <div class="inline-flex bg-teal-100 w-full p-2 rounded-md">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            :class="tabButtonClass(tab.value)"
            @click="navigateToTab(tab.value)"
            type="button"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="roles-section">
          <h3 class="section-title">Default roles</h3>
          <div class="roles-grid">
            <div v-for="role in defaultRoles" :key="role.id" class="role-card">
              <div
                class="role-card-header"
                :class="{
                  'role-card-header--expanded': expandedRoles.has(role.id),
                }"
                @click="toggleRole(role.id)"
              >
                <div class="role-card-content">
                  <h4 class="role-name">{{ role.name }}</h4>
                  <p class="role-description">{{ role.description }}</p>
                </div>
                <div
                  class="role-arrow"
                  :class="{ 'role-arrow--open': expandedRoles.has(role.id) }"
                >
                  <i class="icon icon-caret-down"></i>
                </div>
              </div>
              <div v-if="expandedRoles.has(role.id)" class="role-permissions">
                <div
                  v-for="(perms, category) in role.permissions"
                  :key="category"
                  class="permission-category"
                >
                  <h5 class="category-title">{{ category }}</h5>
                  <div
                    v-for="perm in perms"
                    :key="perm"
                    class="permission-item"
                    @click="
                      togglePerm(
                        String(role.id),
                        String(category),
                        String(perm),
                      )
                    "
                  >
                    <div
                      class="custom-checkbox"
                      :class="{
                        'custom-checkbox--checked': checkedPerms.has(
                          permKey(
                            String(role.id),
                            String(category),
                            String(perm),
                          ),
                        ),
                      }"
                    >
                      <i
                        v-if="
                          checkedPerms.has(
                            permKey(
                              String(role.id),
                              String(category),
                              String(perm),
                            ),
                          )
                        "
                        class="icon icon-checkmark custom-checkmark"
                      ></i>
                    </div>
                    <span>{{ perm }}</span>
                  </div>
                </div>
              </div>
              <div v-if="expandedRoles.has(role.id)" class="save-permissions">
                <button
                  type="button"
                  class="btn btn-sm btn-primary"
                  @click="savePermissions(role.id)"
                >
                  Save permissions
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- <div class="create-role-section">
          <button
            type="button"
            class="btn btn-sm btn-primary"
            @click="handleCreateRole"
          >
            + Create custom role
          </button>
        </div> -->

        <!-- <div v-if="customRoles.length" class="roles-section">
          <h3 class="section-title">Custom role(s)</h3>
          <div class="custom-roles-list">
            <div
              v-for="role in customRoles"
              :key="role.id"
              class="custom-role-item"
            >
              <div class="role-info">
                <h4 class="role-name">{{ role.name }}</h4>
                <p class="role-description">{{ role.description }}</p>
              </div>
              <div class="role-actions">
                <button
                  type="button"
                  class="btn btn-sm btn-tertiary w-[]"
                  @click="handleViewRole(role)"
                >
                  View
                </button>
                <button
                  type="button"
                  class="p-3 rounded-md border border-red-500 text-red-500 hover:bg-red-50"
                  @click="handleDeleteRole(role)"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div> -->
      </section>
    </template>
  </PageContentWrapper>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useTeamStore } from "../store";
import { PageContentWrapper } from "@packages/uikit";

const router = useRouter();
const route = useRoute();

const tabs = [
  { label: "Team Members", value: "members" },
  { label: "Roles", value: "roles" },
  { label: "Activities", value: "activities" },
] as const;

const activeTab = computed(() => {
  const path = route.path.replace(/\/$/, "");
  if (path.endsWith("/roles")) return "roles";
  if (path.endsWith("/activities")) return "activities";
  return "members";
});

const tabButtonClass = (tabValue: string) =>
  activeTab.value === tabValue ? "tab-btn tab-btn--active" : "tab-btn";

const navigateToTab = (tab: string) => {
  if (tab === "members") {
    router.push("/manage-teams");
  } else {
    router.push(`/manage-teams/${tab}`);
  }
};

const expandedRoles = ref<Set<string>>(new Set());

const toggleRole = (id: string) => {
  const next = new Set(expandedRoles.value);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  expandedRoles.value = next;
};

const { defaultRoles, customRoles } = useTeamStore();

const checkedPerms = ref<Set<string>>(new Set());

const permKey = (roleId: string, category: string, perm: string) =>
  `${roleId}:${category}:${perm}`;

const togglePerm = (roleId: string, category: string, perm: string) => {
  const key = permKey(roleId, category, perm);
  const next = new Set(checkedPerms.value);
  if (next.has(key)) {
    next.delete(key);
  } else {
    next.add(key);
  }
  checkedPerms.value = next;
};

const savePermissions = (roleId: string) => {
  const perms: string[] = [];
  checkedPerms.value.forEach((key) => {
    if (key.startsWith(`${roleId}:`)) {
      perms.push(key);
    }
  });
};
</script>

<style scoped lang="scss">
.tab-btn {
  @apply text-sm font-medium text-grey-700 px-4 py-2 rounded-md transition duration-200 ease-in-out border-0 cursor-pointer bg-transparent;
}

.tab-btn--active {
  @apply bg-white text-teal-800;
}

.roles-section {
  @apply flex flex-col gap-4 p-6 bg-white border border-grey-200 rounded-lg;

  .section-title {
    @apply text-lg font-semibold text-teal-800;
  }
}

.roles-grid {
  @apply grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3;
}

.role-card {
  @apply border-b border-b-grey-200 last:border-none;

  .role-card-header {
    @apply flex items-center justify-between gap-4 py-6 cursor-pointer select-none;
  }

  .role-card-header--expanded {
    @apply pb-2;
  }

  .role-card-content {
    @apply flex-1;
  }

  .role-name {
    @apply font-semibold text-grey-900;
  }

  .role-description {
    @apply text-sm text-grey-600 mt-2;
  }

  .role-arrow {
    @apply text-teal-700 flex-shrink-0 transition-transform duration-200;
  }

  .role-arrow--open {
    transform: rotate(180deg);
  }

  .role-permissions {
    @apply pb-6 pt-2 flex flex-wrap gap-4 items-start;
  }
}

.permission-category {
  @apply flex flex-col gap-3 border border-grey-200 rounded-lg p-5;
  flex: 1 1 280px;

  .category-title {
    @apply text-sm font-semibold text-grey-900 pb-1;
  }
}

.permission-item {
  @apply flex items-center gap-3 text-sm text-grey-700 cursor-pointer last:pb-1;

  .custom-checkbox {
    @apply w-5 h-5 flex items-center justify-center rounded bg-grey-200 flex-shrink-0 transition-colors duration-150;
  }

  .custom-checkbox--checked {
    @apply bg-green-600;
  }

  .custom-checkmark {
    @apply text-white leading-none;
    font-size: 12px;
  }
}

.save-permissions {
  @apply flex justify-end py-4;
}

.create-role-section {
  @apply flex justify-start py-4;
}

.custom-roles-list {
  @apply flex flex-col gap-4;
}

.custom-role-item {
  @apply flex items-center justify-between gap-4 py-6 border-b border-b-grey-200 last:border-none;

  .role-info {
    @apply flex-1;
  }

  .role-name {
    @apply font-semibold text-grey-900;
  }

  .role-description {
    @apply text-sm text-grey-600 mt-2;
  }

  .role-actions {
    @apply flex items-center gap-3;
  }
}
</style>
