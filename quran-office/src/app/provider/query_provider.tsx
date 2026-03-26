import { queryClient } from "@/shared/lib/query_clinet";
import {QueryClientProvider } from "@tanstack/react-query";


export default function QueryProvider({ children } : { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}