/**
 * Вспомогательные функции для работы с датами, форматированием и копированием
 * Все комментарии на русском языке
 */

/**
 * Форматирует строку в формат ДД.ММ.ГГГГ
 * Убирает все нецифровые символы и добавляет точки
 */
export function formatDateInput(value: string): string {
  // Оставляем только цифры
  let digits = value.replace(/[^\d]/g, '')
  
  // Ограничиваем длину до 8 цифр
  if (digits.length > 8) digits = digits.slice(0, 8)
  
  // Форматируем в ДД.ММ.ГГГГ
  let formatted = ''
  if (digits.length > 4) {
    formatted = digits.slice(0, 2) + '.' + digits.slice(2, 4) + '.' + digits.slice(4)
  } else if (digits.length > 2) {
    formatted = digits.slice(0, 2) + '.' + digits.slice(2)
  } else {
    formatted = digits
  }
  
  return formatted
}

/**
 * Форматирует время в формат ЧЧ:ММ
 */
export function formatTimeInput(value: string): string {
  let digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length > 2) {
    return digits.slice(0, 2) + ':' + digits.slice(2)
  }
  return digits
}

/**
 * Конвертирует дату из YYYY-MM-DD в ДД.ММ.ГГГГ
 */
export function toDisplayDate(dateString: string): string {
  if (!dateString) return ''
  if (dateString.includes('.')) return dateString
  
  const [year, month, day] = dateString.split('-')
  return `${day}.${month}.${year}`
}

/**
 * Возвращает текущую дату в формате ДД.ММ.ГГГГ
 */
export function getCurrentDate(): string {
  const now = new Date()
  const day = String(now.getDate()).padStart(2, '0')
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year = now.getFullYear()
  return `${day}.${month}.${year}`
}

/**
 * Возвращает текущее время в формате ЧЧ:ММ
 */
export function getCurrentTime(): string {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

/**
 * Возвращает дату и время в формате "ДД.ММ.ГГГГ в ЧЧ:ММ"
 */
export function getCurrentDateTime(): string {
  return `${getCurrentDate()} в ${getCurrentTime()}`
}

/**
 * Возвращает дату месяц назад в формате YYYY-MM-DD
 */
export function getDateMonthAgo(): string {
  const date = new Date()
  date.setMonth(date.getMonth() - 1)
  return date.toISOString().split('T')[0]
}

/**
 * Возвращает сегодняшнюю дату в формате YYYY-MM-DD
 */
export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0]
}

/**
 * Возвращает название предыдущего месяца
 */
export function getPreviousMonthName(): string {
  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ]
  const now = new Date()
  const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1
  return months[prevMonth]
}

/**
 * Копирует текст в буфер обмена
 * @returns Promise<boolean> - успешно ли скопировано
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback для старых браузеров
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const success = document.execCommand('copy')
    document.body.removeChild(textarea)
    return success
  }
}

/**
 * Валидирует лицевой счет
 * Допустимые форматы: 8 цифр, 10 цифр, или XXXXX-XXX-XX
 */
export function validateLS(ls: string): boolean {
  // 8 цифр подряд
  if (/^\d{8}$/.test(ls)) return true
  // 10 цифр подряд
  if (/^\d{10}$/.test(ls)) return true
  // Формат XXXXX-XXX-XX
  if (/^\d{5}-\d{3}-\d{2}$/.test(ls)) return true
  return false
}

/**
 * Транслитерация русского текста на латиницу (для БК)
 */
export function transliterate(text: string): string {
  const map: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sh',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
  }
  
  return text
    .split(/\s+/)
    .map(word => {
      let result = ''
      for (let i = 0; i < word.length; i++) {
        const char = word[i].toLowerCase()
        if (char === 'ь') continue
        const translitChar = map[char] ?? char
        // Первую букву делаем заглавной
        result += i === 0 
          ? translitChar.charAt(0).toUpperCase() + translitChar.slice(1) 
          : translitChar
      }
      return result
    })
    .join(' ')
    // Очистка двойных окончаний
    .replace(/(\w+)iy\b/gi, '$1y')
    .replace(/(\w+)yy\b/gi, '$1y')
}

/**
 * Проверяет, является ли устройство мобильным
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  const isMobileUA = mobileRegex.test(navigator.userAgent)
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const isSmallScreen = window.innerWidth <= 768
  
  return isMobileUA || (isTouchDevice && isSmallScreen)
}
