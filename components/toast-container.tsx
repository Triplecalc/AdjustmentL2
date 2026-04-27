'use client'

/**
 * Компонент контейнера уведомлений (тостов)
 * Отображает всплывающие уведомления в правом верхнем углу
 */

import { useEffect, useState } from 'react'
import { getToasts, subscribeToasts, removeToast, type Toast } from '@/lib/store'
import { CheckCircle, XCircle } from 'lucide-react'

export function ToastContainer() {
  // Состояние уведомлений
  const [toasts, setToasts] = useState<Toast[]>([])
  // Отслеживаем анимацию выхода
  const [exitingIds, setExitingIds] = useState<Set<string>>(new Set())

  // Подписываемся на изменения хранилища
  useEffect(() => {
    // Инициализируем начальное состояние
    setToasts(getToasts())
    
    // Подписка на обновления
    const unsubscribe = subscribeToasts(() => {
      setToasts(getToasts())
    })
    
    return unsubscribe
  }, [])

  // Обработчик закрытия с анимацией
  const handleClose = (id: string) => {
    setExitingIds(prev => new Set(prev).add(id))
    
    // Удаляем после анимации
    setTimeout(() => {
      removeToast(id)
      setExitingIds(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, 250)
  }

  // Автоматическое закрытие
  useEffect(() => {
    const timers: NodeJS.Timeout[] = []
    
    toasts.forEach(toast => {
      if (!exitingIds.has(toast.id)) {
        const timer = setTimeout(() => {
          handleClose(toast.id)
        }, 2800)
        timers.push(timer)
      }
    })
    
    return () => timers.forEach(clearTimeout)
  }, [toasts, exitingIds])

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-5 right-5 z-[10000] flex flex-col gap-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`
            flex items-center gap-3 px-5 py-3 rounded-lg text-white text-sm font-medium
            shadow-lg pointer-events-auto cursor-pointer
            ${toast.type === 'success' ? 'bg-success' : 'bg-destructive'}
            ${exitingIds.has(toast.id) ? 'animate-toast-out' : 'animate-toast-in'}
          `}
          onClick={() => handleClose(toast.id)}
          role="alert"
        >
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  )
}
