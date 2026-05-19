import React, { type ReactNode } from "react";

interface RoleWrapperProps {
  allowedRoles: string[]; // Roles that can view the child
  userRole: string;       // Current user's role
  children: ReactNode;    // Child components
}

const RoleWrapper: React.FC<RoleWrapperProps> = ({ allowedRoles, userRole, children }) => {
  if (!allowedRoles.includes(userRole)) {
    return null; // Hide children if role not allowed
  }
  return <>{children}</>; // Show children if role allowed
};

export default RoleWrapper;
