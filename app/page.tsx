'use client'

/**
 * Главная страница приложения "Шаблоны МЭС"
 * 
 * Реализует:
 * - Систему авторизации с обфусцированными учетными данными
 * - Блокировку системы
 * - Ложную страницу "В разработке"
 * - Welcome popup с предупреждением
 * - Темную/светлую тему
 * - Аккордеоны с формами
 */

import { useState, useEffect } from 'react'
import { 
  FileEdit, 
  FileText, 
  Zap, 
  ArrowLeftRight, 
  Gauge, 
  CreditCard, 
  Mail, 
  Settings2 
} from 'lucide-react'

// Компоненты UI
import { ToastContainer } from '@/components/toast-container'
import { LoginScreen } from '@/components/login-screen'
import { LockScreen } from '@/components/lock-screen'
import { FakePage } from '@/components/fake-page'
import { WelcomePopup } from '@/components/welcome-popup'
import { Header } from '@/components/header'
import { AccordionSection } from '@/components/accordion-section'

// Секции форм
import { CorrectionsSection } from '@/components/sections/corrections-section'
import { PdSection } from '@/components/sections/pd-section'
import { DisconnectSection } from '@/components/sections/disconnect-section'
import { TransfersSection } from '@/components/sections/transfers-section'
import { MeterSection } from '@/components/sections/meter-section'
import { BkSection } from '@/components/sections/bk-section'
import { EmailsSection } from '@/components/sections/emails-section'
import { MiscSection } from '@/components/sections/misc-section'

// Утилиты
import { AUTH_STORAGE_KEY, LOCK_STORAGE_KEY } from '@/lib/auth'

// Типы состояния приложения
type AppState = 'loading' | 'login' | 'locked' | 'fake' | 'main'

// Конфигурация секций аккордеона
const ACCORDION_SECTIONS = [
  { id: 'corrections', title: 'Корректировки', icon: FileEdit },
  { id: 'pd', title: 'Жалоба на сроки доставки ПД', icon: FileText },
  { id: 'disconnect', title: 'Жалоба на отключение ЭЭ', icon: Zap },
  { id: 'transfers', title: 'Некорректные переводы', icon: ArrowLeftRight },
  { id: 'meter', title: 'ПУ', icon: Gauge },
  { id: 'bk', title: 'БК', icon: CreditCard },
  { id: 'emails', title: 'Шаблоны писем', icon: Mail },
  { id: 'misc', title: 'Прочее', icon: Settings2 },
]

export default function HomePage() {
  // === СОСТОЯНИЕ ПРИЛОЖЕНИЯ ===
  const [appState, setAppState] = useState<AppState>('loading')
  const [isDark, setIsDark] = useState(true)
  const [showWelcome, setShowWelcome] = useState(false)
  const [openSection, setOpenSection] = useState<string | null>(null)

  // === ИНИЦИАЛИЗАЦИЯ ===
  useEffect(() => {
    // Проверяем состояние авторизации из localStorage
    const isLocked = localStorage.getItem(LOCK_STORAGE_KEY) === 'true'
    const isAuth = localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
    
    // Проверяем сохраненную тему
    const savedTheme = localStorage.getItem('mes_theme')
    if (savedTheme === 'light') {
      setIsDark(false)
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
    }
    
    if (isLocked) {
      setAppState('locked')
    } else if (isAuth) {
      setAppState('main')
      setShowWelcome(true)
    } else {
      setAppState('login')
    }
  }, [])

  // === ОБРАБОТЧИКИ АВТОРИЗАЦИИ ===
  
  // Успешный вход с основными учетными данными
  const handleLogin = () => {
    localStorage.setItem(AUTH_STORAGE_KEY, 'true')
    localStorage.removeItem(LOCK_STORAGE_KEY)
    setAppState('main')
    setShowWelcome(true)
  }

  // Вход с ложными учетными данными
  const handleFakeLogin = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    localStorage.removeItem(LOCK_STORAGE_KEY)
    setAppState('fake')
  }

  // Блокировка системы
  const handleLock = () => {
    localStorage.setItem(LOCK_STORAGE_KEY, 'true')
    setAppState('locked')
  }

  // Разблокировка с основным паролем
  const handleUnlock = () => {
    localStorage.removeItem(LOCK_STORAGE_KEY)
    setAppState('main')
    setShowWelcome(true)
  }

  // Разблокировка с ложным паролем
  const handleFakeUnlock = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    localStorage.removeItem(LOCK_STORAGE_KEY)
    setAppState('fake')
  }

  // === СМЕНА ТЕМЫ ===
  const toggleTheme = () => {
    const newDark = !isDark
    setIsDark(newDark)
    
    if (newDark) {
      document.documentElement.classList.remove('light')
      document.documentElement.classList.add('dark')
      localStorage.setItem('mes_theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
      localStorage.setItem('mes_theme', 'light')
    }
  }

  // === ПЕРЕКЛЮЧЕНИЕ АККОРДЕОНА ===
  const toggleSection = (id: string) => {
    setOpenSection(prev => prev === id ? null : id)
  }

  // === РЕНДЕР СОДЕРЖИМОГО СЕКЦИИ ===
  const renderSectionContent = (id: string) => {
    switch (id) {
      case 'corrections': return <CorrectionsSection />
      case 'pd': return <PdSection />
      case 'disconnect': return <DisconnectSection />
      case 'transfers': return <TransfersSection />
      case 'meter': return <MeterSection />
      case 'bk': return <BkSection />
      case 'emails': return <EmailsSection />
      case 'misc': return <MiscSection />
      default: return null
    }
  }

  // === РЕНДЕР ===
  
  // Загрузка
  if (appState === 'loading') {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    )
  }

  // Экран входа
  if (appState === 'login') {
    return (
      <>
        <LoginScreen onLogin={handleLogin} onFakeLogin={handleFakeLogin} />
        <ToastContainer />
      </>
    )
  }

  // Экран блокировки
  if (appState === 'locked') {
    return (
      <>
        <LockScreen onUnlock={handleUnlock} onFakeUnlock={handleFakeUnlock} />
        <ToastContainer />
      </>
    )
  }

  // Ложная страница "В разработке"
  if (appState === 'fake') {
    return <FakePage />
  }

  // Основное приложение
  return (
    <div className="min-h-screen bg-background">
      {/* Шапка */}
      <Header 
        isDark={isDark} 
        onToggleTheme={toggleTheme} 
        onLock={handleLock} 
      />

      {/* Основной контент */}
      <main className="max-w-[1280px] mx-auto px-6 py-8">
        {/* Сетка аккордеонов */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ACCORDION_SECTIONS.map(section => (
            <AccordionSection
              key={section.id}
              title={section.title}
              icon={section.icon}
              isOpen={openSection === section.id}
              onToggle={() => toggleSection(section.id)}
            >
              {renderSectionContent(section.id)}
            </AccordionSection>
          ))}
        </div>
      </main>

      {/* Футер */}
      <footer className="text-center py-6 text-sm text-muted-foreground">
        © 2024 Шаблоны МЭС v3.0
      </footer>

      {/* Welcome popup */}
      {showWelcome && (
        <WelcomePopup onClose={() => setShowWelcome(false)} />
      )}

      {/* Контейнер уведомлений */}
      <ToastContainer />
    </div>
  )
}
