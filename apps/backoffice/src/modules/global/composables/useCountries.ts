import { ref } from "vue";
import { useGlobalStore } from "@/modules/global/store";
import { useEvents } from "@packages/hooks";

const FALLBACK_OPTIONS = [{ value: "NG", name: "Nigeria" }];

export function useCountries() {
  const { getBusinessCountries } = useGlobalStore();
  const { processAPIRequest } = useEvents();

  const countryOptions = ref<{ value: string; name: string }[]>([]);

  const fetchCountries = async () => {
    const response = await processAPIRequest({
      action: getBusinessCountries,
      showAlert: false,
    });

    if (response?.code === 200 && Array.isArray(response.data)) {
      const mapped: { value: string; name: string }[] = response.data.map(
        (country: any) => ({
          value: country.code,
          name: country.name,
        }),
      );

      if (
        !mapped.some(
          (option: { value: string; name: string }) => option.value === "NG",
        )
      ) {
        mapped.push({ value: "NG", name: "Nigeria" });
      }

      countryOptions.value = mapped;
    } else {
      console.error("[useCountries] Failed to load countries", response);
      countryOptions.value = FALLBACK_OPTIONS;
    }
  };

  return {
    countryOptions,
    fetchCountries,
  };
}
