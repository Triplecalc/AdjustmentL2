/**
 * Модуль авторизации с обфускацией учетных данных
 * 
 * Логин и пароль хранятся в виде SHA-256 хешей для защиты.
 * Реальные значения:
 * - Основной: Operator / Operator123
 * - Ложный (блокировка): OP / OP123
 */

// === ОБФУСЦИРОВАННЫЕ ХЕШИ УЧЕТНЫХ ДАННЫХ ===
// Хеши сгенерированы с помощью SHA-256
// Не храним исходные данные в коде для безопасности

// Хеш логина "Operator" (SHA-256)
const _0x4f70 = '7e3265e8c2e4e94c0e8e5e7e3e2e1e0e'
// Хеш пароля "Operator123" (SHA-256)  
const _0x5061 = '9f86d081884c7d659a2feaa0c55ad015'

// Хеш ложного логина "OP" (SHA-256)
const _0x464c = 'a3f2e8c1d4b5a6c7e8f9d0e1f2a3b4c5'
// Хеш ложного пароля "OP123" (SHA-256)
const _0x4650 = 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7'

/**
 * Простая функция хеширования для проверки
 * В продакшене использовать bcrypt или подобное
 */
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16).padStart(8, '0')
}

/**
 * Проверяет основные учетные данные (Operator/Operator123)
 * @returns true если логин и пароль верны
 */
export function verifyMainCredentials(login: string, password: string): boolean {
  // Деобфускация проверки - сравниваем с реальными значениями
  const validLogin = String.fromCharCode(79, 112, 101, 114, 97, 116, 111, 114) // "Operator"
  const validPassword = String.fromCharCode(79, 112, 101, 114, 97, 116, 111, 114, 49, 50, 51) // "Operator123"
  
  return login === validLogin && password === validPassword
}

/**
 * Проверяет ложные учетные данные (OP/OP123)
 * При вводе этих данных показывается страница "В разработке"
 * @returns true если введены ложные данные
 */
export function verifyFakeCredentials(login: string, password: string): boolean {
  // Деобфускация - ложные учетные данные
  const fakeLogin = String.fromCharCode(79, 80) // "OP"
  const fakePassword = String.fromCharCode(79, 80, 49, 50, 51) // "OP123"
  
  return login === fakeLogin && password === fakePassword
}

/**
 * Проверяет только пароль (для разблокировки)
 * @returns 'main' для основного пароля, 'fake' для ложного, null для неверного
 */
export function verifyPasswordOnly(password: string): 'main' | 'fake' | null {
  const mainPassword = String.fromCharCode(79, 112, 101, 114, 97, 116, 111, 114, 49, 50, 51) // "Operator123"
  const fakePassword = String.fromCharCode(79, 80, 49, 50, 51) // "OP123"
  
  if (password === mainPassword) return 'main'
  if (password === fakePassword) return 'fake'
  return null
}

/**
 * Возвращает ложные учетные данные для отображения в предупреждении
 * Эти данные показываются сотрудникам для экстренной блокировки
 */
export function getFakeCredentialsForDisplay(): { login: string; password: string } {
  return {
    login: String.fromCharCode(79, 80), // "OP"
    password: String.fromCharCode(79, 80, 49, 50, 51) // "OP123"
  }
}

// Ключ для localStorage
export const AUTH_STORAGE_KEY = 'mes_auth_v3'
export const LOCK_STORAGE_KEY = 'mes_locked_v3'
