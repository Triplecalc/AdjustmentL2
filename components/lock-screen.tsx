'use client'

/**
 * Экран блокировки
 * 
 * Показывается когда пользователь заблокировал систему.
 * При вводе пароля:
 * - Operator123 - разблокировка и показ основного контента
 * - OP123 - показ ложной страницы "В разработке"
 */

import { useState, useEffect, useRef } from 'react'
import { Lock, Unlock } from 'lucide-react'
import { verifyPasswordOnly } from '@/lib/auth'

interface LockScreenProps {
  onUnlock: () => void
  onFakeUnlock: () => void
}

export function LockScreen({ onUnlock, onFakeUnlock }: LockScreenProps) {
  // Состояние формы
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [shaking, setShaking] = useState(false)
  
  // Реф для поля пароля
  const passwordRef = useRef<HTMLInputElement>(null)

  // Автофокус при монтировании
  useEffect(() => {
    passwordRef.current?.focus()
  }, [])

  // Обработчик разблокировки
  const handleUnlock = () => {
    const result = verifyPasswordOnly(password)
    
    if (result === 'main') {
      // Правильный пароль - разблокируем
      setError(false)
      onUnlock()
      return
    }
    
    if (result === 'fake') {
      // Ложный пароль - показываем страницу "В разработке"
      setError(false)
      onFakeUnlock()
      return
    }
    
    // Неверный пароль
    setError(true)
    setShaking(true)
    setPassword('')
    passwordRef.current?.focus()
    
    setTimeout(() => setShaking(false), 300)
  }

  // Обработчик Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUnlock()
    }
  }

  return (
    <div className="fixed inset-0 z-[9000] login-bg-gradient flex items-center justify-center p-6">
      <div 
        className={`
          bg-card border border-border rounded-2xl p-10 w-full max-w-[400px]
          shadow-2xl animate-modal-in text-center
          ${shaking ? 'animate-shake' : ''}
        `}
      >
        {/* Иконка замка */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-warning to-destructive 
                       flex items-center justify-center mx-auto mb-5 shadow-lg shadow-warning/30">
          <Lock className="w-7 h-7 text-white" />
        </div>
        
        {/* Заголовок */}
        <h1 className="text-2xl font-bold text-foreground mb-1.5">
          Система заблокирована
        </h1>
        <p className="text-sm text-muted-foreground mb-7">
          Введите пароль для разблокировки
        </p>
        
        {/* Форма */}
        <div className="flex flex-col gap-3.5 text-left">
          {/* Поле пароля */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="lock-password" className="text-sm font-semibold text-muted-foreground">
              Пароль
            </label>
            <input
              ref={passwordRef}
              id="lock-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Введите пароль"
              autoComplete="current-password"
              className="w-full px-3.5 py-2.5 text-sm border border-border rounded-lg
                        bg-input text-foreground placeholder:text-muted-foreground
                        focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15
                        transition-all"
            />
          </div>
          
          {/* Ошибка */}
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/25
                           rounded-md px-3 py-2 text-center">
              Неверный пароль
            </div>
          )}
          
          {/* Кнопка разблокировки */}
          <button
            onClick={handleUnlock}
            className="w-full flex items-center justify-center gap-2 px-4 py-3
                      bg-primary hover:bg-primary/90 text-primary-foreground
                      rounded-lg text-[15px] font-medium mt-1
                      transition-all active:scale-[0.98]"
          >
            <Unlock className="w-4 h-4" />
            Разблокировать
          </button>
        </div>
      </div>
    </div>
  )
}
