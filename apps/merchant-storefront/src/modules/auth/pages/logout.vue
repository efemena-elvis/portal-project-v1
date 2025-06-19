<template>
  <div></div>
</template>

<script setup lang="ts">
import constants from "@/shared/utilities/constants";
import { useStorage } from "@packages/hooks";

const { removeStorage } = useStorage();
const {
  MOR_AUTH_TOKEN,
  MOR_AUTH_USER,
  MOR_AUTH_BUSINESS,
  MOR_AUTH_BUSINESS_TOKEN,
} = constants;

// HANDLE USER LOG OUT LOGIC
const logOutUser = () => {
  let storage_exception_key = "identifier_token";

  // PRIORITY REMOVALS ON LOGOUT
  removeStorage(MOR_AUTH_USER);
  removeStorage(MOR_AUTH_TOKEN);
  removeStorage(MOR_AUTH_BUSINESS);
  removeStorage(MOR_AUTH_BUSINESS_TOKEN);
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
