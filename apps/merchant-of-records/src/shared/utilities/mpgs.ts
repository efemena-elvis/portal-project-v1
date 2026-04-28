export function perform3DSMethod(acsUrl: string, methodPostData: string) {
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.name = "threeDSMethodFrame";
  document.body.appendChild(iframe);

  // Create a form targeting the iframe
  const form = document.createElement("form");
  form.method = "POST";
  form.action = acsUrl;
  form.target = iframe.name;

  const input = document.createElement("input");
  input.type = "hidden";
  input.name = "threeDSMethodData";
  input.value = methodPostData;
  form.appendChild(input);

  document.body.appendChild(form);

  // Submit silently
  form.submit();

  // Cleanup after some time
  setTimeout(() => {
    form.remove();
    iframe.remove();
  }, 5_000);
}

export function starthallenge(acsUrl: string, creq: string) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = acsUrl;
  // form.target = "_blank"; //  opens in a new tab (or popup if blocked)

  // Create hidden input for creq
  const input = document.createElement("input");
  input.type = "hidden";
  input.name = "creq";
  input.value = creq;
  form.appendChild(input);

  // Add to DOM
  document.body.appendChild(form);

  // Submit it
  form.submit();

  // Clean up
  form.remove();
}

export const generateBrowserChecks = () => {
  return {
    java_enabled: navigator.javaEnabled() ?? false,
    language: navigator.language,
    screen_height: window.screen.height,
    screen_width: window.screen.width,
    color_depth: window.screen.colorDepth,
    time_zone: new Date().getTimezoneOffset(),
    browser_user_agent: navigator.userAgent,
  };
};
