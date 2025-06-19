const APP_URL = import.meta.env.VITE_APP_URL;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;
const APP_PORT = import.meta.env.VITE_LOCAL_PORT;

const LOCAL_DOMAIN = `http://localhost:${APP_PORT}`;
const IS_LOCAL_HOST = window.location.hostname === "localhost";

export interface IConstants {
  MOR_AUTH_USER: string;
  MOR_AUTH_TOKEN: string;
  MOR_AUTH_BUSINESS: string;
  MOR_AUTH_BUSINESS_TOKEN: string;
  MOR_APP_URL: string;
  MOR_API_VERSION: string;
  MOR_API_BASE_URL: string;
}

const constants: IConstants = {
  MOR_AUTH_USER: "MOR_AUTH_USER",
  MOR_AUTH_TOKEN: "MOR_AUTH_TOKEN",
  MOR_AUTH_BUSINESS: "MOR_AUTH_BUSINESS",
  MOR_AUTH_BUSINESS_TOKEN: "MOR_AUTH_BUSINESS_TOKEN",
  MOR_APP_URL: IS_LOCAL_HOST ? LOCAL_DOMAIN : APP_URL,
  MOR_API_VERSION: API_VERSION,
  MOR_API_BASE_URL: API_BASE_URL,
};

export default constants;
