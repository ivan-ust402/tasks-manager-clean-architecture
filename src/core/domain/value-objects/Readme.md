# Объекты-значения - "Документы/Сертификаты"
Value Object - объект-значение (неизменяемый)
```
src/core/domain/value-objects/
├── Email.vo.ts          # Email с валидацией
├── Money.vo.ts          # Деньги с валютой
├── Address.vo.ts        # Адрес
└── DateRange.vo.ts      # Период дат
```

## Особенности:
- Неизменяемые (immutable)
- Идентифицируются по значению, а не по ID
- Пример: new Email("test@mail.com") — всегда валидный email