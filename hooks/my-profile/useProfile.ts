import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserProfile } from "@/types/common";

const PROFILE_QUERY_KEY = ["profile", "me"];

type UpdateProfileInput = Pick<UserProfile, "firstName" | "lastName" | "phone">;

type UploadAvatarResponse = { success: true; avatar: string };

const fetchProfileRequest = async (): Promise<UserProfile> => {
  const response = await fetch("/api/proxy/profile/my-profile");

  if (!response.ok) {
    const msg =
      (await response.json().catch(() => ({}))).message ??
      "Failed to fetch profile!";
    throw new Error(msg);
  }

  const user = await response.json();
  if (!user) {
    throw new Error("Failed to fetch profile!");
  }

  return user;
};

const updateProfileRequest = async (
  data: UpdateProfileInput
): Promise<UserProfile> => {
  const response = await fetch("/api/proxy/profile/my-profile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const msg =
      (await response.json().catch(() => ({}))).message ??
      "Failed to update profile!";
    throw new Error(msg);
  }

  const user = await response.json();
  if (!user) {
    throw new Error("Failed to update profile!");
  }

  return user;
};

const uploadAvatarRequest = async (
  formData: FormData
): Promise<UploadAvatarResponse> => {
  const response = await fetch("/api/proxy/admin/uploads/avatar", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const msg =
      (await response.json().catch(() => ({}))).message ??
      "Failed to upload avatar!";
    throw new Error(msg);
  }

  const payload = await response.json();
  if (!payload?.avatarUrl) {
    throw new Error("Failed to upload avatar!");
  }

  return { success: true, avatar: payload.avatarUrl };
};

const getErrorMessage = (err: unknown) =>
  err ? (err instanceof Error ? err.message : "Something went wrong") : null;

export const useProfile = () => {
  const queryClient = useQueryClient();

  const profileQuery = useQuery<UserProfile, Error>({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: fetchProfileRequest,
  });

  const uploadProfileMutation = useMutation<UserProfile, Error, UpdateProfileInput>(
    {
      mutationFn: updateProfileRequest,
      onSuccess: (updated) => {
        queryClient.setQueryData(PROFILE_QUERY_KEY, updated);
      },
    }
  );

  const uploadAvatarMutation = useMutation<UploadAvatarResponse, Error, FormData>(
    {
      mutationFn: uploadAvatarRequest,
      onSuccess: ({ avatar }) => {
        queryClient.setQueryData<UserProfile | undefined>(
          PROFILE_QUERY_KEY,
          (prev) => (prev ? { ...prev, avatar } : prev)
        );
      },
    }
  );

  return {
    profile: profileQuery.data ?? null,
    profileLoading: profileQuery.isLoading,
    profileRefetching: profileQuery.isRefetching,
    profileError: profileQuery.error?.message ?? null,
    refetchProfile: profileQuery.refetch,
    uploadProfile: uploadProfileMutation.mutateAsync,
    updatingProfile: uploadProfileMutation.isPending,
    uploadProfileError: getErrorMessage(uploadProfileMutation.error),
    uploadAvatar: uploadAvatarMutation.mutateAsync,
    uploadingAvatar: uploadAvatarMutation.isPending,
    uploadAvatarError: getErrorMessage(uploadAvatarMutation.error),
  };
};
