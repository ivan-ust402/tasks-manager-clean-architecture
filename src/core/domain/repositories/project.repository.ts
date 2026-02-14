import type { Project } from "../entites/interfaces";

export interface ProjectRepository {
  create(project: Project): Promise<Project>;
  update(id: string, project: Partial<Project>): Promise<Project>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Project | null>;
  findAll(): Promise<Project[]>;
  
  // Бизнес-операции
  getProjectStats(id: string): Promise<{
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
  }>;
}