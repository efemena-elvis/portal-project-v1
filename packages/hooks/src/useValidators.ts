import { ref } from "vue";
import { VALID_TLDS, COMPOUND_TLDS } from "@packages/constants";

export default function useValidator() {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const trimInput = (inputText: string | number) => {
    return typeof inputText === "number"
      ? inputText.toString().trim()
      : inputText.trim();
  };

  const inputContainsNumber = (input: string) => {
    const numbers = "0123456789";
    return [...input].some((value) => [...numbers].includes(value));
  };

  const validateRequired = (
    input: string | number,
    message: string = "This input field is required",
  ) => {
    const trimmedInput = trimInput(input);
    return trimmedInput.length ? "" : message;
  };

  const validateEmail = (
    input: string | number,
    message: string = "Please provide a valid email address",
  ) => {
    const trimmedInput = trimInput(input);
    return emailRegex.test(trimmedInput) ? "" : message;
  };

  const validateNumberEntry = (
    input: string,
    message: string = "Should not contain any number or a special character",
  ) => {
    const trimmedInput = trimInput(input);

    return /^[0-9]+$/.test(trimmedInput) ? "" : message;
  };

  const validateOnlyNumbers = (
    input: string | number,
    message: string = "Input must contain only numbers (0-9)",
  ) => {
    const trimmedInput = trimInput(input);
    return /^\d+$/.test(trimmedInput) ? "" : message;
  };

  const validatePhone = (
    input: string | number,
    countryCode: string,
    message: string = "Please provide a valid phone number",
  ) => {
    const trimmedInput = trimInput(input);

    if (countryCode.length) {
      if (trimmedInput.startsWith(countryCode || `+${countryCode}`)) {
        // check for phone length
        const phoneLength = trimmedInput.length - countryCode.length;
        return phoneLength >= 9 && phoneLength <= 11 ? "" : message;
      } else {
        return trimmedInput.length >= 9 && trimmedInput.length <= 12
          ? ""
          : message;
      }
    } else return "No country code has been selected";
  };

  const validateTelephone = (
    input: string | number,
    message: string = "Please provide a valid phone number",
  ) => {
    const trimmedInput = trimInput(input);

    // Accepts formats like: 08012345678, +2348012345678, 2348012345678
    const phoneRegex = /^(\+?\d{1,3})?\d{9,12}$/;

    return phoneRegex.test(trimmedInput) ? "" : message;
  };

  const validatePasswordStrength = (input: string) => {
    const trimmedInput = trimInput(input);

    // Check for minimum length
    if (trimmedInput.length < 8) {
      return "Password must be at least 8 characters long";
    }

    // Check for an uppercase letter
    if (!/[A-Z]/.test(trimmedInput)) {
      return "Password must contain at least one uppercase letter";
    }

    // Check for a lowercase letter
    if (!/[a-z]/.test(trimmedInput)) {
      return "Password must contain at least one lowercase letter";
    }

    // Check for a special character (e.g., !, @, #, etc.)
    if (!/[-!$%^&*()_+|~=`{}\[\]:";'<>?#@,.\/]/.test(trimmedInput)) {
      return "Password must contain at least one special character";
    }

    // Check for a number
    if (!/\d/.test(trimmedInput)) {
      return "Password must contain at least one number.";
    }

    return "";
  };

  const validateFullName = (input: string) => {
    const trimmedInput = trimInput(input);
    const wordLimit = trimmedInput.split(" ");

    // CHECK FOR FIRST NUMBER ENTRY
    if (trimmedInput.length <= 2) return "Enter a minimum of 2 characters";
    else if (wordLimit.length === 1)
      return "Both first and last names are required";
    else if (wordLimit.length > 2) return "Enter only first and last names";
    else if (inputContainsNumber(trimmedInput))
      return "Fullname should not contain any number";
    else return "";
  };

  const validateSingleName = (
    input: string,
    message: string = "Input field should not contain any number",
  ) => {
    const trimmedInput = trimInput(input);

    if (trimmedInput.length <= 2) return "Enter a minimum of 2 characters";
    else if (inputContainsNumber(trimmedInput)) return message;
    else return "";
  };

  const validateAlphanumeric = (
    input: string,
    message: string = "Input should only contain alphabets and numbers",
  ) => {
    const trimmedInput = trimInput(input);

    // Regular expression to match only alphabets and numbers
    const alphanumericRegex = /^[A-Za-z0-9]+$/;

    return alphanumericRegex.test(trimmedInput) ? "" : message;
  };

  const validateDateRange = (
    input: string,
    range: number,
    message: string = "Input value should be outside of the range",
  ) => {
    const providedDate = new Date(input);
    const today = new Date();

    // Calculate period
    let period = today.getFullYear() - providedDate.getFullYear();
    const monthDiff = today.getMonth() - providedDate.getMonth();

    // Adjust period if the provided month hasn't occurred yet this year
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < providedDate.getDate())
    ) {
      period--;
    }

    // Return true if period is 18 or more, otherwise false
    return period >= range ? "" : message;
  };

  const validateURL = (
    input: string | number,
    message = "Please provide a valid URL",
  ) => {
    const trimmedInput =
      typeof input === "number" ? input.toString().trim() : input.trim();

    if (!trimmedInput) return message;

    // Check if the input starts with https:// or http://
    if (!/^https?:\/\//.test(trimmedInput)) {
      return message;
    }

    try {
      const url = new URL(trimmedInput);
      const hostname = url.hostname.toLowerCase();

      // Basic hostname validation
      if (hostname.length > 253 || hostname.length < 4) return message;

      // Split into parts
      const parts = hostname.split(".");

      // Must have at least 2 parts (domain.tld)
      if (parts.length < 2) return message;

      // Check for compound TLD first (e.g., co.uk, com.ng)
      let isValidTLD = false;
      let mainDomainIndex = -1;

      // Check for compound TLD (last 2 parts)
      if (parts.length >= 2) {
        const possibleCompoundTLD = `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
        if (COMPOUND_TLDS.has(possibleCompoundTLD)) {
          isValidTLD = true;
          mainDomainIndex = parts.length - 3; // The part before the compound TLD
        }
      }

      // If not compound TLD, check for regular TLD
      if (!isValidTLD) {
        const tld = parts[parts.length - 1];
        if (VALID_TLDS.has(tld)) {
          isValidTLD = true;
          mainDomainIndex = parts.length - 2; // The part before the TLD
        }
      }

      if (!isValidTLD) return message;

      // Ensure we have a main domain (not just TLD)
      if (mainDomainIndex < 0) return message;

      // Validate each part of the domain
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        // Each part must be 1-63 characters
        if (part.length === 0 || part.length > 63) return message;

        // Must start and end with alphanumeric
        if (!/^[a-zA-Z0-9]/.test(part) || !/[a-zA-Z0-9]$/.test(part))
          return message;

        // Can only contain alphanumeric and hyphens
        if (!/^[a-zA-Z0-9-]+$/.test(part)) return message;
      }

      // Validate the main domain part exists and is valid
      if (mainDomainIndex >= 0) {
        const mainDomain = parts[mainDomainIndex];
        if (mainDomain.length < 1) return message;
      }

      return "";
    } catch {
      return message;
    }
  };

  return {
    validateRequired,
    validateEmail,
    validateNumberEntry,
    validateOnlyNumbers,
    validatePhone,
    validateTelephone,
    validatePasswordStrength,
    validateFullName,
    validateSingleName,
    validateAlphanumeric,
    validateDateRange,
    validateURL,
  };
}
