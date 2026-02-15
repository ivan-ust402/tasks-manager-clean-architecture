/**
 * Абстракция над localStorage с обработкой ошибок
 * и типизированными методами
 */
export class LocalStorage {
  /**
   * Сохранить данные в localStorage
   * @param key - ключ
   * @param value - значение (автоматически преобразуется в JSON)
   * @param options - опции сохранения
   */
  set<T>(key: string, value: T, options?: StorageOptions): void {
    try {
      // Проверка доступности localStorage
      if (!this.isStorageAvailable()) {
        throw new Error('localStorage is not available');
      }

      // Проверка размера данных
      const serializedValue = JSON.stringify(value);
      
      if (options?.maxSize && serializedValue.length > options.maxSize) {
        throw new Error(`Data size exceeds maximum allowed size of ${options.maxSize} bytes`);
      }

      // Сохранение с префиксом (опционально)
      const storageKey = options?.prefix ? `${options.prefix}_${key}` : key;
      
      window.localStorage.setItem(storageKey, serializedValue);
      
      // Логирование в development режиме
      if (import.meta.env.MODE === 'development') {
        console.log(`[LocalStorage] Saved ${storageKey}:`, value);
      }
    } catch (error) {
      console.error(`[LocalStorage] Failed to save ${key}:`, error);
      
      // Fallback - пробуем очистить устаревшие данные
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.handleQuotaExceeded(key, value);
      }
    }
  }

  /**
   * Получить данные из localStorage
   * @param key - ключ
   * @param defaultValue - значение по умолчанию если данных нет
   * @param options - опции получения
   */
  get<T>(key: string, defaultValue?: T, options?: StorageOptions): T | null {
    try {
      if (!this.isStorageAvailable()) {
        return defaultValue ?? null;
      }

      const storageKey = options?.prefix ? `${options.prefix}_${key}` : key;
      const item = window.localStorage.getItem(storageKey);

      if (!item) {
        return defaultValue ?? null;
      }

      const parsed = JSON.parse(item) as T;
      
      // Проверка на устаревание данных
      if (options?.ttl) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const storedItem = parsed as any;
        if (storedItem._timestamp && Date.now() - storedItem._timestamp > options.ttl) {
          this.remove(key, options);
          return defaultValue ?? null;
        }
      }

      return parsed;
    } catch (error) {
      console.error(`[LocalStorage] Failed to get ${key}:`, error);
      return defaultValue ?? null;
    }
  }

  /**
   * Удалить данные из localStorage
   */
  remove(key: string, options?: StorageOptions): void {
    try {
      if (!this.isStorageAvailable()) return;

      const storageKey = options?.prefix ? `${options.prefix}_${key}` : key;
      window.localStorage.removeItem(storageKey);
      
      if (import.meta.env.MODE === 'development') {
        console.log(`[LocalStorage] Removed ${storageKey}`);
      }
    } catch (error) {
      console.error(`[LocalStorage] Failed to remove ${key}:`, error);
    }
  }

  /**
   * Очистить все данные с определенным префиксом
   */
  clearWithPrefix(prefix: string): void {
    try {
      if (!this.isStorageAvailable()) return;

      const keysToRemove: string[] = [];
      
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => window.localStorage.removeItem(key));
      
      if (import.meta.env.MODE === 'development') {
        console.log(`[LocalStorage] Cleared ${keysToRemove.length} items with prefix "${prefix}"`);
      }
    } catch (error) {
      console.error(`[LocalStorage] Failed to clear prefix ${prefix}:`, error);
    }
  }

  /**
   * Получить все ключи
   */
  keys(): string[] {
    try {
      if (!this.isStorageAvailable()) return [];

      const keys: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key) keys.push(key);
      }
      
      return keys;
    } catch (error) {
      console.error('[LocalStorage] Failed to get keys:', error);
      return [];
    }
  }

  /**
   * Получить размер localStorage в байтах
   */
  getSize(): number {
    try {
      if (!this.isStorageAvailable()) return 0;

      let total = 0;
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        const value = window.localStorage.getItem(key!);
        total += (key?.length || 0) + (value?.length || 0);
      }
      
      return total;
    } catch (error) {
      console.error('[LocalStorage] Failed to get size:', error);
      return 0;
    }
  }

  /**
   * Сохранить с меткой времени (для кэширования)
   */
  setWithTTL<T>(key: string, value: T, ttl: number, options?: StorageOptions): void {
    const dataWithTimestamp = {
      _timestamp: Date.now(),
      _ttl: ttl,
      data: value
    };
    
    this.set(key, dataWithTimestamp, options);
  }

  /**
   * Получить данные с проверкой TTL
   */
  getWithTTL<T>(key: string, options?: StorageOptions): T | null {
    const data = this.get<{ _timestamp: number; _ttl: number; data: T }>(key, undefined, options);
    
    if (!data) return null;
    
    if (Date.now() - data._timestamp > data._ttl) {
      this.remove(key, options);
      return null;
    }
    
    return data.data;
  }

  /**
   * Проверить доступность localStorage
   */
  private isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      window.localStorage.setItem(test, test);
      window.localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.log(e)
      return false;
    }
  }

  /**
   * Обработка превышения квоты
   */
  private handleQuotaExceeded(key: string, value: unknown): void {
    // Пытаемся освободить место - удаляем самые старые записи
    const items: Array<{ key: string; timestamp: number }> = [];
    
    for (let i = 0; i < window.localStorage.length; i++) {
      const storageKey = window.localStorage.key(i);
      if (!storageKey) continue;
      
      try {
        const item = window.localStorage.getItem(storageKey);
        if (item) {
          const parsed = JSON.parse(item);
          if (parsed._timestamp) {
            items.push({ key: storageKey, timestamp: parsed._timestamp });
          }
        }
      } catch {
        // Если не можем распарсить, пропускаем
        continue;
      }
    }
    
    // Сортируем по времени и удаляем 20% самых старых
    items.sort((a, b) => a.timestamp - b.timestamp);
    const removeCount = Math.max(1, Math.floor(items.length * 0.2));
    
    items.slice(0, removeCount).forEach(item => {
      window.localStorage.removeItem(item.key);
      console.log(`[LocalStorage] Removed old item ${item.key} to free space`);
    });
    
    // Пробуем сохранить снова
    this.set(key, value);
  }

  /**
   * Подписка на изменения localStorage в других вкладках
   */
  subscribe(key: string, callback: (newValue: unknown) => void): () => void {
    const handler = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          callback(parsed);
        } catch {
          callback(event.newValue);
        }
      }
    };

    window.addEventListener('storage', handler);
    
    // Возвращаем функцию отписки
    return () => window.removeEventListener('storage', handler);
  }
}

/**
 * Опции для localStorage операций
 */
export interface StorageOptions {
  /** Префикс для ключа (чтобы избежать конфликтов) */
  prefix?: string;
  /** Время жизни в миллисекундах */
  ttl?: number;
  /** Максимальный размер данных в байтах */
  maxSize?: number;
}

/**
 * Константы для localStorage
 */
export const STORAGE_KEYS = {
  TASKS: 'tasks',
  PROJECTS: 'projects',
  USER: 'user',
  SETTINGS: 'settings',
  THEME: 'theme',
  AUTH_TOKEN: 'auth_token',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];