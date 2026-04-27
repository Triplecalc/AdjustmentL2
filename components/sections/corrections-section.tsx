'use client'

/**
 * Секция "Корректировки"
 * 
 * Содержит формы для:
 * - Не согласен с показаниями «Сети»
 * - Ошибочно переданные показания клиентом
 * - Автоматическая корректировка
 */

import { useState } from 'react'
import { Copy } from 'lucide-react'
import { FormCard, InlineFormRow, InlineLabel, InputSm, InputDateText } from '@/components/form-card'
import { copyToClipboard } from '@/lib/helpers'
import { showToast } from '@/lib/store'

export function CorrectionsSection() {
  // === БЛОК 1: Показания Сети ===
  const [sDate, setSDate] = useState('')
  const [sT0, setST0] = useState('')
  const [sT1, setST1] = useState('')
  const [sT2, setST2] = useState('')
  const [sT3, setST3] = useState('')
  const [cDate, setCDate] = useState('')
  const [cT0, setCT0] = useState('')
  const [cT1, setCT1] = useState('')
  const [cT2, setCT2] = useState('')
  const [cT3, setCT3] = useState('')

  // === БЛОК 2: Ошибочные показания ===
  const [f1Date, setF1Date] = useState('')
  const [f1T0, setF1T0] = useState('')
  const [f1T1, setF1T1] = useState('')
  const [f1T2, setF1T2] = useState('')
  const [f1T3, setF1T3] = useState('')
  const [t1Date, setT1Date] = useState('')
  const [t1T0, setT1T0] = useState('')
  const [t1T1, setT1T1] = useState('')
  const [t1T2, setT1T2] = useState('')
  const [t1T3, setT1T3] = useState('')

  // === БЛОК 3: Автокорректировка ===
  const [nrDate2, setNrDate2] = useState('')
  const [nrT1, setNrT1] = useState('')
  const [nrT2, setNrT2] = useState('')
  const [nrT3, setNrT3] = useState('')
  const [nrDates, setNrDates] = useState<string[]>(['', '', '', '', '', '', ''])

  // Фильтр для полей показаний - только цифры
  const handleReadingChange = (value: string, setter: (v: string) => void) => {
    setter(value.replace(/\D/g, '').slice(0, 6))
  }

  // Обработчик копирования блока 1
  const handleCopy1 = async () => {
    const text = `Не согласен с показаниями "Сети", Сетевой участок Россети МР; Дата сети ${sDate}; То ${sT0} ; Т1 ${sT1} ; Т2 ${sT2} ; Т3 ${sT3} ; Дата кл ${cDate}; То ${cT0} ; Т1 ${cT1} ; Т2 ${cT2} ; Т3 ${cT3} ;`
    
    const success = await copyToClipboard(text)
    if (success) {
      showToast('Текст скопирован!')
      // Очищаем поля
      setSDate(''); setST0(''); setST1(''); setST2(''); setST3('')
      setCDate(''); setCT0(''); setCT1(''); setCT2(''); setCT3('')
    } else {
      showToast('Ошибка копирования', 'error')
    }
  }

  // Обработчик копирования блока 2
  const handleCopy2 = async () => {
    let text = ''
    
    if (!f1T3 && !f1T0) {
      text = `${f1Date} клиент ошибочно передал показания Т1-${f1T1}, Т2-${f1T2}, данные показания необходимо удалить. Корректные показания на ${t1Date}, Т1-${t1T1}, Т2-${t1T2}.`
    } else if (!f1T0) {
      text = `${f1Date} клиент ошибочно передал показания Т1-${f1T1}, Т2-${f1T2}, Т3-${f1T3}, данные показания необходимо удалить. Корректные показания на ${t1Date}, Т1-${t1T1}, Т2-${t1T2}, Т3-${t1T3}.`
    } else {
      text = `${f1Date} клиент ошибочно передал показания То-${f1T0}, данные показания необходимо удалить. Корректные показания на ${t1Date}, То-${t1T0}.`
    }
    
    const success = await copyToClipboard(text)
    if (success) {
      showToast('Текст скопирован!')
      setF1Date(''); setF1T0(''); setF1T1(''); setF1T2(''); setF1T3('')
      setT1Date(''); setT1T0(''); setT1T1(''); setT1T2(''); setT1T3('')
    } else {
      showToast('Ошибка копирования', 'error')
    }
  }

  // Обработчик копирования блока 3
  const handleCopy3 = async () => {
    let prefix = ''
    
    if (!nrT2) {
      prefix = `Текущие показания клиента ${nrDate2} То ${nrT1} ; Необходимо провести автоматическую корректировку показаний на даты: `
    } else if (!nrT3) {
      prefix = `Текущие показания клиента ${nrDate2} Т1 ${nrT1} ; Т2 ${nrT2} ; Необходимо провести автоматическую корректировку показаний на даты: `
    } else {
      prefix = `Текущие показания клиента ${nrDate2} Т1 ${nrT1} ; Т2 ${nrT2} ; Т3 ${nrT3} ; Необходимо провести автоматическую корректировку показаний на даты: `
    }
    
    const dates = nrDates.filter(d => d.trim()).join(', ')
    const text = prefix + dates
    
    const success = await copyToClipboard(text)
    if (success) {
      showToast('Текст скопирован!')
      setNrDate2(''); setNrT1(''); setNrT2(''); setNrT3('')
      setNrDates(['', '', '', '', '', '', ''])
    } else {
      showToast('Ошибка копирования', 'error')
    }
  }

  return (
    <>
      {/* Блок 1: Не согласен с показаниями Сети */}
      <FormCard label='Не согласен с показаниями «Сети»'>
        <InlineFormRow>
          <InlineLabel>Дата сети</InlineLabel>
          <InputDateText value={sDate} onDateChange={setSDate} />
          <InlineLabel>То</InlineLabel>
          <InputSm value={sT0} onChange={(e) => handleReadingChange(e.target.value, setST0)} maxLength={6} />
          <InlineLabel>Т1</InlineLabel>
          <InputSm value={sT1} onChange={(e) => handleReadingChange(e.target.value, setST1)} maxLength={6} />
          <InlineLabel>Т2</InlineLabel>
          <InputSm value={sT2} onChange={(e) => handleReadingChange(e.target.value, setST2)} maxLength={6} />
          <InlineLabel>Т3</InlineLabel>
          <InputSm value={sT3} onChange={(e) => handleReadingChange(e.target.value, setST3)} maxLength={6} />
        </InlineFormRow>
        
        <InlineFormRow className="mt-2">
          <InlineLabel>Дата кл.</InlineLabel>
          <InputDateText value={cDate} onDateChange={setCDate} />
          <InlineLabel>То</InlineLabel>
          <InputSm value={cT0} onChange={(e) => handleReadingChange(e.target.value, setCT0)} maxLength={6} />
          <InlineLabel>Т1</InlineLabel>
          <InputSm value={cT1} onChange={(e) => handleReadingChange(e.target.value, setCT1)} maxLength={6} />
          <InlineLabel>Т2</InlineLabel>
          <InputSm value={cT2} onChange={(e) => handleReadingChange(e.target.value, setCT2)} maxLength={6} />
          <InlineLabel>Т3</InlineLabel>
          <InputSm value={cT3} onChange={(e) => handleReadingChange(e.target.value, setCT3)} maxLength={6} />
        </InlineFormRow>
        
        <button
          onClick={handleCopy1}
          className="flex items-center gap-2 px-4 py-2 mt-3 bg-primary hover:bg-primary/90 
                    text-primary-foreground rounded-md text-sm font-medium transition-all active:scale-[0.97]"
        >
          <Copy className="w-4 h-4" />
          Скопировать
        </button>
      </FormCard>

      {/* Блок 2: Ошибочно переданные показания */}
      <FormCard label='Ошибочно переданные показания клиентом'>
        <InlineFormRow>
          <InputDateText value={f1Date} onDateChange={setF1Date} />
          <InlineLabel>клиент ошибочно передал То-</InlineLabel>
          <InputSm value={f1T0} onChange={(e) => handleReadingChange(e.target.value, setF1T0)} maxLength={6} />
          <InlineLabel>Т1-</InlineLabel>
          <InputSm value={f1T1} onChange={(e) => handleReadingChange(e.target.value, setF1T1)} maxLength={6} />
          <InlineLabel>Т2-</InlineLabel>
          <InputSm value={f1T2} onChange={(e) => handleReadingChange(e.target.value, setF1T2)} maxLength={6} />
          <InlineLabel>Т3-</InlineLabel>
          <InputSm value={f1T3} onChange={(e) => handleReadingChange(e.target.value, setF1T3)} maxLength={6} />
        </InlineFormRow>
        
        <InlineFormRow className="mt-2">
          <InlineLabel>Корректные на</InlineLabel>
          <InputDateText value={t1Date} onDateChange={setT1Date} />
          <InlineLabel>То-</InlineLabel>
          <InputSm value={t1T0} onChange={(e) => handleReadingChange(e.target.value, setT1T0)} maxLength={6} />
          <InlineLabel>Т1-</InlineLabel>
          <InputSm value={t1T1} onChange={(e) => handleReadingChange(e.target.value, setT1T1)} maxLength={6} />
          <InlineLabel>Т2-</InlineLabel>
          <InputSm value={t1T2} onChange={(e) => handleReadingChange(e.target.value, setT1T2)} maxLength={6} />
          <InlineLabel>Т3-</InlineLabel>
          <InputSm value={t1T3} onChange={(e) => handleReadingChange(e.target.value, setT1T3)} maxLength={6} />
        </InlineFormRow>
        
        <button
          onClick={handleCopy2}
          className="flex items-center gap-2 px-4 py-2 mt-3 bg-primary hover:bg-primary/90 
                    text-primary-foreground rounded-md text-sm font-medium transition-all active:scale-[0.97]"
        >
          <Copy className="w-4 h-4" />
          Скопировать
        </button>
      </FormCard>

      {/* Блок 3: Автоматическая корректировка */}
      <FormCard label='Автоматическая корректировка'>
        <InlineFormRow>
          <InlineLabel>Текущие показания</InlineLabel>
          <InputDateText value={nrDate2} onDateChange={setNrDate2} />
          <InlineLabel>Т1-</InlineLabel>
          <InputSm value={nrT1} onChange={(e) => handleReadingChange(e.target.value, setNrT1)} />
          <InlineLabel>Т2-</InlineLabel>
          <InputSm value={nrT2} onChange={(e) => handleReadingChange(e.target.value, setNrT2)} />
          <InlineLabel>Т3-</InlineLabel>
          <InputSm value={nrT3} onChange={(e) => handleReadingChange(e.target.value, setNrT3)} />
        </InlineFormRow>
        
        <InlineFormRow className="mt-2">
          <InlineLabel>Даты для корректировки:</InlineLabel>
          {nrDates.map((date, i) => (
            <InputSm 
              key={i}
              value={date}
              onChange={(e) => {
                const newDates = [...nrDates]
                newDates[i] = e.target.value
                setNrDates(newDates)
              }}
              placeholder="Дата"
              className="w-[80px]"
            />
          ))}
        </InlineFormRow>
        
        <button
          onClick={handleCopy3}
          className="flex items-center gap-2 px-4 py-2 mt-3 bg-primary hover:bg-primary/90 
                    text-primary-foreground rounded-md text-sm font-medium transition-all active:scale-[0.97]"
        >
          <Copy className="w-4 h-4" />
          Скопировать
        </button>
      </FormCard>
    </>
  )
}
