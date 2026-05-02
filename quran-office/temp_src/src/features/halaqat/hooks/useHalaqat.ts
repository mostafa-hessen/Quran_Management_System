import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as halaqatApi from "../api/halaqatApi";
import type { CreateHalaqaInput, UpdateHalaqaInput } from "../types";

export const useHalaqat = () => {
  return useQuery({
    queryKey: ["halaqat"],
    queryFn: halaqatApi.fetchHalaqat,
  });
};

export const useHalaqa = (halaqaId: string) => {
  return useQuery({
    queryKey: ["halaqat", halaqaId],
    queryFn: () => halaqatApi.fetchHalaqaById(halaqaId),
    enabled: !!halaqaId,
  });
};

export const useCreateHalaqa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (halaqa: CreateHalaqaInput) => halaqatApi.createHalaqa(halaqa),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["halaqat"] });
    },
  });
};

export const useUpdateHalaqa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      halaqaId,
      updates,
    }: {
      halaqaId: string;
      updates: UpdateHalaqaInput;
    }) => halaqatApi.updateHalaqa(halaqaId, updates),
    onSuccess: (_, { halaqaId }) => {
      queryClient.invalidateQueries({ queryKey: ["halaqat"] });
      queryClient.invalidateQueries({ queryKey: ["halaqat", halaqaId] });
    },
  });
};

export const useDeleteHalaqa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (halaqaId: string) => halaqatApi.deleteHalaqa(halaqaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["halaqat"] });
    },
  });
};
