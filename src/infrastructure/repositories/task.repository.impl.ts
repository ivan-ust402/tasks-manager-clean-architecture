import { TaskMapper } from "../../application/mappers";
import type { Task, TaskFilters } from "../../core/domain/entites/interfaces";
import { TaskPriority, TaskStatus } from "../../core/domain/enums";
import type { TaskRepository } from "../../core/domain/repositories";
import type { ApiClient, ApiResponse } from "../api";
import type { LocalStorage } from "../storage";

export class TaskRepositoryImpl implements TaskRepository {
  // Явно объявляем поля класса
  private apiClient: ApiClient;
  private localStorage: LocalStorage;

  constructor( apiClient: ApiClient, localStorage: LocalStorage ) {
    this.apiClient = apiClient;
    this.localStorage = localStorage
  }
  findByAssignee(assigneeId: string): Promise<Task[]> {
    console.log(assigneeId)
    throw new Error("Method not implemented.");
  }
  findByStatus(status: TaskStatus): Promise<Task[]> {
    console.log(status)
    throw new Error("Method not implemented.");
  }
  changePriority(id: string, priority: TaskPriority): Promise<Task> {
    console.log(id, priority)
    throw new Error("Method not implemented.");
  }

  async create(task: Task): Promise<Task> {
    // Можно использовать API или localStorage в зависимости от контекста
    if (navigator.onLine) {
      const response = await this.apiClient.post('tasks', {
        title: task.title.getValue(),
        description: task.description?.getValue(),
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate?.toISOString(),
        assigneeId: task.assigneeId,
        tags: task.tags,
        projectId: task.projectId,
      });

      return TaskMapper.toDomain(response.data);
    } else {
      // Офлайн режим - сохраняем в localStorage
      const tasks = this.getLocalTasks();
      tasks.push(task);
      this.localStorage.set('tasks', JSON.stringify(tasks));
      return task;
    }
  }

  async findAll(filters?: TaskFilters): Promise<Task[]> {
    try {
      const response = await this.apiClient.get('/tasks', { params: filters })  as ApiResponse<Task[]>;
      return response.data.map(TaskMapper.toDomain);
    } catch (error) {
      //Fallback на локальное хранилище
      console.warn('API недоступен, используем локальные данные.', error);
      return this.getLocalTasks();
    }
  }

  async update(id: string, updates: Partial<Task>): Promise<Task> {
    const response = await this.apiClient.patch(`/tasks/${id}`, updates);
    return TaskMapper.toDomain(response.data);
  }

  async delete(id: string): Promise<void> {
    await this.apiClient.delete(`/tasks/${id}`);
  }

  async findById(id: string): Promise<Task | null> {
    try {
      const response = await this.apiClient.get(`/tasks/${id}`);
      return TaskMapper.toDomain(response.data);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findByProject(projectId: string): Promise<Task[]> {
    const response = await this.apiClient.get(`/projects/${projectId}/tasks`) as ApiResponse<Task[]>;
    return response.data.map(TaskMapper.toDomain);
  }

  async markAsCompleted(id: string): Promise<Task> {
    return this.update(id, { status: TaskStatus.DONE });
  }

  async assignTask(id: string, assigneeId: string): Promise<Task> {
    return this.update(id, { assigneeId });
  }

  async search(query: string): Promise<Task[]> {
    const response = await this.apiClient.get('/tasks/search', {
      params: { q: query }
    })  as ApiResponse<Task[]>;
    return response.data.map(TaskMapper.toDomain);
  }

  private getLocalTasks(): Task[] {
    const data = this.localStorage.get('tasks') as string;
    return data ? JSON.parse(data).map(TaskMapper.toDomain) : [];
  }
}