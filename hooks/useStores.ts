import { useQuery } from "@tanstack/react-query";
import { Store } from "@/types/store";

export const useStores = () => {
  return useQuery({
    queryKey: ["stores"],
    queryFn: async (): Promise<Store[]> => {
      const response = await fetch("/api/proxy/stores");
      if (!response.ok) {
        throw new Error("Failed to fetch stores");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
