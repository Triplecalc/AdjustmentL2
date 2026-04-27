'use client'

/**
 * Компонент секции-аккордеона
 * 
 * Раскрывающийся блок для группировки форм.
 * При открытии занимает всю ширину сетки.
 */

import { ChevronDown, LucideIcon } from 'lucide-react'

interface AccordionSectionProps {
  title: string
  icon: LucideIcon
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}

export function AccordionSection({ 
  title, 
  icon: Icon, 
  isOpen, 
  onToggle, 
  children 
}: AccordionSectionProps) {
  return (
    <section 
      className={`
        bg-card border border-border rounded-xl overflow-hidden shadow-sm
        hover:shadow-md transition-shadow
        ${isOpen ? 'col-span-full' : ''}
      `}
    >
      {/* Заголовок-кнопка */}
      <button
        onClick={onToggle}
        className={`
          w-full flex items-center gap-3 px-5 py-4 text-left
          hover:bg-secondary/50 transition-colors
          ${isOpen ? 'border-b border-border' : ''}
        `}
      >
        {/* Иконка секции */}
        <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center
                       text-primary flex-shrink-0">
          <Icon className="w-4 h-4" />
        </div>
        
        {/* Название */}
        <span className="flex-1 font-semibold text-[15px] text-foreground">
          {title}
        </span>
        
        {/* Стрелка */}
        <ChevronDown 
          className={`
            w-4 h-4 text-muted-foreground transition-transform duration-200
            ${isOpen ? 'rotate-180' : ''}
          `}
        />
      </button>
      
      {/* Содержимое */}
      {isOpen && (
        <div className="p-5 flex flex-col gap-4 animate-fade-in">
          {children}
        </div>
      )}
    </section>
  )
}
