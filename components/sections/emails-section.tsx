'use client'

/**
 * Секция "Шаблоны писем"
 * 
 * Содержит кнопки с предустановленными шаблонами:
 * - МКД (серый)
 * - ИГД/АСУМБ (зеленый)
 * - ИГД (оранжевый)
 * - ПД (синий)
 * - Акт (голубой)
 */

import { useState } from 'react'
import { Copy, Check, Home, Building2, Mail, FileText, FileCheck } from 'lucide-react'
import { FormCard } from '@/components/form-card'
import { copyToClipboard } from '@/lib/helpers'
import { showToast, EMAIL_TEMPLATES } from '@/lib/store'

// Конфигурация кнопок
const EMAIL_BUTTONS = [
  { 
    key: 'MKD', 
    label: 'МКД',
    icon: Building2,
    className: 'btn-gradient-mkd hover:opacity-90'
  },
  { 
    key: 'IGD_asumb', 
    label: 'ИГД/АСУМБ',
    icon: Home,
    className: 'btn-gradient-igd-asumb hover:opacity-90'
  },
  { 
    key: 'IGD', 
    label: 'ИГД',
    icon: Home,
    className: 'btn-gradient-igd hover:opacity-90'
  },
  { 
    key: 'PD', 
    label: 'ПД',
    icon: Mail,
    className: 'btn-gradient-pd hover:opacity-90'
  },
  { 
    key: 'Akt', 
    label: 'Акт',
    icon: FileCheck,
    className: 'btn-gradient-akt hover:opacity-90'
  },
]

export function EmailsSection() {
  // Отслеживаем какая кнопка была нажата
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  // Показать превью шаблона
  const [previewKey, setPreviewKey] = useState<string | null>(null)

  // Обработчик копирования
  const handleCopy = async (key: string) => {
    const template = EMAIL_TEMPLATES[key]
    if (!template) return
    
    const success = await copyToClipboard(template)
    
    if (success) {
      showToast('Шаблон скопирован!')
      setCopiedKey(key)
      
      setTimeout(() => {
        setCopiedKey(null)
      }, 1200)
    } else {
      showToast('Ошибка копирования', 'error')
    }
  }

  // Переключение превью
  const togglePreview = (key: string) => {
    setPreviewKey(prev => prev === key ? null : key)
  }

  return (
    <FormCard>
      {/* Кнопки шаблонов */}
      <div className="flex flex-wrap gap-3 mb-4">
        {EMAIL_BUTTONS.map(({ key, label, icon: Icon, className }) => (
          <div key={key} className="flex flex-col gap-1">
            <button
              onClick={() => handleCopy(key)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold
                text-white shadow-md transition-all active:scale-[0.97]
                ${className}
              `}
            >
              {copiedKey === key ? (
                <>
                  <Check className="w-4 h-4" />
                  Скопировано!
                </>
              ) : (
                <>
                  <Icon className="w-4 h-4" />
                  {label}
                </>
              )}
            </button>
            
            {/* Кнопка превью */}
            <button
              onClick={() => togglePreview(key)}
              className="text-xs text-muted-foreground hover:text-primary underline transition-colors"
            >
              {previewKey === key ? 'Скрыть' : 'Показать текст'}
            </button>
          </div>
        ))}
      </div>

      {/* Превью шаблона */}
      {previewKey && EMAIL_TEMPLATES[previewKey] && (
        <div className="bg-secondary/30 border border-border rounded-lg p-4 mt-4 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-foreground">
              Превью: {EMAIL_BUTTONS.find(b => b.key === previewKey)?.label}
            </span>
            <button
              onClick={() => handleCopy(previewKey)}
              className="flex items-center gap-1.5 px-3 py-1 bg-primary hover:bg-primary/90
                        text-primary-foreground rounded text-xs font-medium transition-all"
            >
              <Copy className="w-3 h-3" />
              Копировать
            </button>
          </div>
          <pre className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto">
            {EMAIL_TEMPLATES[previewKey]}
          </pre>
        </div>
      )}

      {/* Подсказка */}
      <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
        <FileText className="w-4 h-4" />
        <span>Нажмите на кнопку, чтобы скопировать шаблон письма в буфер обмена</span>
      </div>
    </FormCard>
  )
}
