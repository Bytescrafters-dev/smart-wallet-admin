import { StaffMember } from "@/types/staff";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface StaffCreateInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  storeIds: string[];
}

interface UseStaffParams {
  page: number;
  limit: number;
  q?: string;
}

interface StaffsResponse {
  data: StaffMember[];
  total: number;
  page: number;
  limit: number;
}

const fetchAllStaffMembers = async ({
  page,
  limit,
  q,
}: UseStaffParams): Promise<StaffsResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (q) params.append("q", q);

  const response = await fetch(`/api/proxy/users/stores?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch staff members");
  }
  return response.json();
};

const fetchUserById = async (id: string): Promise<StaffMember> => {
  const response = await fetch(`/api/proxy/users/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch staff member");
  }
  return response.json();
};

const createStaffMember = async (
  data: StaffCreateInput,
): Promise<StaffMember> => {
  const response = await fetch("/api/proxy/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create staff member");
  }
  return response.json();
};

export const useStaffMembers = ({
  page = 1,
  limit = 10,
  q,
}: UseStaffParams) => {
  return useQuery<StaffsResponse>({
    queryKey: ["staff-members", page, limit, q],
    queryFn: () => fetchAllStaffMembers({ page, limit, q }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useStaffMember = (id: string) => {
  return useQuery<StaffMember, Error>({
    queryKey: ["staff-member", id],
    queryFn: () => fetchUserById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateStaffMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StaffCreateInput) => createStaffMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-members"] });
    },
  });
};
