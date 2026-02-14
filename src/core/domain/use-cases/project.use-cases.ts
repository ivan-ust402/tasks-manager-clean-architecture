import type { Project, Task } from "../entites/interfaces";

export interface CreateProjectUseCase {
  execute(params: { name: string; description?: string }): Promise<Project>;
}

export interface GetProjectWithTasksUseCase {
  execute(projectId: string): Promise<{
    project: Project;
    tasks: Task[];
  }>;
}