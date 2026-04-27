'use client'

/**
 * Секция "ПУ"
 * 
 * Содержит:
 * - Заявка на ПУ (только тариф)
 * - Жалоба ПУ неисправен
 * - Инструкция "Проверить ПУ"
 */

import { useState } from 'react'
import { Copy, Info, CheckCircle, AlertTriangle } from 'lucide-react'
import { FormCard, InputMd, InputLg } from '@/components/form-card'
import { copyToClipboard, transliterate, getCurrentDateTime } from '@/lib/helpers'
import { showToast } from '@/lib/store'

const TARIFFS = [
  '1з однотарифный',
  '1з день/ночь',
  '1з пиковая зона',
  '3з однотарифный',
  '3з день/ночь',
  '3з пиковая зона',
]

export function MeterSection() {
  // === ЗАЯВКА НА ПУ ===
  const [mFio, setMFio] = useState('')
  const [mPhone, setMPhone] = useState('')
  const [mTariff, setMTariff] = useState('')
  
  // === ЖАЛОБА ПУ НЕИСПРАВЕН ===
  const [cFio, setCFio] = useState('')
  const [cPhone, setCPhone] = useState('')
  const [cPuNum, setCPuNum] = useState('')
  const [cDescription, setCDescription] = useState('')

  // Копировать заявку на ПУ
  const handleCopyMeter = async () => {
    if (!mFio.trim()) {
      showToast('Введите ФИО', 'error')
      return
    }
    if (!mPhone.trim()) {
      showToast('Введите номер телефона', 'error')
      return
    }
    if (!mTariff) {
      showToast('Выберите тариф ПУ', 'error')
      return
    }
    
    const fioTrans = transliterate(mFio)
    const text = `${fioTrans}, ${mPhone}, ${mTariff}`
    
    const success = await copyToClipboard(text)
    if (success) {
      showToast('Скопировано!')
      setMFio(''); setMPhone(''); setMTariff('')
    } else {
      showToast('Ошибка копирования', 'error')
    }
  }

  // Копировать жалобу ПУ неисправен
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
    let text = `Жалоба на неисправность ПУ. ФИО: ${cFio}, тел: ${cPhone}.`
    
    if (cPuNum.trim()) {
      text += ` Номер ПУ: ${cPuNum}.`
    }
    if (cDescription.trim()) {
      text += ` Описание неисправности: ${cDescription}.`
    }
    text += ` Дата обращения: ${dt}.`
    
    const success = await copyToClipboard(text)
    if (success) {
      showToast('Скопировано!')
      setCFio(''); setCPhone(''); setCPuNum(''); setCDescription('')
    } else {
      showToast('Ошибка копирования', 'error')
    }
  }

  return (
    <>
      {/* Заявка на ПУ */}
      <FormCard label="Заявка на ПУ (только тариф)">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[160px]">
              <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
                ФИО <span className="text-destructive">*</span>
              </label>
              <InputLg 
                value={mFio}
                onChange={(e) => setMFio(e.target.value)}
                placeholder="Иванов Иван Иванович"
                className="w-full"
              />
            </div>
            
            <div className="min-w-[160px]">
              <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
                Телефон <span className="text-destructive">*</span>
              </label>
              <InputMd 
                value={mPhone}
                onChange={(e) => setMPhone(e.target.value)}
                placeholder="Номер телефона"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-2">
              Тариф ПУ <span className="text-destructive">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {TARIFFS.map(tariff => (
                <button
                  key={tariff}
                  onClick={() => setMTariff(tariff)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all
                    ${mTariff === tariff 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'bg-input text-foreground border-border hover:bg-secondary'}`}
                >
                  {tariff}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleCopyMeter}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 
                      text-primary-foreground rounded-md text-sm font-medium transition-all active:scale-[0.97]"
          >
            <Copy className="w-4 h-4" />
            Скопировать
          </button>
        </div>
      </FormCard>

      {/* Жалоба ПУ неисправен */}
      <FormCard label="Жалоба ПУ неисправен">
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
                Номер ПУ <span className="text-xs font-normal">(необязательно)</span>
              </label>
              <InputMd 
                value={cPuNum}
                onChange={(e) => setCPuNum(e.target.value)}
                placeholder="Номер счётчика"
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

      {/* Инструкция "Проверить ПУ" */}
      <FormCard label="Инструкция: Проверить ПУ">
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-4 text-sm">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground mb-2">Алгоритм проверки ПУ:</p>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Открой вкладку <strong className="text-foreground">«ЛКК»</strong> → <strong className="text-foreground">«ПУ»</strong></li>
                <li>Проверь <strong className="text-foreground">тип ПУ</strong> (однофазный/трёхфазный)</li>
                <li>Сверь <strong className="text-foreground">показания</strong> с тарифами</li>
                <li>Проверь <strong className="text-foreground">дату поверки</strong></li>
              </ol>
            </div>
          </div>
          
          <div className="flex items-start gap-3 pt-2 border-t border-border">
            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <p className="text-muted-foreground">
              <strong className="text-foreground">Важно:</strong> Если срок поверки истёк — ПУ необходимо заменить!
            </p>
          </div>
          
          <div className="flex items-start gap-3 pt-2 border-t border-border">
            <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <p className="text-muted-foreground">
              Если всё в порядке — можно передавать показания.
            </p>
          </div>
        </div>
      </FormCard>
    </>
  )
}
