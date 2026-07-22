import { teamList, teamDetail } from "./state";

export function useTeamMutations() {
  const mutateTeamList = (payload: any[]) => {
    teamList.value = payload;
  };

  const mutateTeamDetail = (payload: Record<string, any> | null) => {
    teamDetail.value = payload;
  };

  const addTeamMember = (payload: Record<string, any>) => {
    teamList.value = [payload, ...teamList.value];
  };

  return {
    mutateTeamList,
    mutateTeamDetail,
    addTeamMember,
  };
}
