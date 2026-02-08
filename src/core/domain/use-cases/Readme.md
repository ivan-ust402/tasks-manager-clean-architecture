# Интерфейсы сценариев использования - "Сценарии бизнеса"

```
src/core/domain/use-cases/
├── CreateUser.use-case.ts        # Что нужно для создания пользователя
├── ProcessOrder.use-case.ts      # Что нужно для обработки заказа
└── SendNotification.use-case.ts
```

#### Пример:
```
interface CreateUserUseCase {
  execute(command: CreateUserCommand): Promise<User>;
}
// Команда = DTO с валидацией
```