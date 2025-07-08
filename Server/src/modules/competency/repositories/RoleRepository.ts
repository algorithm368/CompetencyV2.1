import { Roles, Permissions, RolePermissions, UserRoles } from "@prisma/client_competency";
import { DatabaseManagement } from "@Utils/databaseUtils";
import { BaseRepository } from "@Utils/BaseRepository";
import { COMPETENCY } from "@Database/dbManagers";

export class RoleRepository extends BaseRepository<Roles, "id"> {
  constructor(manager: DatabaseManagement<Roles> = COMPETENCY.roles, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

export class PermissionRepository extends BaseRepository<Permissions, "id"> {
  constructor(manager: DatabaseManagement<Permissions> = COMPETENCY.permissions, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

export class RolePermissionsRepository extends BaseRepository<RolePermissions, "id"> {
  constructor(manager: DatabaseManagement<RolePermissions> = COMPETENCY.rolePermissions, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

export class UserRolesRepository extends BaseRepository<UserRoles, "id"> {
  constructor(manager: DatabaseManagement<UserRoles> = COMPETENCY.userRoles, pkField: "id" = "id") {
    super(manager, pkField);
  }
}
