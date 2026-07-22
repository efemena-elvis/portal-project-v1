import { computed } from "vue";
import { teamList, teamDetail } from "./state";

export const getAllTeams = computed(() => teamList.value);
export const getCurrentTeam = computed(() => teamDetail.value);
