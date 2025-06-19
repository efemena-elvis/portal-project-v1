<template>
  <ModalDialog @closeModal="$emit('closeTriggered')">
    <!-- MODAL COVER HEADER -->
    <template #modal-cover-header>
      <div class="modal-cover-header">
        <div class="modal-cover-title">Change Password</div>
      </div>
    </template>

    <template #modal-cover-body>
      <div class="modal-cover-body mt-3">
        <TextFieldInput
          labelId="oldPassword"
          labelTitle="Old Password"
          :labelCompact="false"
          :inputType="IInputType.Password"
          :inputValue="payload.old_password"
          inputPlaceholder="Enter your existing password"
          inputBaseColor="bg-grey-10"
          :isRequired="true"
          @inputChanged="payload.old_password = $event"
          @inputValidated="payloadValidity.old_password = $event"
          :errorHandler="{
            validator: 'validateRequired',
          }"
        />

        <TextFieldInput
          labelId="newPassword"
          labelTitle="New Password"
          :labelCompact="false"
          :inputType="IInputType.Password"
          :inputValue="payload.new_password"
          inputPlaceholder="Enter your new password"
          inputBaseColor="bg-grey-10"
          :isRequired="true"
          @inputChanged="payload.new_password = $event"
          @inputValidated="payloadValidity.new_password = $event"
          :errorHandler="{
            validator: 'validatePasswordStrength',
          }"
        />

        <TextFieldInput
          labelId="retypeNewPassword"
          labelTitle="Retype New Password"
          :labelCompact="false"
          :inputType="IInputType.Password"
          :inputValue="payload.confirm_password"
          inputPlaceholder="Retype your new password"
          inputBaseColor="bg-grey-10"
          :isRequired="true"
          @inputChanged="payload.confirm_password = $event"
          @inputValidated="payloadValidity.confirm_password = $event"
          :errorHandler="{
            validator: 'validatePasswordStrength',
          }"
        />
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template #modal-cover-footer>
      <div class="modal-cover-footer -mt-2 mb-1">
        <button
          class="btn btn-primary w-full"
          ref="changePasswordBtnRef"
          :disabled="isActionReady"
          @click="saveChanges"
        >
          Change Password
        </button>
      </div>
    </template>
  </ModalDialog>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { IInputType } from "@packages/models";
import { useEvents } from "@packages/hooks";
import { TextFieldInput, ModalDialog } from "@packages/uikit";
import { useSettingsStore } from "@/modules/settings/store";

type IPayloadInputType = {
  old_password: string;
  new_password: string;
  confirm_password: string;
};

type IPayloadValidity = {
  old_password: boolean;
  new_password: boolean;
  confirm_password: boolean;
};

const emits = defineEmits(["closeTriggered"]);

const { updateUserPassword } = useSettingsStore();
const { processAPIRequest, pushToastAlert } = useEvents();

const changePasswordBtnRef = ref(null);

const payload = ref<IPayloadInputType>({
  old_password: "",
  new_password: "",
  confirm_password: "",
});

const payloadValidity = ref<IPayloadValidity>({
  old_password: false,
  new_password: false,
  confirm_password: false,
});

const isActionReady = computed(() => {
  return payload.value.old_password &&
    payload.value.new_password &&
    payload.value.confirm_password &&
    payloadValidity.value.old_password &&
    payloadValidity.value.new_password &&
    payloadValidity.value.confirm_password
    ? false
    : true;
});

const getPayload = computed(() => {
  const { old_password, new_password } = payload.value;
  return { old_password, new_password };
});

const saveChanges = async () => {
  if (payload.value.new_password !== payload.value.confirm_password) {
    pushToastAlert({ message: "Passwords do not match", type: "warning" });
    return;
  }

  const response = await processAPIRequest({
    action: updateUserPassword,
    payload: getPayload.value,
    btnRef: changePasswordBtnRef,
    btnText: "Change Password",
    alertHandler: {
      200: {
        message: "Password updated successfully",
        type: "success",
      },

      400: {
        message: "Password update failed",
        type: "error",
      },
    },
  });

  if (response.code === 200) {
    setTimeout(() => emits("closeTriggered"), 500);
  }
};
</script>
