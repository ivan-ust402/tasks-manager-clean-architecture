# Состояние (zustand / redux) - "Центральный архив"

```
  src/presentation/store/
  ├── auth.store.ts             # Состояние авторизации
  ├── cart.store.ts             # Состояние корзины
  ├── ui.store.ts               # UI состояние (тема, модалки)
  └── index.ts                  # Объединение stores
```

#### Пример с Zustand:

```
  const useCartStore = create<CartStore>((set) => ({
    items: [],
    addItem: (product) => set((state) => ({ 
      items: [...state.items, product] 
    })),
    removeItem: (id) => set((state) => ({
      items: state.items.filter(item => item.id !== id)
    }))
  }));
```