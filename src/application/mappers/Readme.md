# Преобразователи между слоями - "Переводчики"

```
  src/application/mappers/
  ├── User.mapper.ts        // Entity → DTO и обратно
  ├── Product.mapper.ts
  └── Order.mapper.ts
```

#### Пример:
```
  class UserMapper {
    static toDto(entity: User): UserResponseDto {
      return {
        id: entity.id,
        email: entity.email.value,  // Извлекаем значение VO
        name: entity.name
      };
    }
  }
```