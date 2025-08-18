import { useQuery } from "@tanstack/react-query";
import { DashboardService, DashboardSummary } from "@Services/admin/DashboardService";

export const useDashboardSummary = () => {
  return useQuery<DashboardSummary>({
    queryKey: ["dashboardSummary"],
    queryFn: DashboardService.getSummary,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
