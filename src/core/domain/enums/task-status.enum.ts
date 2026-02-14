export const TaskStatus = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  DONE: 'done',
  BLOCKED: 'blocked',
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];