import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as homeworkApi from "../api/homeworkApi";
import  type{ Homework } from "../api/homeworkApi";

export const useHalaqaHomework = (halaqaId: string) => {
  return useQuery({
    queryKey: ["halaqa-homework", halaqaId],
    queryFn: () => homeworkApi.fetchHalaqaHomework(halaqaId),
    enabled: !!halaqaId,
  });
};

export const useCreateHomework = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (homework: Homework) => homeworkApi.createHomework(homework),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["halaqa-homework"] });
    },
  });
};


