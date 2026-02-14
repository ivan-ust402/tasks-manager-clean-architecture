import type { Task, TaskFilters } from "../entites/interfaces";
import type { TaskPriority } from "../enums";

export interface CreateTaskUseCase {
  execute(params: {
    title: string;
    description?: string;
    priority?: TaskPriority;
    projectId?: string;
  }): Promise<Task>;
}

export interface UpdateTaskUseCase {
  execute(id: string, updates: Partial<Task>): Promise<Task>;
}

export interface DeleteTaskUseCase {
  execute(id: string): Promise<void>;
}

export interface GetTaskUseCase {
  execute(id: string): Promise<Task | null>;
}

export interface ListTasksUseCase {
  execute(filters?: TaskFilters): Promise<Task[]>;
}

export interface CompleteTaskUseCase {
  execute(id: string): Promise<Task>;
}

export interface AssignTaskUseCase {
  execute(taskId: string, assigneeId: string): Promise<Task>;
}
