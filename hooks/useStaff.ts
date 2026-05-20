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

const updateStaffMember = async (
  id: string,
  data: Partial<StaffCreateInput>,
): Promise<StaffMember> => {
  const response = await fetch(`/api/proxy/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update staff member");
  }
  return response.json();
};

const assignStoreToStaff = async (
  id: string,
  storeIds: string[],
): Promise<StaffMember> => {
  const response = await fetch(`/api/proxy/users/${id}/stores`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ storeIds }),
  });

  if (!response.ok) {
    throw new Error("Failed to update staff member");
  }
  return response.json();
};

const unassignStoreFromStaff = async (id: string, storeId: string) => {
  const response = await fetch(`/api/proxy/users/${id}/stores/${storeId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to update staff member");
  }
  return response.json();
};

const deactivateStaffMember = async (id: string) => {
  const response = await fetch(`/api/proxy/users/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to deactivate staff member");
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

export const useUpdateStaffMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<StaffCreateInput>;
    }) => updateStaffMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-members"] });
      queryClient.invalidateQueries({ queryKey: ["staff-member"] });
    },
  });
};

export const useAssignStoreToStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, storeId }: { id: string; storeId: string }) =>
      assignStoreToStaff(id, [storeId]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-members"] });
      queryClient.invalidateQueries({ queryKey: ["staff-member"] });
    },
  });
};

export const useUnassignStoreFromStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, storeId }: { id: string; storeId: string }) =>
      unassignStoreFromStaff(id, storeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-members"] });
      queryClient.invalidateQueries({ queryKey: ["staff-member"] });
    },
  });
};

export const useDeactivateStaffMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deactivateStaffMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-members"] });
    },
  });
};
