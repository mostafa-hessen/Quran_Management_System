import React, { type ReactNode } from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { Permission } from '../permissions';

interface PermissionGateProps {
  children: ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  permission,
  permissions,
  requireAll = false,
  fallback = null,
}) => {
  const { hasPermission, hasAnyPermission } = usePermissions();

  let isAllowed = false;

  if (permission) {
    isAllowed = hasPermission(permission);
  } else if (permissions && permissions.length > 0) {
    if (requireAll) {
      isAllowed = permissions.every(hasPermission);
    } else {
      isAllowed = hasAnyPermission(...permissions);
    }
  } else {
    // If no permission criteria is provided, we allow access by default
    isAllowed = true;
  }

  if (isAllowed) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
