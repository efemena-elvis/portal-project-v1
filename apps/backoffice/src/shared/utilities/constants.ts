const APP_URL = import.meta.env.VITE_APP_URL;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;
const APP_PORT = import.meta.env.VITE_LOCAL_PORT;

const LOCAL_DOMAIN = `http://localhost:${APP_PORT}`;
const IS_LOCAL_HOST = window.location.hostname === "localhost";
const IS_STAGING = window.location.hostname.includes("staging");

export interface IConstants {
  PORTAL_AUTH_USER: string;
  PORTAL_AUTH_TOKEN: string;
  PORTAL_AUTH_BUSINESS: string;
  PORTAL_AUTH_BUSINESS_TOKEN: string;
  PORTAL_REFRESH_TOKEN: string;
  PORTAL_APP_URL: string;
  PORTAL_API_VERSION: string;
  PORTAL_API_BASE_URL: string;
  ENVIRONMENT: "test" | "prod";
}

const constants: IConstants = {
  PORTAL_AUTH_USER: "PORTAL_AUTH_USER",
  PORTAL_AUTH_TOKEN: "PORTAL_AUTH_TOKEN",
  PORTAL_AUTH_BUSINESS: "PORTAL_AUTH_BUSINESS",
  PORTAL_AUTH_BUSINESS_TOKEN: "PORTAL_AUTH_BUSINESS_TOKEN",
  PORTAL_REFRESH_TOKEN: "PORTAL_REFRESH_TOKEN",
  PORTAL_APP_URL: IS_LOCAL_HOST ? LOCAL_DOMAIN : APP_URL,
  PORTAL_API_VERSION: API_VERSION,
  PORTAL_API_BASE_URL: API_BASE_URL,
  ENVIRONMENT: IS_STAGING ? "test" : "prod",
};

export default constants;
