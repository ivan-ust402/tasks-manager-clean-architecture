import type { TaskPriority, TaskStatus } from "../../enums";

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  projectId?: string;
  tags?: string[];
  dueDateFrom?: Date;
  dueDateTo?: Date;
}