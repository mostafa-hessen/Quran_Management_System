import { useQuery } from "@tanstack/react-query";
import * as halaqatApi from "../api/halaqatApi";

export const useHalaqat = () => {
  return useQuery({
    queryKey: ["halaqat"],
    queryFn: halaqatApi.fetchHalaqat,
  });
};
