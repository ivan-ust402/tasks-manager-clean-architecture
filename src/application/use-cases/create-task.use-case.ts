import { TaskEntity } from "../../core/domain/entites";
import type { Task } from "../../core/domain/entites/interfaces";
import type { TaskRepository } from "../../core/domain/repositories";
import type { CreateTaskUseCase } from "../../core/domain/use-cases";
import type { CreateTaskDTO } from "../dto";


export class CreateTask implements CreateTaskUseCase {
  private readonly taskRepository: TaskRepository;

  constructor(taskRepository: TaskRepository) {
    // Явно присваиваем параметр полю
    this.taskRepository = taskRepository;
  }

  async execute(params: CreateTaskDTO): Promise<Task> {
    try {
      // Валидация бизнес-правил
      if (!params.title.trim()) {
        throw new Error('Task title is required');
      }

      // Создание сущности через фабричный метод
      const task = TaskEntity.create({
        title: params.title,
        description: params.description,
        priority: params.priority,
        assigneeId: params.assigneeId,
      });

      // Сохранение через репозиторий
      const createdTask = await this.taskRepository.create(task);
      
      return createdTask;
    } catch (error: unknown) {
      // Обработка ошибок прикладного уровня
      console.error('Failed to create task:', error);
      // throw new Error(`Failed to create task: ${error?.message && error.message || ''}`);
      throw new Error(`Failed to create task: `);
    }
  }
}