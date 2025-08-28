import { OperationRepository } from "@/modules/admin/repositories/RoleRepository";
import type { Operation } from "@prisma/client_competency";
import { BaseService } from "@Utils/BaseService";

export class OperationService extends BaseService<Operation, keyof Operation> {
  constructor() {
    super(new OperationRepository(), ["name", "description"], "id");
  }

  async createOperation(name: string, description?: string, actor: string = "system"): Promise<Operation> {
    const existing = await this.repo.findFirst({ where: { name } });
    if (existing) {
      throw new Error(`Operation with name '${name}' already exists`);
    }
    return this.repo.create({ name, description }, actor);
  }

  async updateOperation(id: number, updates: Partial<Omit<Operation, "id">>, actor: string = "system"): Promise<Operation> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new Error("Operation not found");
    }
    if (updates.name) {
      // check duplicate name if name is being updated
      const duplicate = await this.repo.findFirst({ where: { name: updates.name, NOT: { id } } });
      if (duplicate) {
        throw new Error(`Another operation with name '${updates.name}' already exists`);
      }
    }
    return this.repo.update(id, updates, actor);
  }

  async deleteOperation(id: number, actor: string = "system"): Promise<Operation> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new Error("Operation not found");
    }
    return this.repo.delete(id, actor);
  }
}
