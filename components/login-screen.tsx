'use client'

/**
 * Экран авторизации
 * 
 * Реализует вход с обфусцированными учетными данными:
 * - Основной логин: Operator / Operator123 - полный доступ
 * - Ложный логин: OP / OP123 - показывает страницу "В разработке"
 */

import { useState, useEffect, useRef } from 'react'
import { Zap, LogIn } from 'lucide-react'
import { verifyMainCredentials, verifyFakeCredentials } from '@/lib/auth'

interface LoginScreenProps {
  onLogin: () => void
  onFakeLogin: () => void
}

export function LoginScreen({ onLogin, onFakeLogin }: LoginScreenProps) {
  // Состояние формы
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [shaking, setShaking] = useState(false)
  
  // Рефы для фокуса
  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  // Автофокус на поле логина при монтировании
  useEffect(() => {
    usernameRef.current?.focus()
  }, [])

  // Обработчик входа
  const handleLogin = () => {
    // Проверяем основные учетные данные
    if (verifyMainCredentials(username, password)) {
      setError(false)
      onLogin()
      return
    }
    
    // Проверяем ложные учетные данные (для экстренной блокировки)
    if (verifyFakeCredentials(username, password)) {
      setError(false)
      onFakeLogin()
      return
    }
    
    // Неверные данные - показываем ошибку
    setError(true)
    setShaking(true)
    setPassword('')
    passwordRef.current?.focus()
    
    // Убираем анимацию тряски
    setTimeout(() => setShaking(false), 300)
  }

  // Обработчик нажатия Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin()
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
        {/* Логотип */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-500 
                       flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary/35">
          <Zap className="w-7 h-7 text-white" />
        </div>
        
        {/* Заголовок */}
        <h1 className="text-2xl font-bold text-foreground mb-1.5">
          Шаблоны МЭС
        </h1>
        <p className="text-sm text-muted-foreground mb-7">
          Войдите в систему для продолжения
        </p>
        
        {/* Форма */}
        <div className="flex flex-col gap-3.5 text-left">
          {/* Поле логина */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-username" className="text-sm font-semibold text-muted-foreground">
              Логин
            </label>
            <input
              ref={usernameRef}
              id="login-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Введите логин"
              autoComplete="username"
              className="w-full px-3.5 py-2.5 text-sm border border-border rounded-lg
                        bg-input text-foreground placeholder:text-muted-foreground
                        focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15
                        transition-all"
            />
          </div>
          
          {/* Поле пароля */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-password" className="text-sm font-semibold text-muted-foreground">
              Пароль
            </label>
            <input
              ref={passwordRef}
              id="login-password"
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
              Неверный логин или пароль
            </div>
          )}
          
          {/* Кнопка входа */}
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-2 px-4 py-3
                      bg-primary hover:bg-primary/90 text-primary-foreground
                      rounded-lg text-[15px] font-medium mt-1
                      transition-all active:scale-[0.98]"
          >
            <LogIn className="w-4 h-4" />
            Войти
          </button>
        </div>
      </div>
    </div>
  )
}
