# Реализации репозиториев (адаптеры) - "Работники с технологиями"

```
  src/infrastructure/repositories/
  ├── UserRepository.impl.ts        // Работает с Prisma/TypeORM
  ├── ProductRepository.impl.ts     // Работает с MongoDB
  └── OrderRepository.impl.ts       // Работает с REST API
```

#### Пример:
```
  class UserRepositoryImpl implements UserRepository {
    constructor(private prisma: PrismaClient) {}
    
    async findById(id: string): Promise<User> {
      const data = await this.prisma.user.findUnique({ where: { id } });
      return UserMapper.toEntity(data);  // Преобразуем в Entity
    }
  }
```