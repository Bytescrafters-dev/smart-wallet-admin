"use client";
import { getPermissions } from "@/contexts/permissionsProvider";

const ViewUserRoles = () => {
  const perms = getPermissions();
  return <div className="flex flex-1 flex-col">View user roles</div>;
};

export default ViewUserRoles;
