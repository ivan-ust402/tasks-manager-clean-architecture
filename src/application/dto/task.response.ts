import type { TaskPriority, TaskStatus } from "../../core/domain/enums"

export interface TaskResponse {
  id: string,
  title: string,
  description?: string,
  status: TaskStatus,
  priority: TaskPriority,
  dueDate?: string,
  createAt: string,
  updateAt: string,
  assigneeId?: string,
  tags: string[],
  projectId?: string,
  isOverdue: boolean,
};