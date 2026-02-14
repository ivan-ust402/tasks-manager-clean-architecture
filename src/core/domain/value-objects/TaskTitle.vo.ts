export class TaskTitle {
  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 200;

  // Добавляем "!" чтобы указать, что поле будет инициализировано
  
  private readonly value!: string;

  private constructor(value: string) {
    if (!this.isValid(value)) {
      throw new Error(
        `Title must be between ${TaskTitle.MIN_LENGTH} and ${TaskTitle.MAX_LENGTH} characters`
      );
    }
  }

  static create(value: string): TaskTitle {
    return new TaskTitle(value.trim());
  }

  private isValid(value: string): boolean {
    const trimmed = value.trim();
    return (
      trimmed.length >= TaskTitle.MIN_LENGTH &&
      trimmed.length <= TaskTitle.MAX_LENGTH
    );
  }

  getValue(): string {
    return this.value;
  }

  equals(other: TaskTitle): boolean {
    return this.value === other.value;
  }
}