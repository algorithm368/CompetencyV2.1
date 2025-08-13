import { UserRepository } from "@Competency/repositories/RoleRepository";
import type { User } from "@prisma/client_competency";
import { BaseService } from "@Utils/BaseService";

export class UserService extends BaseService<User, keyof User> {
  constructor() {
    super(new UserRepository(), ["id"], "id");
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.repo.findFirst({ where: { email } });
  }

  async createUser(data: Partial<User>, actor: string = "system"): Promise<User> {
    const existing = await this.repo.findFirst({ where: { email: data.email } });
    if (existing) {
      throw new Error("User with this email already exists");
    }
    return await this.repo.create(data, actor);
  }

  async updateUser(id: string, updateData: Partial<User>, actor: string = "system"): Promise<User> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new Error("User not found");
    }
    return await this.repo.update(id, updateData, actor);
  }

  async deleteUser(id: string, actor: string = "system"): Promise<User> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new Error("User not found");
    }
    return await this.repo.delete(id, actor);
  }
}
