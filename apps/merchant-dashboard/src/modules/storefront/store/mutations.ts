import axios from "axios";
import { useStorefrontState } from "./state";
import { useStorage } from "@packages/hooks";

const { setStorage } = useStorage();

export function useStorefrontMutations() {
  const {} = useStorefrontState();

  return {};
}
