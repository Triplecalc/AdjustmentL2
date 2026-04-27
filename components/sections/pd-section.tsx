'use client'

/**
 * Секция "Жалоба на сроки доставки ПД"
 * 
 * Таблица с готовыми шаблонами для копирования
 */

import { useState, useMemo } from 'react'
import { Copy, Check } from 'lucide-react'
import { FormCard } from '@/components/form-card'
import { copyToClipboard, getPreviousMonthName } from '@/lib/helpers'
import { showToast } from '@/lib/store'

export function PdSection() {
  // Отслеживаем какая строка была скопирована
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  
  // Название предыдущего месяца
  const prevMonth = useMemo(() => getPreviousMonthName(), [])
  
  // Шаблоны строк
  const rows = useMemo(() => [
    `Клиент не получил квитанцию за ${prevMonth} (месяц). В ЛС адрес клиента указан верно (сотрудник должен сверить адрес доставки ПД);`,
    `Клиент не получил квитанцию за ${prevMonth} (месяц). В ЛС адрес клиента указан верно. Со слов клиента квитанции за ${prevMonth} (месяц) не получил весь дом.`,
    `Клиент не получил квитанцию за ${prevMonth} (месяц). Альтернативный адрес сверен.`,
    `Клиент не получил квитанцию за ${prevMonth} (месяц). В ЛС адрес клиента указан верно. Квитанции разбросаны по всей улице (дому).`,
  ], [prevMonth])

  // Обработчик копирования
  const handleCopy = async (text: string, index: number) => {
    const success = await copyToClipboard(text)
    
    if (success) {
      showToast('Скопировано!')
      setCopiedIndex(index)
      
      // Убираем индикатор через 1.2 секунды
      setTimeout(() => {
        setCopiedIndex(null)
      }, 1200)
    } else {
      showToast('Ошибка копирования', 'error')
    }
  }

  return (
    <FormCard>
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row, index) => (
            <tr 
              key={index}
              className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
            >
              <td className="py-2.5 px-3 leading-relaxed">
                {row}
              </td>
              <td className="py-2.5 px-3 w-[110px] text-right">
                <button
                  onClick={() => handleCopy(row, index)}
                  className={`
                    inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium
                    border transition-all whitespace-nowrap
                    ${copiedIndex === index
                      ? 'bg-success text-success-foreground border-success'
                      : 'bg-secondary text-primary border-border hover:bg-primary hover:text-primary-foreground hover:border-primary'
                    }
                  `}
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="w-3 h-3" />
                      Готово
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Копировать
                    </>
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </FormCard>
  )
}
