# Фабрики для DI - "Сборочный цех"

```
  src/main/factories/
  ├── UserRepository.factory.ts    # Создает репозиторий
  ├── CreateUserUseCase.factory.ts # Создает use case
  └── Services.factory.ts         # Создает все сервисы
```

#### Пример:
```
  export class UserRepositoryFactory {
    static create(): UserRepository {
      if (process.env.NODE_ENV === 'test') {
        return new UserRepositoryMock();  // Для тестов
      }
      return new UserRepositoryImpl(      // Для продакшена
        PrismaClientFactory.create()
      );
    }
  }
```