import { Role, Permission, RolePermission, UserRole, Asset, AssetInstance, Log, Operation, Session, User } from "@prisma/client_competency";
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

export class AssetInstanceRepository extends BaseRepository<AssetInstance, "id"> {
  constructor(manager: DatabaseManagement<any> = COMPETENCY.assetInstance, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

export class LogRepository extends BaseRepository<Log, "id"> {
  constructor(manager: DatabaseManagement<any> = COMPETENCY.log, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

export class OperationRepository extends BaseRepository<Operation, "id"> {
  constructor(manager: DatabaseManagement<any> = COMPETENCY.operation, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

export class SessionRepository extends BaseRepository<Session, "id"> {
  constructor(manager: DatabaseManagement<any> = COMPETENCY.session, pkField: "id" = "id") {
    super(manager, pkField);
  }
}

export class UserRepository extends BaseRepository<User, "id"> {
  constructor(manager: DatabaseManagement<any> = COMPETENCY.user, pkField: "id" = "id") {
    super(manager, pkField);
  }
}
