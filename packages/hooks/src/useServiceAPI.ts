// ======================================================
// ALL APPLICATION METHODS RELATED TO API HANDLING
// ======================================================
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { useStorage, useString } from "@packages/hooks";

const { getStorage } = useStorage();
const { urlHash } = useString();

interface IApiSetup {
  API_BASE_URL: string;
  API_VERSION?: string;
  TOKEN_KEY: string;
  HEADERS?: Record<string, string>;
}

interface ApiResponse<T = any> {
  data?: T;
  error?: ApiError;
  code?: number;
  status?: number;
  message?: string;
  pagination?: any;
}

interface ApiError {
  message: string;
  code?: string;
  details?: any;
  status?: number;
}

interface RequestOptions {
  params?: Record<string, any>;
  headers?: Record<string, string>;
  hasAttachment?: boolean;
  timeout?: number;
  signal?: AbortSignal;
}

// Extend AxiosRequestConfig to include the _retry property
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// ======================================================
// SERVICE API CLASS
// ======================================================
class APIService {
  private readonly API_BASE_URL: string;
  private readonly API_VERSION: string;
  private readonly TOKEN_KEY: string;
  private readonly DEFAULT_HEADERS: Record<string, string>;
  private readonly DEFAULT_TIMEOUT: number = 15000; // 15 seconds

  constructor(config: IApiSetup) {
    this.API_BASE_URL = config.API_BASE_URL;
    this.API_VERSION = config.API_VERSION || "";
    this.TOKEN_KEY = config.TOKEN_KEY;
    this.DEFAULT_HEADERS = {
      // "X-Requested-With": "XMLHttpRequest",
      ...(config.HEADERS || {}),
    };

    this.initializeAxios();
    this.setupInterceptors();
  }

  // ======================================================
  // INITIALIZATION METHOD
  // ======================================================
  private initializeAxios(): void {
    axios.defaults.baseURL = this.API_VERSION
      ? `${this.API_BASE_URL}/${this.API_VERSION}`
      : this.API_BASE_URL;

    // console.log("API Base URL:", axios.defaults.baseURL);

    axios.defaults.timeout = this.DEFAULT_TIMEOUT;
  }

  // ======================================================
  // SETUP AXIOS INTERCEPTOR
  // ======================================================
  private setupInterceptors(): void {
    // Step 1: Request interceptor
    axios.interceptors.request.use((config: any) => {
      // Add security headers to every request
      config.headers = {
        ...config.headers,
      };
      return config;
    });

    // Step 2: Response interceptor
    axios.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalConfig = error.config as CustomAxiosRequestConfig;

        // Handle 401
        if (error.response?.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;
          location.replace("/logout");
          return Promise.reject(error);
        }

        return Promise.reject(error);
      }
    );
  }

  // ======================================================
  // CORE API METHODS ====> (FETCH API REQUEST)
  // ======================================================
  public async fetch<T = any>(
    url: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await axios.get<T>(urlHash(url), {
        params: options.params,
        headers: this.prepareHeaders(options),
        signal: options.signal,
      });

      return { ...(response?.data as ApiResponse) };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // ======================================================
  // CORE API METHODS ====> (PUSH API REQUEST)
  // ======================================================
  public async push<T = any>(
    url: string,
    payload?: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await axios.post<T>(url, payload, {
        params: options.params,
        headers: this.prepareHeaders(options),
        signal: options.signal,
      });

      return { ...(response?.data as ApiResponse) };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // ======================================================
  // CORE API METHODS ====> (UPDATE API REQUEST)
  // ======================================================
  public async update<T = any>(
    url: string,
    payload?: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await axios.put<T>(url, payload, {
        params: options.params,
        headers: this.prepareHeaders(options),
        signal: options.signal,
      });

      return { ...(response?.data as ApiResponse) };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // ======================================================
  // CORE API METHODS ====> (PATCH API REQUEST)
  // ======================================================
  public async patch<T = any>(
    url: string,
    payload?: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await axios.patch<T>(url, payload, {
        params: options.params,
        headers: this.prepareHeaders(options),
        signal: options.signal,
      });

      return { ...(response?.data as ApiResponse) };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // ======================================================
  // CORE API METHODS ====> (REMOVE API REQUEST)
  // ======================================================
  public async delete<T = any>(
    url: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await axios.delete<T>(url, {
        params: options.params,
        headers: this.prepareHeaders(options),
        signal: options.signal,
      });

      return { ...(response?.data as ApiResponse) };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // ======================================================
  // HELPER METHODS
  // ======================================================
  private prepareHeaders(options: RequestOptions): Record<string, string> {
    const authToken = getStorage({ storage_name: this.TOKEN_KEY }) as
      | string
      | null;

    return {
      ...this.DEFAULT_HEADERS,
      "Content-Type": options.hasAttachment
        ? "multipart/form-data"
        : "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      // "X-Content-Type-Options": "nosniff", // Additional security header
      // "X-Frame-Options": "DENY", // Clickjacking protection
      ...(options.headers || {}),
    };
  }

  // ======================================================
  // ERROR HANDLING
  // ======================================================
  private handleError(error: unknown): ApiResponse {
    if (axios.isAxiosError(error)) {
      const apiError: ApiError = {
        message:
          error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred",
        code: error.code || "API_ERROR",
        details: error.response?.data?.errors,
        status: error.response?.status,
      };

      // Enhanced error logging
      if (process.env.NODE_ENV === "development") {
        console.error("API Error:", {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          error: apiError,
        });
      }

      return { error: apiError, status: error.response?.status };
    }

    // Handle non-Axios errors
    const networkError: ApiError = {
      message: "A network error occurred",
      code: "NETWORK_ERROR",
    };

    if (process.env.NODE_ENV === "development") {
      console.error("Network Error:", error);
    }

    return { error: networkError };
  }
}

export default APIService;
