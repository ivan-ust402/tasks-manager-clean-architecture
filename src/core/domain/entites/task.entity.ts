import { TaskPriority, TaskStatus } from "../enums";
import { TaskDescription, TaskTitle } from "../value-objects";
import type { Task } from "./interfaces";

/**
 * Бизнес-правила сущности Task
 */
export class TaskEntity {
  static create(props: {
    title: string;
    description?: string;
    priority?: TaskPriority;
    assigneeId?: string;
  }): Task {
    const now = new Date();
    
    return {
      id: this.generateId(),
      title: TaskTitle.create(props.title),
      description: props.description 
        ? TaskDescription.create(props.description) 
        : undefined,
      status: TaskStatus.TODO,
      priority: props.priority || TaskPriority.MEDIUM,
      dueDate: undefined,
      createdAt: now,
      updatedAt: now,
      assigneeId: props.assigneeId,
      tags: [],
      projectId: undefined,
    };
  }

  static markAsInProgress(task: Task): Task {
    if (task.status === TaskStatus.DONE) {
      throw new Error('Cannot move done task to in progress');
    }

    return {
      ...task,
      status: TaskStatus.IN_PROGRESS,
      updatedAt: new Date(),
    };
  }

  static complete(task: Task): Task {
    return {
      ...task,
      status: TaskStatus.DONE,
      updatedAt: new Date(),
    };
  }

  static isOverdue(task: Task): boolean {
    if (!task.dueDate) return false;
    return new Date() > task.dueDate;
  }

  private static generateId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}