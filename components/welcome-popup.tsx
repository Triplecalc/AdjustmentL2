'use client'

/**
 * Popup предупреждение при открытии сайта
 * 
 * Показывается при каждом открытии/обновлении страницы.
 * Напоминает заблокировать скрипт перед уходом с рабочего места.
 * Также содержит данные для экстренной блокировки (ложный логин/пароль).
 */

import { useState } from 'react'
import { AlertTriangle, X, Lock, Shield } from 'lucide-react'
import { getFakeCredentialsForDisplay } from '@/lib/auth'

interface WelcomePopupProps {
  onClose: () => void
}

export function WelcomePopup({ onClose }: WelcomePopupProps) {
  const [isClosing, setIsClosing] = useState(false)
  
  // Получаем ложные учетные данные для отображения
  const fakeCredentials = getFakeCredentialsForDisplay()

  // Обработчик закрытия с анимацией
  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
    }, 200)
  }

  return (
    <div 
      className={`
        fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm
        flex items-center justify-center p-6
        ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}
      `}
      onClick={handleClose}
    >
      <div 
        className={`
          bg-card border border-border rounded-2xl p-8 w-full max-w-lg
          shadow-2xl relative
          ${isClosing ? 'animate-modal-out' : 'animate-modal-in'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Кнопка закрытия */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted/50 
                    text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Иконка предупреждения */}
        <div className="w-16 h-16 rounded-2xl bg-warning/10 border border-warning/30
                       flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-8 h-8 text-warning" />
        </div>
        
        {/* Заголовок */}
        <h2 className="text-xl font-bold text-foreground text-center mb-4">
          Важное предупреждение
        </h2>
        
        {/* Основной текст */}
        <div className="bg-warning/5 border border-warning/20 rounded-xl p-4 mb-5">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground leading-relaxed">
              <strong className="text-warning">Заблокируйте скрипт</strong> (кнопка 
              <span className="inline-flex items-center mx-1 px-2 py-0.5 bg-muted rounded text-xs">
                <Lock className="w-3 h-3 mr-1" />
              </span>
              рядом с кнопкой темы) перед тем, как покидаете свое рабочее место!
            </p>
          </div>
        </div>
        
        {/* Блок с данными для экстренной блокировки */}
        <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-destructive mb-2">
                Экстренная блокировка
              </p>
              <p className="text-xs text-muted-foreground mb-2">
                Для скрытия всех данных введите:
              </p>
              <div className="flex gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Логин: </span>
                  <code className="bg-muted px-2 py-0.5 rounded font-mono text-foreground">
                    {fakeCredentials.login}
                  </code>
                </div>
                <div>
                  <span className="text-muted-foreground">Пароль: </span>
                  <code className="bg-muted px-2 py-0.5 rounded font-mono text-foreground">
                    {fakeCredentials.password}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Кнопка подтверждения */}
        <button
          onClick={handleClose}
          className="w-full flex items-center justify-center gap-2 px-4 py-3
                    bg-primary hover:bg-primary/90 text-primary-foreground
                    rounded-lg font-medium transition-all active:scale-[0.98]"
        >
          Понятно
        </button>
      </div>
    </div>
  )
}
