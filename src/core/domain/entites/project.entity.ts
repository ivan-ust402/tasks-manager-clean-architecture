import type { Project } from "./interfaces";

export class ProjectEntity {
  static create(name: string, description?: string): Project {
    const now = new Date();
    
    return {
      id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      color: this.generateRandomColor(),
      createdAt: now,
      updatedAt: now,
      taskCount: 0,
      completedTaskCount: 0,
    };
  }

  static addTask(project: Project): Project {
    return {
      ...project,
      taskCount: project.taskCount + 1,
      updatedAt: new Date(),
    };
  }

  static completeTask(project: Project): Project {
    return {
      ...project,
      completedTaskCount: project.completedTaskCount + 1,
      updatedAt: new Date(),
    };
  }

  private static generateRandomColor(): string {
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
      '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}