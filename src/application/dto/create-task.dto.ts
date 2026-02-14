import type { TaskPriority } from "../../core/domain/enums";

export interface CreateTaskDTO {
  title: string;
  description?: string;
  priority?: TaskPriority;
  projectId?: string;
  assigneeId?: string;
  tags?: string[];
  dueDate?: Date;
}