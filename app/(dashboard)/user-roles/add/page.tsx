"use client";
import { getPermissions } from "@/contexts/permissionsProvider";

const AddUserRole = () => {
  const perms = getPermissions();
  return <div className="flex flex-1 flex-col">Add user roles</div>;
};

export default AddUserRole;
