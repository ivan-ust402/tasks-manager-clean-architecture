# Страницы - этажи здания 

```
  src/presentation/pages/
  ├── auth/
  │   ├── login/
  │   └── register/
  ├── products/
  │   ├── list/
  │   └── [id]/
  ├── cart/
  └── profile/
```

#### Для Next.js App Router:
```
  app/
  ├── (auth)/
  │   ├── login/
  │   │   └── page.tsx           // Страница логина
  │   └── register/
  ├── products/
  │   ├── page.tsx               // Список продуктов
  │   └── [id]/
  │       └── page.tsx          // Детали продукта
  └── cart/page.tsx
```