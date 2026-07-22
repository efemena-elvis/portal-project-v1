<template>
  <div></div>
</template>

<script setup lang="ts">
import constants from "@/shared/utilities/constants";
import { useStorage } from "@packages/hooks";

const { removeStorage } = useStorage();
const {
  PORTAL_AUTH_TOKEN,
  PORTAL_AUTH_USER,
  PORTAL_AUTH_BUSINESS,
  PORTAL_AUTH_BUSINESS_TOKEN,
  PORTAL_REFRESH_TOKEN,
} = constants;

// HANDLE USER LOG OUT LOGIC
const logOutUser = () => {
  const storage_exception_key = "identifier_token";

  // PRIORITY REMOVALS ON LOGOUT
  removeStorage(PORTAL_AUTH_USER);
  removeStorage(PORTAL_AUTH_TOKEN);
  removeStorage(PORTAL_AUTH_BUSINESS);
  removeStorage(PORTAL_AUTH_BUSINESS_TOKEN);
  removeStorage(PORTAL_REFRESH_TOKEN);
  removeStorage("timestamp");

  for (let i = 0; i < localStorage.length; i++) {
    const local_key = localStorage.key(i) as string;

    if (local_key !== storage_exception_key) {
      removeStorage(local_key);
    }
  }

  // REDIRECT TO LOGIN PAGE
  location.href = "/login";
};

logOutUser();
</script>
