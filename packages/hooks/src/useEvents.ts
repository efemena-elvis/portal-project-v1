import { Ref, inject } from "vue";
import { Emitter } from "mitt";

// Define the type of the event bus
type Events = {
  triggerToastAlert: IAlertType;
};

interface IAlertType {
  type: string;
  message: string;
  description?: string;
}

interface IAlertHandler {
  200?: IAlertType;
  201?: IAlertType;
  400?: IAlertType;
  404?: IAlertType;
  500?: IAlertType;
  502?: IAlertType;

  [key: number]: IAlertType | undefined;
}

interface IHandleDataRequestParams {
  action: (payload: any) => Promise<any>;
  payload?: Record<string, any>;
  btnRef?: Ref<HTMLButtonElement | null>;
  btnText?: string;
  showAlert?: boolean;
  alertHandler?: IAlertHandler;
}

export default function useEvents() {
  const eventBus = inject<Emitter<Events>>("eventBus");

  const clickHandler = (
    refElement: Ref<HTMLButtonElement | null>,
    text: string = "Button Text",
    processing: boolean = true
  ) => {
    if (processing) {
      refElement.value!.disabled = true;
      refElement.value!.innerHTML = `<div class="icon-spinner-ios text-3xl text-neutral-10 animate-spin"></div>`;
    } else {
      refElement.value!.innerHTML = `${text}`;
      refElement.value!.disabled = false;
    }
  };

  const pushToastAlert = (alertPayload: IAlertType | undefined) => {
    alertPayload && eventBus?.emit("triggerToastAlert", alertPayload);
  };

  const isValidAlertHandler = (
    alertHandler: IAlertHandler,
    alertCode: number
  ): boolean => {
    return !!alertHandler[alertCode as keyof IAlertHandler];
  };

  const processAPIRequest = async ({
    action,
    payload = {},
    btnRef,
    btnText = "Button Text",
    showAlert = true,
    alertHandler = {},
  }: IHandleDataRequestParams) => {
    // Set loading state on the button
    btnRef && clickHandler(btnRef);

    const hasAlertHandler = Object.values(alertHandler).length > 0;

    try {
      const response = await action(payload);

      // Reset button state after action
      btnRef && clickHandler(btnRef, btnText, false);

      // Handle different response codes
      switch (response?.code || response?.status) {
        case 200:
        case 201:
          if (
            hasAlertHandler &&
            isValidAlertHandler(alertHandler, response.code)
          ) {
            showAlert && pushToastAlert(alertHandler[response.code]);
          }
          break;
        case 400:
          if (hasAlertHandler && isValidAlertHandler(alertHandler, 400)) {
            const alertInfo = alertHandler[400];

            if (alertInfo?.description) {
              showAlert && pushToastAlert(alertHandler[400]);
            } else {
              showAlert &&
                pushToastAlert({
                  message: alertInfo?.message as string,
                  description: response.message,
                  type: "error",
                });
            }
          }
          break;
        case 404:
          if (hasAlertHandler && isValidAlertHandler(alertHandler, 404)) {
            showAlert && pushToastAlert(alertHandler[404]);
          }
          break;
        default:
          if (response.code >= 500) {
            // Handle server errors (500 or greater)
            if (
              hasAlertHandler &&
              isValidAlertHandler(alertHandler, response.code)
            ) {
              showAlert && pushToastAlert(alertHandler[response.code]);
            }
            // Handle server errors if not specified
            else {
              if (hasAlertHandler) {
                showAlert &&
                  pushToastAlert({
                    message: "Server/Network error",
                    description:
                      "We are currently unable to connect to the server",
                    type: "error",
                  });
              }
            }
          }
          break;
      }

      return response !== undefined ? response : false;
    } catch (error) {
      // Reset button state in case of error
      btnRef && clickHandler(btnRef, btnText, false);

      // Handle any network or unexpected errors
      console.error("A network error occurred:", error);

      if (hasAlertHandler) {
        showAlert &&
          pushToastAlert({
            message: "Server/Network error",
            description: "We are currently unable to connect to the server",
            type: "error",
          });
      }

      return false;
    }
  };

  return {
    clickHandler,
    processAPIRequest,
    pushToastAlert,
  };
}
