# Реализации сценариев - "Министерства"

```
src/application/use-cases/
├── CreateUser.use-case.impl.ts
├── ProcessOrder.use-case.impl.ts
└── SendNotification.use-case.impl.ts
```

#### Структура use-case:

```
class CreateUserUseCaseImpl implements CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,  // Зависимость через интерфейс
    private emailService: EmailService
  ) {}
  
  async execute(command: CreateUserCommand): Promise<User> {
    // 1. Валидация команды
    // 2. Создание сущности
    // 3. Вызов репозитория
    // 4. Побочные эффекты (отправка email)
    // 5. Возврат результата
  }
}
```