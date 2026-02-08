# Composition Root — "Главный распределительный щит"
```
  src/main/index.tsx
```


```
  // Инициализация всех зависимостей
  const userRepository = UserRepositoryFactory.create();
  const createUserUseCase = CreateUserUseCaseFactory.create(userRepository);

  // Создание провайдеров
  const rootStore = createRootStore();

  // Рендер приложения
  ReactDOM.render(
    <StoreProvider store={rootStore}>
      <QueryProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </QueryProvider>
    </StoreProvider>,
    document.getElementById('root')
  );
```

## Взаимодействие между слоями:

### Поток данных:
```
Пользователь → 
[Presentation] (нажатие кнопки) → 
[Hook] (вызов use case) → 
[Application] (обработка use case) → 
[Infrastructure] (сохранение в БД) → 
[Core] (валидация бизнес-правил) → 
[Application] (возврат результата) → 
[Presentation] (обновление UI)
```

### Правила зависимостей:
  - Core ← ничего (самодостаточный)
  - Application ← Core
  - Infrastructure ← Core + Application
  - Presentation ← Application (через интерфейсы)
  - Main ← все слои (композиция)

### Аналогия с рестораном:
  - Core: Рецепты блюд, стандарты качества
  - Application: Шеф-повар, который управляет кухней
  - Infrastructure: Кухонное оборудование, поставщики продуктов
  - Presentation: Официанты, меню, интерьер ресторана
  - Main: Владелец, который все это организовал

### Преимущества такой структуры: 
  - Тестируемость — каждый слой тестируется изолированно
  - Замена технологий — поменять БД или UI фреймворк без переписывания бизнес-логики
  - Масштабируемость — новые фичи добавляются в соответствующие слои
  - Поддержка — понятно, где искать код
  - Онбординг — новым разработчикам легче разобраться

**Эта архитектура требует больше кода на старте, но окупается на больших и долгосрочных проектах.**