const APP_URL = import.meta.env.VITE_APP_URL;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;
const APP_PORT = import.meta.env.VITE_LOCAL_PORT;
const APP_VARIANT = import.meta.env.VITE_APP_VARIANT;
const PROD_BASE_URL = import.meta.env.VITE_PROD_API_BASE_URL;

const LOCAL_DOMAIN = `http://localhost:${APP_PORT}`;
const IS_LOCAL_HOST = window.location.hostname === "localhost";

export interface IConstants {
  APP_AUTH_USER: string;
  APP_AUTH_TOKEN: string;
  APP_AUTH_BUSINESS: string;
  APP_AUTH_BUSINESS_TOKEN: string;
  APP_URL: string;
  APP_API_VERSION: string;
  APP_API_BASE_URL: string;
  APP_VARIANT: string;
  PROD_BASE_URL: string;
  IS_LOCAL_HOST: boolean;
}

const constants: IConstants = {
  APP_AUTH_USER: "APP_AUTH_USER",
  APP_AUTH_TOKEN: "APP_AUTH_TOKEN",
  APP_AUTH_BUSINESS: "APP_AUTH_BUSINESS",
  APP_AUTH_BUSINESS_TOKEN: "APP_AUTH_BUSINESS_TOKEN",
  APP_URL: IS_LOCAL_HOST ? LOCAL_DOMAIN : APP_URL,
  APP_API_VERSION: API_VERSION,
  APP_API_BASE_URL: API_BASE_URL,
  APP_VARIANT: APP_VARIANT,
  PROD_BASE_URL: PROD_BASE_URL,
  IS_LOCAL_HOST,
};

export default constants;
