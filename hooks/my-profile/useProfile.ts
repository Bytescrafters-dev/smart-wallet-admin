import { UserProfile } from "@/types/common";
import { useCallback, useState } from "react";

export const useProfile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingAvatar, setLoadingAvatar] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/proxy/profile/my-profile", {
        method: "GET",
      });

      if (!response.ok) {
        const msg =
          (await response.json().catch(() => ({}))).message ??
          "Failed to fetch profile!";
        throw new Error(msg);
      }

      const user = await response.json();
      if (!user) {
        setError("Failed to fetch profile!");
        return;
      }
      setUser(user);
    } catch (err: any) {
      setError(err?.message ?? "Failed to fetch profile!");
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadAvatar = useCallback(async (formData: any) => {
    setError(null);
    setLoadingAvatar(true);

    try {
      const response = await fetch("/api/proxy/admin/uploads/avatar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const msg =
          (await response.json().catch(() => ({}))).message ??
          "Failed to upload avatar!";
        setError(msg);
      }

      const userAvatar = await response.json();
      if (!userAvatar) {
        setError("Failed to update avatar!");
        return;
      }

      return { success: true, avatar: userAvatar.avatarUrl };
    } catch (err: any) {
      setError(err?.message ?? "Failed to upload avatar!");
    } finally {
      setLoadingAvatar(false);
    }
  }, []);

  const uploadProfile = useCallback(async (data: any) => {
    setError(null);
    setLoading(true);

    try {
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
        setError("Failed to update profile!");
        return;
      }
      setUser(user);
    } catch (err: any) {
      setError(err?.message ?? "Failed to update profile!");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fetchProfile,
    uploadAvatar,
    uploadProfile,
    loading,
    error,
    user,
    loadingAvatar,
  };
};
