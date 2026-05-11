// Roles de usuario del sistema
export const UserRoles = {
  ADMIN: 'administrador',
  SELLER: 'vendedor',
  CLIENT: 'cliente',
} as const;

export type UserRole = typeof UserRoles[keyof typeof UserRoles];

// Permisos por rol
export const RolePermissions = {
  [UserRoles.ADMIN]: {
    canViewDashboard: true,
    canViewSummary: true,
    canViewProducts: true,
    canViewSales: true,
    canViewAdmin: true,
  },
  [UserRoles.SELLER]: {
    canViewDashboard: true,
    canViewSummary: false,
    canViewProducts: true,
    canViewSales: true,
    canViewAdmin: false,
  },
  [UserRoles.CLIENT]: {
    canViewDashboard: false,
    canViewSummary: false,
    canViewProducts: false,
    canViewSales: false,
    canViewAdmin: false,
  },
} as const;

export type Permission = 'canViewSummary' | 'canViewProducts' | 'canViewSales' | 'canViewAdmin';

export const hasPermission = (role: string, permission: Permission): boolean => {
  const permissions = RolePermissions[role as UserRole];
  return permissions ? permissions[permission] : false;
};