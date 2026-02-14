import type { TaskPriority, TaskStatus } from "../../enums";
import type { TaskDescription, TaskTitle } from "../../value-objects";

export interface Task {
  id: string;
  title: TaskTitle;
  description?: TaskDescription;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  assigneeId?: string;
  tags: string[];
  projectId?: string;
}