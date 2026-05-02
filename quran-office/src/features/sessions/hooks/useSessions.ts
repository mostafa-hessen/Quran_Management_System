import { useQuery } from "@tanstack/react-query";
import * as sessionsApi from "../api/sessionsApi";

export const useHalaqaSessions = (halaqaId: string) => {
  return useQuery({
    queryKey: ["halaqa-sessions", halaqaId],
    queryFn: () => sessionsApi.fetchHalaqaSessions(halaqaId),
    enabled: !!halaqaId,
  });
};
