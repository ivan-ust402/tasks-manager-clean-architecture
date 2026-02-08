# Интерфейсы репозиториев (Порты) - "Контракты на работу"

```
src/core/domain/repositories/
├── UserRepository.interface.ts   # Как работать с пользователями
├── ProductRepository.interface.ts
└── OrderRepository.interface.ts
```

**Пример интерфейса**
```
interface UserRepository {
  findById(id: string): Promise<User>;
  save(user: User): Promise<void>;
  findByEmail(email: Email): Promise<User | null>;
  // ТОЛЬКО методы, НЕ реализация
}
```