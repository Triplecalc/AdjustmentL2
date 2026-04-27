'use client'

/**
 * Секция "Некорректные переводы"
 * 
 * Исправленные названия кнопок:
 * - ТП ЛКК -> На ТП ЛКК
 * - ВВ -> На восстановление  
 * - 2 линия -> На 2 линию
 */

import { useState, useEffect } from 'react'
import { Copy, Plus, FileSpreadsheet, Trash2, Database } from 'lucide-react'
import { FormCard, InputLg, InputMd } from '@/components/form-card'
import { copyToClipboard, formatDateInput, formatTimeInput, getCurrentDate, getCurrentTime } from '@/lib/helpers'
import { showToast, getTransferRecords, saveTransferRecord, clearTransferRecords, type TransferRecord } from '@/lib/store'

type DestType = 'ТП ЛКК' | '2 линия' | 'ВВ' | null

// ИСПРАВЛЕНО: Новые названия кнопок
const DEST_BUTTONS: { value: DestType; label: string }[] = [
  { value: 'ТП ЛКК', label: 'На ТП ЛКК' },
  { value: '2 линия', label: 'На 2 линию' },
  { value: 'ВВ', label: 'На восстановление' },
]

export function TransfersSection() {
  // Состояние формы
  const [trDate, setTrDate] = useState('')
  const [trTime, setTrTime] = useState('')
  const [trName, setTrName] = useState('')
  const [trDest, setTrDest] = useState<DestType>(null)
  const [trQuestion, setTrQuestion] = useState('')
  const [trPhone, setTrPhone] = useState('')
  const [trLs, setTrLs] = useState('')
  
  // Счетчик записей
  const [recordCount, setRecordCount] = useState(0)

  // Обновляем счетчик при монтировании
  useEffect(() => {
    setRecordCount(getTransferRecords().length)
  }, [])

  // Валидация и сбор данных
  const collectData = (): TransferRecord | null => {
    if (!trName.trim()) {
      showToast('Введите ФИО оператора', 'error')
      return null
    }
    if (!trDest) {
      showToast('Выберите, куда перевели', 'error')
      return null
    }
    if (!trQuestion.trim()) {
      showToast('Введите вопрос клиента', 'error')
      return null
    }
    if (!trPhone.trim()) {
      showToast('Введите телефон клиента', 'error')
      return null
    }
    
    const date = trDate || getCurrentDate()
    const time = trTime || getCurrentTime()
    
    const questionCell = trLs.trim()
      ? `${trDest}, ${trQuestion}, ЛС: ${trLs}`
      : `${trDest}, ${trQuestion}`
    
    return {
      date,
      time,
      name: trName,
      dest: trDest,
      question: questionCell,
      phone: trPhone,
    }
  }

  // Очистка полей (кроме ФИО)
  const clearFields = () => {
    setTrDate('')
    setTrTime('')
    setTrQuestion('')
    setTrPhone('')
    setTrLs('')
    setTrDest(null)
  }

  // Копировать и внести в журнал
  const handleCopy = async () => {
    const data = collectData()
    if (!data) return
    
    const text = `Некорректный перевод на линию ${trDest} по вопросу: ${trQuestion}\nВремя: ${data.time}\nТелефон: ${trPhone}\nОператор: ${trName}${trLs ? `\nЛС клиента: ${trLs}` : ''}`
    
    saveTransferRecord(data)
    
    const success = await copyToClipboard(text)
    if (success) {
      showToast('Скопировано и внесено в журнал!')
      clearFields()
      setRecordCount(getTransferRecords().length)
    } else {
      showToast('Ошибка копирования', 'error')
    }
  }

  // Только внести в журнал
  const handleAdd = () => {
    const data = collectData()
    if (!data) return
    
    saveTransferRecord(data)
    clearFields()
    setRecordCount(getTransferRecords().length)
    showToast('Запись внесена в журнал')
  }

  // Выгрузка в Excel
  const handleExport = async () => {
    const records = getTransferRecords()
    if (records.length === 0) {
      showToast('Нет данных для выгрузки', 'error')
      return
    }
    
    // Динамически загружаем SheetJS
    const loadXLSX = async () => {
      if ((window as unknown as Record<string, unknown>).XLSX) {
        return (window as unknown as Record<string, { utils: Record<string, unknown>; writeFile: (wb: unknown, filename: string) => void }>).XLSX
      }
      
      return new Promise<{ utils: Record<string, unknown>; writeFile: (wb: unknown, filename: string) => void }>((resolve, reject) => {
        const script = document.createElement('script')
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
        script.onload = () => resolve((window as unknown as Record<string, { utils: Record<string, unknown>; writeFile: (wb: unknown, filename: string) => void }>).XLSX)
        script.onerror = () => reject(new Error('Не удалось загрузить библиотеку Excel'))
        document.head.appendChild(script)
      })
    }
    
    try {
      const XLSX = await loadXLSX()
      
      const headers = ['Дата', 'Время', 'Префикс оп МЭС2', 'ФИО оп МЭС2', 'Вопрос клиента', 'Телефон клиента']
      const rows = records.map(r => [r.date, r.time, '', r.name, r.question, r.phone])
      
      const wsData = [headers, ...rows]
      const ws = (XLSX.utils.aoa_to_sheet as (data: unknown[][]) => unknown)(wsData)
      
      // Ширина колонок
      ;(ws as Record<string, unknown>)['!cols'] = [
        {wch: 12}, {wch: 8}, {wch: 18}, {wch: 25}, {wch: 50}, {wch: 18}
      ]
      
      const wb = (XLSX.utils.book_new as () => unknown)()
      ;(XLSX.utils.book_append_sheet as (wb: unknown, ws: unknown, name: string) => void)(wb, ws, 'Переводы')
      
      const dateStr = getCurrentDate().replace(/\./g, '-')
      XLSX.writeFile(wb, `Переводы_на_МЭС2_${dateStr}.xlsx`)
      
      clearTransferRecords()
      setRecordCount(0)
      showToast('Файл выгружен, данные очищены')
    } catch {
      showToast('Ошибка загрузки библиотеки Excel', 'error')
    }
  }

  // Очистка данных
  const handleClear = () => {
    clearTransferRecords()
    setRecordCount(0)
    showToast('Данные очищены')
  }

  return (
    <FormCard>
      <div className="space-y-4">
        {/* Первая строка: дата, время, ФИО */}
        <div className="flex flex-wrap gap-4">
          <div className="min-w-[110px]">
            <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
              Дата <span className="text-xs font-normal">(необязательно)</span>
            </label>
            <InputMd 
              value={trDate}
              onChange={(e) => setTrDate(formatDateInput(e.target.value))}
              placeholder="ДД.ММ.ГГГГ"
              maxLength={10}
            />
          </div>
          
          <div className="min-w-[110px]">
            <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
              Время <span className="text-xs font-normal">(необязательно)</span>
            </label>
            <InputMd 
              value={trTime}
              onChange={(e) => setTrTime(formatTimeInput(e.target.value))}
              placeholder="00:00"
              maxLength={5}
            />
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
              ФИО оператора <span className="text-destructive">*</span>
            </label>
            <InputLg 
              value={trName}
              onChange={(e) => setTrName(e.target.value)}
              placeholder="Фамилия Имя Отчество"
              className="w-full"
            />
          </div>
        </div>

        {/* Куда перевели */}
        <div>
          <label className="block text-sm font-semibold text-muted-foreground mb-2">
            Куда перевели <span className="text-destructive">*</span>
          </label>
          <div className="flex gap-2 flex-wrap">
            {DEST_BUTTONS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setTrDest(value)}
                className={`px-4 py-2 rounded-md text-sm font-medium border transition-all
                  ${trDest === value 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-input text-foreground border-border hover:bg-secondary'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Вопрос клиента */}
        <div>
          <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
            Вопрос клиента <span className="text-destructive">*</span>
          </label>
          <InputLg 
            value={trQuestion}
            onChange={(e) => setTrQuestion(e.target.value)}
            placeholder="Опишите вопрос клиента"
            className="w-full max-w-[480px]"
          />
        </div>

        {/* Телефон и ЛС */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
              Телефон клиента <span className="text-destructive">*</span>
            </label>
            <InputLg 
              value={trPhone}
              onChange={(e) => setTrPhone(e.target.value)}
              placeholder="Номер телефона"
            />
          </div>
          
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
              ЛС клиента <span className="text-xs font-normal">(необязательно)</span>
            </label>
            <InputLg 
              value={trLs}
              onChange={(e) => setTrLs(e.target.value)}
              placeholder="XXXXX-XXX-XX"
              maxLength={13}
            />
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 
                      text-primary-foreground rounded-md text-sm font-medium transition-all active:scale-[0.97]"
          >
            <Copy className="w-4 h-4" />
            Скопировать
          </button>
          
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-primary 
                      text-primary hover:text-primary-foreground border-2 border-primary
                      rounded-md text-sm font-medium transition-all active:scale-[0.97]"
          >
            <Plus className="w-4 h-4" />
            Внести запись
          </button>
          
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-success hover:bg-success/90 
                      text-success-foreground rounded-md text-sm font-medium transition-all active:scale-[0.97]"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Выгрузить отчёт
          </button>
          
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2 bg-transparent hover:bg-secondary 
                      text-muted-foreground border border-border
                      rounded-md text-sm font-medium transition-all active:scale-[0.97]"
          >
            <Trash2 className="w-4 h-4" />
            Очистить данные
          </button>
          
          {/* Счётчик записей */}
          {recordCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary border border-border 
                           rounded-md text-sm text-muted-foreground ml-auto">
              <Database className="w-3 h-3 text-primary" />
              <span>В журнале: <strong className="text-foreground">{recordCount}</strong></span>
            </div>
          )}
        </div>
      </div>
    </FormCard>
  )
}
