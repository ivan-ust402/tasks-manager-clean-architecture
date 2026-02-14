import type { Task, TaskFilters } from "../entites/interfaces";
import type { TaskPriority, TaskStatus } from "../enums";

export interface TaskRepository {
  // CRUD операции
  create(task: Task): Promise<Task>;
  update(id: string, task: Partial<Task>): Promise<Task>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Task | null>;
  findAll(filters?: TaskFilters): Promise<Task[]>;
  
  // Специфичные операции
  findByProject(projectId: string): Promise<Task[]>;
  findByAssignee(assigneeId: string): Promise<Task[]>;
  findByStatus(status: TaskStatus): Promise<Task[]>;
  search(query: string): Promise<Task[]>;
  
  // Бизнес-операции
  markAsCompleted(id: string): Promise<Task>;
  changePriority(id: string, priority: TaskPriority): Promise<Task>;
  assignTask(id: string, assigneeId: string): Promise<Task>;
}