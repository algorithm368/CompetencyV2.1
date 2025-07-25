import { Role, Permission, RolePermission, UserRole, Asset, AssetPermission } from "@prisma/client_competency";
import { DatabaseManagement } from "@Utils/databaseUtils";
import { BaseRepository } from "@Utils/BaseRepository";
import { COMPETENCY } from "@Database/dbManagers";

export class RoleRepository extends BaseRepository<Role, "id"> {
  constructor(manager: DatabaseManagement<any> = COMPETENCY.role, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

export class PermissionRepository extends BaseRepository<Permission, "id"> {
  constructor(manager: DatabaseManagement<any> = COMPETENCY.permission, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

export class RolePermissionsRepository extends BaseRepository<RolePermission, "id"> {
  constructor(manager: DatabaseManagement<any> = COMPETENCY.rolePermission, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

export class UserRolesRepository extends BaseRepository<UserRole, "id"> {
  constructor(manager: DatabaseManagement<any> = COMPETENCY.userRole, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

export class AssetRepository extends BaseRepository<Asset, "id"> {
  constructor(manager: DatabaseManagement<any> = COMPETENCY.asset, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

export class AssetPermissionRepository extends BaseRepository<AssetPermission, "id"> {
  constructor(manager: DatabaseManagement<any> = COMPETENCY.assetPermission, pkField: "id" = "id") {
    super(manager, pkField);
  }
}
