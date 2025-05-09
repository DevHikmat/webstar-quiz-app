import { useQuery } from "@tanstack/react-query";
import { Group } from "@/types/index.type";
import { getAllGroup } from "@/services/groupService";

export const useGroupName = (groupId: string | null): string => {
  const { data: groups } = useQuery<Group[]>({
    queryKey: ["groups"],
    queryFn: getAllGroup, 
    staleTime: 5 * 60 * 1000, 
  });

  if (!groupId || !groups) return "Noma'lum guruh";

  const found = groups.find((g) => g._id === groupId);
  return found?.name || "Noma'lum guruh";
};
