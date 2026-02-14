export class TaskDescription {
  private static readonly MAX_LENGTH = 1000;

  private readonly value!: string;

  private constructor(value: string) {
    if (value.length > TaskDescription.MAX_LENGTH) {
      throw new Error(
        `Description cannot exceed ${TaskDescription.MAX_LENGTH} characters`
      );
    }
  }

  static create(value: string): TaskDescription {
    return new TaskDescription(value);
  }

  getValue(): string {
    return this.value;
  }
}
