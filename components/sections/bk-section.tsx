'use client'

/**
 * Секция "БК"
 * 
 * Содержит:
 * - Заявка на подключение  
 * - Жалоба БК неисправен
 */

import { useState } from 'react'
import { Copy } from 'lucide-react'
import { FormCard, InputMd, InputLg } from '@/components/form-card'
import { copyToClipboard, transliterate, getCurrentDateTime } from '@/lib/helpers'
import { showToast } from '@/lib/store'

export function BkSection() {
  // === ЗАЯВКА НА ПОДКЛЮЧЕНИЕ ===
  const [connFio, setConnFio] = useState('')
  const [connPhone, setConnPhone] = useState('')
  
  // === ЖАЛОБА БК НЕИСПРАВЕН ===
  const [cFio, setCFio] = useState('')
  const [cPhone, setCPhone] = useState('')
  const [cBkNum, setCBkNum] = useState('')
  const [cDescription, setCDescription] = useState('')

  // Копировать заявку на подключение
  const handleCopyConnection = async () => {
    if (!connFio.trim()) {
      showToast('Введите ФИО', 'error')
      return
    }
    if (!connPhone.trim()) {
      showToast('Введите номер телефона', 'error')
      return
    }
    
    const fioTrans = transliterate(connFio)
    const text = `${fioTrans}, ${connPhone}`
    
    const success = await copyToClipboard(text)
    if (success) {
      showToast('Скопировано!')
      setConnFio(''); setConnPhone('')
    } else {
      showToast('Ошибка копирования', 'error')
    }
  }

  // Копировать жалобу БК неисправен
  const handleCopyComplaint = async () => {
    if (!cFio.trim()) {
      showToast('Введите ФИО', 'error')
      return
    }
    if (!cPhone.trim()) {
      showToast('Введите номер телефона', 'error')
      return
    }
    
    const dt = getCurrentDateTime()
    let text = `Жалоба на неисправность БК. ФИО: ${cFio}, тел: ${cPhone}.`
    
    if (cBkNum.trim()) {
      text += ` Номер БК: ${cBkNum}.`
    }
    if (cDescription.trim()) {
      text += ` Описание неисправности: ${cDescription}.`
    }
    text += ` Дата обращения: ${dt}.`
    
    const success = await copyToClipboard(text)
    if (success) {
      showToast('Скопировано!')
      setCFio(''); setCPhone(''); setCBkNum(''); setCDescription('')
    } else {
      showToast('Ошибка копирования', 'error')
    }
  }

  return (
    <>
      {/* Заявка на подключение */}
      <FormCard label="Заявка на подключение">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[160px]">
              <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
                ФИО <span className="text-destructive">*</span>
              </label>
              <InputLg 
                value={connFio}
                onChange={(e) => setConnFio(e.target.value)}
                placeholder="Иванов Иван Иванович"
                className="w-full"
              />
            </div>
            
            <div className="min-w-[160px]">
              <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
                Телефон <span className="text-destructive">*</span>
              </label>
              <InputMd 
                value={connPhone}
                onChange={(e) => setConnPhone(e.target.value)}
                placeholder="Номер телефона"
              />
            </div>
          </div>

          <button
            onClick={handleCopyConnection}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 
                      text-primary-foreground rounded-md text-sm font-medium transition-all active:scale-[0.97]"
          >
            <Copy className="w-4 h-4" />
            Скопировать
          </button>
        </div>
      </FormCard>

      {/* Жалоба БК неисправен */}
      <FormCard label="Жалоба БК неисправен">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[160px]">
              <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
                ФИО <span className="text-destructive">*</span>
              </label>
              <InputLg 
                value={cFio}
                onChange={(e) => setCFio(e.target.value)}
                placeholder="Иванов Иван Иванович"
                className="w-full"
              />
            </div>
            
            <div className="min-w-[160px]">
              <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
                Телефон <span className="text-destructive">*</span>
              </label>
              <InputMd 
                value={cPhone}
                onChange={(e) => setCPhone(e.target.value)}
                placeholder="Номер телефона"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="min-w-[160px]">
              <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
                Номер БК <span className="text-xs font-normal">(необязательно)</span>
              </label>
              <InputMd 
                value={cBkNum}
                onChange={(e) => setCBkNum(e.target.value)}
                placeholder="Номер БК"
              />
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
                Описание <span className="text-xs font-normal">(необязательно)</span>
              </label>
              <InputLg 
                value={cDescription}
                onChange={(e) => setCDescription(e.target.value)}
                placeholder="Опишите неисправность"
                className="w-full"
              />
            </div>
          </div>

          <button
            onClick={handleCopyComplaint}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 
                      text-primary-foreground rounded-md text-sm font-medium transition-all active:scale-[0.97]"
          >
            <Copy className="w-4 h-4" />
            Скопировать
          </button>
        </div>
      </FormCard>
    </>
  )
}
