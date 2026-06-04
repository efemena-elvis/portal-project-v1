import { useStorage } from "@packages/hooks";

const { getStorage, setStorage } = useStorage();

export default function useString() {
  // ======================================================
  // AUTH TIMEOUT CHECK
  // ======================================================
  const checkAuthTimeout = (minutes: number) => {
    const timeout = Number(minutes) * 60000;
    const entryTime = Number(getStorage({ storage_name: "timestamp" }) ?? 0);
    const currentTime = Number(+new Date());

    if (currentTime - entryTime > timeout) {
      return true;
    } else {
      setStorage({ storage_name: "timestamp", storage_value: +new Date() });
      return false;
    }
  };

  // ======================================================
  // HASHES A URL WITH TIMESTAMP
  // ======================================================
  const urlHash = (url: string): string => {
    return url.includes("?")
      ? `${url}&timestamp=${new Date().getTime()}`
      : `${url}?timestamp=${new Date().getTime()}`;
  };

  // ======================================================
  // GENERATE A RANDOM STRING
  // ======================================================
  const getRandomString = (length: number) => {
    let randomstring = "";
    const chars =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";

    for (let i = 0; i < length; i++) {
      const rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
  };

  const stripHtml = (html: any) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  // ======================================================
  // ENCODES A STRING WITH A STRING ARGUMENT
  // ======================================================
  const encodeString = (string: string): string => {
    return btoa(`${getRandomString(5)}+${string}+${getRandomString(5)}`);
  };

  // ======================================================
  // DECODES A STRING WITH A STRING ARGUMENT
  // ======================================================
  const decodeString = (encoded_string: string): string => {
    return atob(encoded_string).split("+")[1];
  };

  // ======================================================
  // GET STRING INITIALS
  // ======================================================
  const getStringInitials = (text: string) => {
    // @ts-ignore
    const string_list = text?.replace(/\s+/g, " ")?.split(" ");

    return string_list?.length === 1
      ? string_list[0]?.slice(0, 1)?.toUpperCase()
      : `${string_list[0]?.slice(0, 1)?.toUpperCase()}${string_list[1]
          ?.slice(0, 1)
          ?.toUpperCase()}`;
  };

  // ======================================================
  // CAPITALIZES THE FIRST LETTER OF A STRING
  // ======================================================
  const capitalizeFirstLetter = (string: string) => {
    const words = string?.split(" ");

    if (words.length > 0) {
      words[0] = words[0][0]?.toUpperCase() + words[0]?.substring(1);
      return words?.join(" ");
    }

    return string;
  };

  // ======================================================
  // FORMAT PHONE NUMBER
  // ======================================================
  const formatPhoneNumber = (
    phoneNumber: string,
    countryCode: string,
  ): string => {
    // Ensure phoneNumber is a string
    phoneNumber = String(phoneNumber);

    // Check if the phone number starts with +
    if (phoneNumber.startsWith("+")) {
      // Remove the + sign
      phoneNumber = phoneNumber.slice(1);
    }

    // Check if the phone number starts with the country code
    if (phoneNumber.startsWith(countryCode)) {
      return phoneNumber.slice(countryCode.length);
    } else {
      // Catenate the country code with the phone number
      return `${countryCode}-${phoneNumber}`;
    }
  };

  // ======================================================
  // FORMAT NUMBER
  // ======================================================
  const formatNumber = (value: number): string => {
    if (value >= 1_000_000) {
      // Format for 1 million and above
      const millions = value / 1_000_000;
      return millions.toFixed(1) + "M";
    } else if (value >= 1_000) {
      // Format for thousands with exactly 2 decimal places
      return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      // Format for less than 1000 with 2 decimal places
      return value.toFixed(2);
    }
  };

  // ======================================================
  // CREATE AND CLICK ANCHOR TAG
  // ======================================================
  const createAndClickAnchor = (
    href: string,
    target = "_self",
    noHistory = false,
  ): void => {
    // This is the special case. It uses window.location.replace() which
    // only works on the current window.
    if (noHistory && target === "_self") {
      window.location.replace(href);
      return;
    }

    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.target = target;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  // ======================================================
  // GET BOLD TABLE TEXT
  // ======================================================
  const getBoldTableText = (text: string, color?: string) => {
    return `<span class='font-semibold ${color || "text-grey-800"}'>${text}</span>`;
  };

  // ======================================================
  // GET TABLE STATUS STATE
  // ======================================================
  const getStatus = (status: string, suffixText: string) => {
    const statusData: Record<string, { className?: string; style?: string }> = {
      success: {
        style: "background:#F1FAF3;color:#3AB75D;",
      },
      successful: {
        style: "background:#F1FAF3;color:#3AB75D;",
      },
      review: {
        style: "background:#F1FAF3;color:#3AB75D;",
      },
      pending: {
        style: "background:#FEF8EC;color:#EEA41A;",
      },
      failed: {
        style: "background:#FBEEF2;color:#CD3C64;",
      },
      rejected: {
        style: "background:#FBEEF2;color:#CD3C64;",
      },
      verified: {
        style: "background:#F1FAF3;color:#3AB75D;",
      },
      admin: {
        style: "background:#F5F1FF;color:#9785B7;",
      },
      operations: {
        style: "background:#EEF9FD;color:#24ACEE;",
      },
      "no-status": {
        style: "background:#F1F7F6;color:#818988;",
      },
    };

    const currentStatus = statusData[status] || statusData["no-status"];
    return `<span
      class="px-4 py-2 w-auto rounded-full text-sm font-semibold ${currentStatus.className || ""}"
      style="${currentStatus.style || ""}"
    >
      ${capitalizeFirstLetter(suffixText)}
    </span>
  `;
  };
  // MASK NUMBER
  const maskNumbers = (numbers: string): string => {
    const maskedSection = "*".repeat(numbers.length);
    return maskedSection;
  };

  // MASK CARD NUMBER
  const maskCardNumber = (cardNumber: string): string => {
    const visibleDigits = cardNumber.slice(-4);
    const maskedSection = "*".repeat(cardNumber.length - 4);
    return maskedSection + visibleDigits;
  };

  // ======================================================
  // GET TRANSACTION FLOW ICON
  // ======================================================
  const transactionFlowIcon = (status: string): string => {
    const statusData: Record<string, string> = {
      send: "text-red-600 icon-send",
      receive: "text-green-600 icon-receive",
    };

    return `<div class='relative left-2.5 text-[16.5px] ${statusData[status]}'></div>`;
  };

  // ======================================================
  // GET NOT AVAILABLE TEXT
  // ======================================================
  const notAvailable = (text: string): string => {
    return `<div class='text-grey-600/40'>${text}</div>`;
  };

  // ======================================================
  // CREATE PREVIEW LINK
  // ======================================================
  const createPreviewLink = (link: string, linkTitle?: string): string => {
    return `<a class='text-green-600 underline cursor-pointer' href='${link}' target='_blank' rel='noopener noreferrer'>${
      linkTitle ?? "Preview"
    }</a>`;
  };

  return {
    checkAuthTimeout,
    urlHash,
    getRandomString,
    encodeString,
    decodeString,
    getStringInitials,
    capitalizeFirstLetter,
    formatPhoneNumber,
    formatNumber,
    createAndClickAnchor,
    getBoldTableText,
    getStatus,
    transactionFlowIcon,
    notAvailable,
    createPreviewLink,
    maskNumbers,
    maskCardNumber,
    stripHtml,
  };
}
