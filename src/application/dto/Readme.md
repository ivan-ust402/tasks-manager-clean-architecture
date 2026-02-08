# Data transfer Objects - "Документы для передачи"
```
src/application/dto/
├── CreateUser.dto.ts        # Что принимаем от UI
├── UserResponse.dto.ts      # Что возвращаем в UI
└── UpdateProduct.dto.ts
```

#### Пример:
```
class CreateUserDto {
  @IsEmail() // Декоратор для свойства email
  email: string;
  
  @MinLength(6) // Декоратор для свойства password
  password: string;
}
```

Знак @ используется для применения декораторов к классам, методам, свойствам или параметрам.

#### Что такое декораторы:
**Декораторы** — это специальные функции, которые модифицируют поведение классов и их членов на этапе компиляции или выполнения.

#### Что делают эти конкретные декораторы:
1. **@IsEmail()**
  - Проверяет, что значение является валидным email
  - Используется в библиотеках валидации (class-validator)
  - Выдаст ошибку, если email не соответствует формату email
2. **@MinLength(6)**
  - Проверяет, что строка имеет минимальную длину 6 символов
  - Используется для валидации паролей

#### Как это работает под капотом:
Декораторы — это просто функции:
```
// Пример реализации декоратора MinLength
function MinLength(min: number) {
  return function (target: any, propertyKey: string) {
    // Регистрируем правило валидации
    registerValidationRule(target.constructor, propertyKey, {
      validator: (value: string) => value.length >= min,
      message: `${propertyKey} должен быть минимум ${min} символов`
    });
  };
}

// Использование:
class CreateUserDto {
  @MinLength(6)
  password: string;  // Декоратор добавляет проверку длины
}
```

#### Популярные библиотеки с декораторами:
1. class-validator (ваш случай)
   ```
    import { IsEmail, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

    class CreateUserDto {
      @IsEmail()
      email: string;

      @MinLength(6)
      @MaxLength(20)
      password: string;

      @IsNotEmpty()
      username: string;
    }
   ```
2. class-transformer
   ```
    import { Type, Expose } from 'class-transformer';

    class User {
      @Expose()
      id: number;

      @Type(() => Date)  // Преобразует строку в Date
      birthDate: Date;
    }
   ```
3. TypeORM (для работы с БД)
   ```
    import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

    @Entity()
    class User {
      @PrimaryGeneratedColumn()
      id: number;

      @Column()
      @IsEmail()  // Можно комбинировать декораторы
      email: string;
    }
   ```


#### Пример валидации:
  ```
    import { validate } from 'class-validator';

      class CreateUserDto {
        @IsEmail()
        email: string;
        
        @MinLength(6)
        password: string;
      }

      // Использование
      async function createUser(data: CreateUserDto) {
        const dto = Object.assign(new CreateUserDto(), data);
        const errors = await validate(dto);
        
        if (errors.length > 0) {
          console.log('Ошибки валидации:', errors);
          throw new Error('Некорректные данные');
        }
        
        // Если валидация прошла, создаем пользователя
      }
  ```