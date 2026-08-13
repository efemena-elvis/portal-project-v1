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
  TOKEN_KEY?: string;
  HEADERS?: Record<string, string>;
}

interface ApiError {
  message: string;
  code?: string;
  details?: any;
  status?: number;
}

interface ApiResponse<T = any> {
  data?: T;
  error?: ApiError;
  code?: number;
  status?: number;
  message?: string;
  pagination?: any;
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

// Global refresh-token callback registered at app init
let refreshTokenFn: (() => Promise<string | null>) | null = null;

export function setRefreshTokenFn(fn: () => Promise<string | null>) {
  refreshTokenFn = fn;
}

// Endpoints where a 401 means invalid credentials/OTP rather than an expired
// session, so the refresh-token flow must NOT run (and no /logout redirect).
const PUBLIC_AUTH_URLS = [
  "auth/login",
  "auth/signup",
  "auth/forgot-password",
  "auth/reset-password",
  "auth/send-verify-email",
  "auth/verify-email",
  "auth/verify-login",
  "mfa/setup/authenticator",
  "mfa/verify",
];

const isPublicAuthUrl = (url?: string): boolean => {
  if (!url) return false;
  return PUBLIC_AUTH_URLS.some((endpoint) => url.includes(endpoint));
};

// ======================================================
// SERVICE API CLASS
// ======================================================
class APIService {
  private readonly API_BASE_URL: string;
  private readonly API_VERSION: string;
  private readonly TOKEN_KEY: string;
  private readonly DEFAULT_HEADERS: Record<string, string>;
  private readonly DEFAULT_TIMEOUT: number = 15000; // 15 seconds
  private axiosInstance;

  constructor(config: IApiSetup) {
    this.API_BASE_URL = config.API_BASE_URL;
    this.API_VERSION = config.API_VERSION || "";
    this.TOKEN_KEY = config.TOKEN_KEY || "";
    this.DEFAULT_HEADERS = {
      // "X-Requested-With": "XMLHttpRequest",
      ...(config.HEADERS || {}),
    };

    // this.initializeAxios();
    this.axiosInstance = this.initializeAxios();
    this.setupInterceptors();
  }

  // ======================================================
  // INITIALIZATION METHOD
  // ======================================================
  // private initializeAxios(): void {
  //   axios.defaults.baseURL = this.API_VERSION
  //     ? `${this.API_BASE_URL}/${this.API_VERSION}`
  //     : this.API_BASE_URL;

  //   axios.defaults.timeout = this.DEFAULT_TIMEOUT;
  // }
  private initializeAxios() {
    return axios.create({
      baseURL: this.API_VERSION
        ? `${this.API_BASE_URL}/${this.API_VERSION}`
        : this.API_BASE_URL,
      timeout: this.DEFAULT_TIMEOUT,
    });
  }

  // ======================================================
  // SETUP AXIOS INTERCEPTOR
  // ======================================================
  private setupInterceptors(): void {
    // Step 1: Request interceptor
    this.axiosInstance.interceptors.request.use((config: any) => {
      // Add security headers to every request
      config.headers = {
        ...config.headers,
      };
      return config;
    });

    // Step 2: Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalConfig = error.config as CustomAxiosRequestConfig;

        if (
          error.response?.status === 401 &&
          !originalConfig._retry &&
          refreshTokenFn &&
          !isPublicAuthUrl(originalConfig.url)
        ) {
          originalConfig._retry = true;
          const newToken = await refreshTokenFn();
          if (newToken) {
            originalConfig.headers = originalConfig.headers || {};
            originalConfig.headers.Authorization = `Bearer ${newToken}`;
            return this.axiosInstance(originalConfig);
          }
          location.href = "/logout";
        }

        return Promise.reject(error);
      },
    );
  }

  // ======================================================
  // CORE API METHODS ====> (FETCH API REQUEST)
  // ======================================================
  public async fetch<T = any>(
    url: string,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.get<T>(urlHash(url), {
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
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post<T>(url, payload, {
        params: options.params,
        headers: this.prepareHeaders(options),
        signal: options.signal,
      });

      const result = { ...(response?.data as ApiResponse) };

      return result;
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
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.put<T>(url, payload, {
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
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.patch<T>(url, payload, {
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
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.delete<T>(url, {
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
    console.error(" [handleError] Error received:", error);

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
        console.error(" [handleError] Axios Error:", {
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
      console.error("🔴 [handleError] Network Error:", error);
    }

    return { error: networkError };
  }
}

export default APIService;
