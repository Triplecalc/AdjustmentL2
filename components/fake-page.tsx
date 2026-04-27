'use client'

/**
 * Ложная страница "Сайт в разработке"
 * 
 * Показывается при вводе ложных учетных данных (OP / OP123).
 * Скрывает весь функционал сайта для защиты данных.
 * Используется для экстренной блокировки доступа.
 */

import { Construction, Wrench, Clock } from 'lucide-react'

export function FakePage() {
  return (
    <div className="fixed inset-0 z-[9500] bg-background flex items-center justify-center p-6">
      <div className="text-center max-w-lg animate-fade-in">
        {/* Иконка */}
        <div className="w-24 h-24 rounded-full bg-warning/10 border-2 border-warning/30
                       flex items-center justify-center mx-auto mb-8">
          <Construction className="w-12 h-12 text-warning" />
        </div>
        
        {/* Заголовок */}
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Сайт находится в разработке
        </h1>
        
        {/* Описание */}
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          В данный момент проводятся технические работы. 
          Приносим извинения за временные неудобства.
        </p>
        
        {/* Информационные блоки */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-5 text-left">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wrench className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Обновление</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Идет обновление системы до новой версии
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-5 text-left">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-success" />
              </div>
              <h3 className="font-semibold text-foreground">Скоро</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Работы будут завершены в ближайшее время
            </p>
          </div>
        </div>
        
        {/* Анимированный индикатор загрузки */}
        <div className="flex items-center justify-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" 
                 style={{ animationDelay: '0ms' }} />
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" 
                 style={{ animationDelay: '150ms' }} />
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" 
                 style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-sm text-muted-foreground ml-2">
            Пожалуйста, подождите...
          </span>
        </div>
      </div>
    </div>
  )
}
