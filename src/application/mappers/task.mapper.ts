import { TaskPriority } from './../../core/domain/enums/task-priority.enum';
import { TaskDescription } from './../../core/domain/value-objects/TaskDescription.vo';
import type { Task } from "../../core/domain/entites/interfaces";
import { TaskTitle } from "../../core/domain/value-objects";
import type { TaskStatus } from '../../core/domain/enums';
import type { TaskResponse } from '../dto/task.response';

export class TaskMapper {
  static toResponse(task: Task): TaskResponse { // Во внешний слой
    return {
      id: task.id,
      title: task.title.getValue(),
      description: task.description?.getValue(),
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate?.toISOString(),
      createAt: task.createdAt.toISOString(),
      updateAt: task.updatedAt.toISOString(),
      assigneeId: task.assigneeId,
      tags: task.tags,
      projectId: task.projectId,
      isOverdue: task.dueDate ? new Date() > task.dueDate : false,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static toDomain(raw: any): Task { //Во внутренний слой
    return {
      id: raw.id,
      title: TaskTitle.create(raw.title),
      description: raw.TaskDescription
        ? TaskDescription.create(raw.description)
        : undefined,
      status: raw.status as TaskStatus,
      priority: raw.priority as TaskPriority,
      dueDate: raw.dueDate ? new Date(raw.dueDate) : undefined,
      createdAt: new Date(raw.createAt),
      updatedAt: new Date(raw.updatedAt),
      assigneeId: raw.assigneeId,
      tags: raw.tags || [],
      projectId: raw.projectId,
    }
  }
}