import axios from "axios";
import { useStorage } from "@packages/hooks";
import constants from "@/shared/utilities/constants";

const { getStorage } = useStorage();
const { PORTAL_API_BASE_URL, PORTAL_API_VERSION, PORTAL_AUTH_TOKEN } =
  constants;

interface ExportResult {
  success: boolean;
  message?: string;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function exportTransactionsCSV(
  filters: Record<string, string>,
  filename = "Transactions_Data.csv",
): Promise<ExportResult> {
  const baseURL = `${PORTAL_API_BASE_URL}/${PORTAL_API_VERSION}`;
  const authToken = getStorage({ storage_name: PORTAL_AUTH_TOKEN }) as
    | string
    | null;

  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });

  try {
    const response = await axios.get("admin/reports/transactions", {
      baseURL,
      params,
      headers: {
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "text/csv" });
    downloadBlob(blob, filename);
    return { success: true };
  } catch (error: any) {
    if (error.response?.data instanceof Blob) {
      const text = await error.response.data.text();
      try {
        const json = JSON.parse(text);
        return {
          success: false,
          message: json.message || "Export failed",
        };
      } catch {
        return { success: false, message: "Export failed" };
      }
    }

    return {
      success: false,
      message:
        error.response?.data?.message || error.message || "Export failed",
    };
  }
}
