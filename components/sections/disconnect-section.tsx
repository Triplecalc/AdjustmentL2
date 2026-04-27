'use client'

/**
 * Секция "Жалоба на отключение ЭЭ"
 * 
 * Содержит:
 * - Ошибочное отключение (МКД/ИЖД)
 * - Нарушен срок возобновления (с полем почты!)
 */

import { useState } from 'react'
import { Copy, AlertTriangle, Info, MapPin } from 'lucide-react'
import { FormCard, InputLg, InputDate } from '@/components/form-card'
import { copyToClipboard, toDisplayDate, getTodayISO } from '@/lib/helpers'
import { showToast } from '@/lib/store'

type ComplaintType = 'error' | 'delay' | null
type ObjectType = 'MKD' | 'IJD' | null
type ConfirmType = 'mail' | 'ko' | null

export function DisconnectSection() {
  // Тип жалобы
  const [complaintType, setComplaintType] = useState<ComplaintType>(null)
  // Тип объекта (для ошибочного)
  const [objectType, setObjectType] = useState<ObjectType>(null)
  // Тип подтверждения (для нарушен срок)
  const [confirmType, setConfirmType] = useState<ConfirmType>(null)
  
  // === Поля для ИЖД ===
  const [ijdPhone, setIjdPhone] = useState('')
  const [ijdDate, setIjdDate] = useState('')
  const [ijdHouse, setIjdHouse] = useState('')
  const [ijdInRegistry, setIjdInRegistry] = useState(false)
  const [ijdErrors, setIjdErrors] = useState<Record<string, boolean>>({})
  
  // === Поля для "Нарушен срок" ===
  const [complaintDate, setComplaintDate] = useState(getTodayISO())
  const [complaintPhone, setComplaintPhone] = useState('')
  const [pfzdrb, setPfzdrb] = useState('')
  const [paymentDate, setPaymentDate] = useState(getTodayISO())
  // НОВОЕ: Поле email для "Подтвердил через почту"
  const [confirmEmail, setConfirmEmail] = useState('')

  // Выбор типа жалобы
  const handleComplaintType = (type: ComplaintType) => {
    setComplaintType(type)
    setObjectType(null)
    setConfirmType(null)
  }

  // Копирование ИЖД
  const handleCopyIjd = async () => {
    const errors: Record<string, boolean> = {}
    if (!ijdPhone.trim()) errors.phone = true
    if (!ijdDate) errors.date = true
    
    if (Object.keys(errors).length > 0) {
      setIjdErrors(errors)
      showToast('Заполните обязательные поля', 'error')
      return
    }
    
    const date = toDisplayDate(ijdDate)
    let text = `Просьба проверить клиента и направить бригаду на факт ошибочного отключения. Номер клиента: ${ijdPhone}. Проверены реестры, статус контроля ЛС — отключения быть не должно. Со слов клиента, ${date} было отключение ЭЭ.`
    
    if (ijdHouse.trim()) {
      text += ` Предполагаемый номер дома отключенца: ${ijdHouse}.`
    }
    if (ijdInRegistry) {
      text += ' Адрес есть в реестре на отключение.'
    }
    
    const success = await copyToClipboard(text)
    if (success) {
      showToast('Скопировано!')
      setIjdPhone(''); setIjdDate(''); setIjdHouse(''); setIjdInRegistry(false)
      setIjdErrors({})
    } else {
      showToast('Ошибка копирования', 'error')
    }
  }

  // Копирование "Нарушен срок"
  const handleCopyComplaint = async () => {
    if (!complaintPhone.trim()) {
      showToast('Укажите телефон для связи', 'error')
      return
    }
    
    const cd = toDisplayDate(complaintDate)
    if (!cd) {
      showToast('Укажите дату оплаты', 'error')
      return
    }
    
    let text = ''
    
    if (confirmType === 'ko') {
      text = `Не выполнена оплаченная заявка на включение э/э №ХХХХ, оплаченная ${cd}. Подтверждение оплаты было в КО, тел. для связи ${complaintPhone}`
    } else if (confirmType === 'mail') {
      if (!pfzdrb.trim()) {
        showToast('Укажите номер заявки', 'error')
        return
      }
      const pd = toDisplayDate(paymentDate)
      // НОВОЕ: Включаем email в текст
      const emailPart = confirmEmail.trim() ? ` с эл. почты ${confirmEmail}` : ' с эл. почты кцук'
      text = `Не выполнена оплаченная заявка на включение э/э №${pfzdrb}, оплаченная ${cd}. Чек направлен ${pd}${emailPart}, тел. для связи ${complaintPhone}`
    } else {
      showToast('Выберите тип подтверждения', 'error')
      return
    }
    
    const success = await copyToClipboard(text)
    if (success) {
      showToast('Текст жалобы скопирован!')
      setComplaintPhone(''); setPfzdrb(''); setConfirmEmail('')
      setComplaintDate(getTodayISO()); setPaymentDate(getTodayISO())
      setConfirmType(null); setComplaintType(null)
    } else {
      showToast('Ошибка копирования', 'error')
    }
  }

  return (
    <FormCard>
      {/* Выбор типа жалобы */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-muted-foreground mb-2">
          Тип жалобы:
        </label>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => handleComplaintType('error')}
            className={`px-4 py-2 rounded-md text-sm font-medium border transition-all
              ${complaintType === 'error' 
                ? 'bg-primary text-primary-foreground border-primary' 
                : 'bg-input text-foreground border-border hover:bg-secondary hover:border-muted-foreground'}`}
          >
            Ошибочное отключение
          </button>
          <button
            onClick={() => handleComplaintType('delay')}
            className={`px-4 py-2 rounded-md text-sm font-medium border transition-all
              ${complaintType === 'delay' 
                ? 'bg-primary text-primary-foreground border-primary' 
                : 'bg-input text-foreground border-border hover:bg-secondary hover:border-muted-foreground'}`}
          >
            Нарушен срок возобновления
          </button>
        </div>
      </div>

      {/* === ВЕТКА: ОШИБОЧНОЕ ОТКЛЮЧЕНИЕ === */}
      {complaintType === 'error' && (
        <div className="animate-fade-in">
          {/* Выбор типа объекта */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-muted-foreground mb-2">
              Тип объекта:
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setObjectType('MKD')}
                className={`px-4 py-2 rounded-md text-sm font-medium border transition-all
                  ${objectType === 'MKD' 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-input text-foreground border-border hover:bg-secondary'}`}
              >
                МКД
              </button>
              <button
                onClick={() => setObjectType('IJD')}
                className={`px-4 py-2 rounded-md text-sm font-medium border transition-all
                  ${objectType === 'IJD' 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-input text-foreground border-border hover:bg-secondary'}`}
              >
                ИЖД
              </button>
            </div>
          </div>

          {/* МКД блок */}
          {objectType === 'MKD' && (
            <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">
                По данному вопросу обращаться строго на линию <strong>Консультант!</strong>
              </p>
            </div>
          )}

          {/* ИЖД блок */}
          {objectType === 'IJD' && (
            <div className="animate-fade-in space-y-4">
              {/* Подсказка */}
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="mb-2">
                      Выбери услугу <strong>«Консультация по восстановлению энергоснабжения»</strong> и «Переназначить» без выбора сотрудника:
                    </p>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>Москва / Новая Москва: <strong className="text-foreground">ООК</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>Московская область: <strong className="text-foreground">ТУ ЕИРЦ</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Поля формы */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
                    Номер телефона <span className="text-destructive">*</span>
                  </label>
                  <InputLg 
                    value={ijdPhone}
                    onChange={(e) => { setIjdPhone(e.target.value); setIjdErrors({...ijdErrors, phone: false}) }}
                    placeholder="Запросить у клиента, не копировать!"
                    error={ijdErrors.phone}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
                    Дата отключения <span className="text-destructive">*</span>
                  </label>
                  <InputDate 
                    value={ijdDate}
                    onChange={(e) => { setIjdDate(e.target.value); setIjdErrors({...ijdErrors, date: false}) }}
                    error={ijdErrors.date}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
                    Предполагаемый номер дома <span className="text-xs text-muted-foreground font-normal">(необязательно)</span>
                  </label>
                  <InputLg 
                    value={ijdHouse}
                    onChange={(e) => setIjdHouse(e.target.value)}
                    placeholder="Например: 12А"
                  />
                </div>
                
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={ijdInRegistry}
                    onChange={(e) => setIjdInRegistry(e.target.checked)}
                    className="w-4 h-4 rounded border-border accent-primary"
                  />
                  <span className="text-sm text-foreground">Адрес есть в реестре на отключение</span>
                </label>
              </div>

              <button
                onClick={handleCopyIjd}
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 
                          text-primary-foreground rounded-md text-sm font-medium transition-all active:scale-[0.97]"
              >
                <Copy className="w-4 h-4" />
                Скопировать
              </button>
            </div>
          )}
        </div>
      )}

      {/* === ВЕТКА: НАРУШЕН СРОК === */}
      {complaintType === 'delay' && (
        <div className="animate-fade-in space-y-4">
          {/* Тип подтверждения */}
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-2">
              Подтверждение:
            </label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setConfirmType('mail')}
                className={`px-4 py-2 rounded-md text-sm font-medium border transition-all
                  ${confirmType === 'mail' 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-input text-foreground border-border hover:bg-secondary'}`}
              >
                Подтвердил через почту
              </button>
              <button
                onClick={() => setConfirmType('ko')}
                className={`px-4 py-2 rounded-md text-sm font-medium border transition-all
                  ${confirmType === 'ko' 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-input text-foreground border-border hover:bg-secondary'}`}
              >
                Подтверждено в КО
              </button>
            </div>
          </div>

          {/* Дата оплаты */}
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
              Дата оплаты:
            </label>
            <InputDate 
              value={complaintDate}
              onChange={(e) => { setComplaintDate(e.target.value); setPaymentDate(e.target.value) }}
            />
          </div>

          {/* Телефон */}
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
              Телефон для связи:
            </label>
            <InputLg 
              value={complaintPhone}
              onChange={(e) => setComplaintPhone(e.target.value)}
              placeholder="Номер телефона"
            />
          </div>

          {/* Поля для "Подтвердил через почту" */}
          {confirmType === 'mail' && (
            <div className="animate-fade-in space-y-3">
              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
                  Номер заявки (номер договора):
                </label>
                <InputLg 
                  value={pfzdrb}
                  onChange={(e) => setPfzdrb(e.target.value)}
                  placeholder="Номер заявки"
                />
              </div>
              
              {/* НОВОЕ: Поле email */}
              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
                  E-mail клиента:
                </label>
                <InputLg 
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  placeholder="email@example.com"
                  type="email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
                  Дата отправки чека:
                </label>
                <InputDate 
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                />
              </div>
            </div>
          )}

          <button
            onClick={handleCopyComplaint}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 
                      text-primary-foreground rounded-md text-sm font-medium transition-all active:scale-[0.97]"
          >
            <Copy className="w-4 h-4" />
            Скопировать
          </button>
        </div>
      )}
    </FormCard>
  )
}
