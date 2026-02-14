import { TaskEntity } from "../../core/domain/entites";
import type { Task } from "../../core/domain/entites/interfaces";
import type { TaskRepository } from "../../core/domain/repositories";
import type { CompleteTaskUseCase } from "../../core/domain/use-cases";

export class CompleteTask implements CompleteTaskUseCase {
  private readonly taskRepository: TaskRepository; 
  constructor(taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute(id: string): Promise<Task> {
    // 1. Получаем задачу
    const task = await this.taskRepository.findById(id);
    
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }

    // 2. Применяем бизнес-правила
    const completedTask = TaskEntity.complete(task);

    // 3. Сохраняем изменения
    return await this.taskRepository.update(id, {
      status: completedTask.status,
      updatedAt: completedTask.updatedAt,
    });
  }
}