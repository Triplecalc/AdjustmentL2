'use client'

/**
 * Компонент шапки приложения
 * 
 * Содержит:
 * - Логотип и название
 * - Версию приложения
 * - Кнопку смены темы
 * - Кнопку блокировки
 */

import { Moon, Sun, Lock, Zap } from 'lucide-react'

interface HeaderProps {
  isDark: boolean
  onToggleTheme: () => void
  onLock: () => void
}

export function Header({ isDark, onToggleTheme, onLock }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1280px] mx-auto px-6 py-3.5 flex items-center justify-between">
        {/* Левая часть - логотип и название */}
        <div className="flex items-center gap-2 text-lg font-bold text-primary">
          <Zap className="w-5 h-5" />
          <span>Шаблоны</span>
        </div>
        
        {/* Правая часть - версия и действия */}
        <div className="flex flex-col items-end gap-2">
          {/* Бейдж версии */}
          <span className="bg-primary text-primary-foreground text-xs font-semibold 
                         px-2.5 py-0.5 rounded-full tracking-wide">
            v3.0
          </span>
          
          {/* Кнопки действий */}
          <div className="flex items-center gap-2.5">
            {/* Кнопка смены темы */}
            <button
              onClick={onToggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                        bg-secondary border border-border text-muted-foreground
                        hover:text-foreground hover:border-muted-foreground
                        text-sm transition-all"
              title="Сменить тему"
            >
              {isDark ? (
                <>
                  <Moon className="w-4 h-4" />
                  <span>Светлая</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4" />
                  <span>Тёмная</span>
                </>
              )}
            </button>
            
            {/* Кнопка блокировки */}
            <button
              onClick={onLock}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                        bg-secondary border border-border text-muted-foreground
                        hover:text-destructive hover:border-destructive
                        transition-all"
              title="Заблокировать"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
