'use client'

/**
 * Секция "Прочее"
 * 
 * Содержит:
 * - Изменение площади
 * - Изменение типа плиты
 */

import { useState } from 'react'
import { Copy } from 'lucide-react'
import { FormCard, InputSm, InputDateText, InlineFormRow, InlineLabel } from '@/components/form-card'
import { copyToClipboard } from '@/lib/helpers'
import { showToast } from '@/lib/store'

type PlateType = 'электрическая' | 'газовая' | null

export function MiscSection() {
  // === ИЗМЕНЕНИЕ ПЛОЩАДИ ===
  const [areaFrom, setAreaFrom] = useState('')
  const [areaTo, setAreaTo] = useState('')
  const [areaDate, setAreaDate] = useState('')
  
  // === ИЗМЕНЕНИЕ ТИПА ПЛИТЫ ===
  const [plateType, setPlateType] = useState<PlateType>(null)
  const [plateDate, setPlateDate] = useState('')

  // Копировать изменение площади
  const handleCopyArea = async () => {
    if (!areaFrom.trim() || !areaTo.trim()) {
      showToast('Заполните площади', 'error')
      return
    }
    if (!areaDate.trim()) {
      showToast('Укажите дату', 'error')
      return
    }
    
    const text = `Изменение площади помещения с ${areaFrom} кв.м. на ${areaTo} кв.м. с ${areaDate}.`
    
    const success = await copyToClipboard(text)
    if (success) {
      showToast('Скопировано!')
      setAreaFrom(''); setAreaTo(''); setAreaDate('')
    } else {
      showToast('Ошибка копирования', 'error')
    }
  }

  // Копировать изменение типа плиты
  const handleCopyPlate = async () => {
    if (!plateType) {
      showToast('Выберите тип плиты', 'error')
      return
    }
    if (!plateDate.trim()) {
      showToast('Укажите дату', 'error')
      return
    }
    
    const text = `Изменение типа плиты на ${plateType} с ${plateDate}.`
    
    const success = await copyToClipboard(text)
    if (success) {
      showToast('Скопировано!')
      setPlateType(null); setPlateDate('')
    } else {
      showToast('Ошибка копирования', 'error')
    }
  }

  return (
    <>
      {/* Изменение площади */}
      <FormCard label="Изменение площади">
        <div className="space-y-3">
          <InlineFormRow>
            <InlineLabel>Изменение площади с</InlineLabel>
            <InputSm 
              value={areaFrom}
              onChange={(e) => setAreaFrom(e.target.value.replace(/[^\d.,]/g, ''))}
              placeholder="0"
            />
            <InlineLabel>кв.м. на</InlineLabel>
            <InputSm 
              value={areaTo}
              onChange={(e) => setAreaTo(e.target.value.replace(/[^\d.,]/g, ''))}
              placeholder="0"
            />
            <InlineLabel>кв.м. с</InlineLabel>
            <InputDateText 
              value={areaDate}
              onDateChange={setAreaDate}
            />
          </InlineFormRow>

          <button
            onClick={handleCopyArea}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 
                      text-primary-foreground rounded-md text-sm font-medium transition-all active:scale-[0.97]"
          >
            <Copy className="w-4 h-4" />
            Скопировать
          </button>
        </div>
      </FormCard>

      {/* Изменение типа плиты */}
      <FormCard label="Изменение типа плиты">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-2">
              Тип плиты <span className="text-destructive">*</span>
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setPlateType('электрическая')}
                className={`px-4 py-2 rounded-md text-sm font-medium border transition-all
                  ${plateType === 'электрическая' 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-input text-foreground border-border hover:bg-secondary'}`}
              >
                Электрическая
              </button>
              <button
                onClick={() => setPlateType('газовая')}
                className={`px-4 py-2 rounded-md text-sm font-medium border transition-all
                  ${plateType === 'газовая' 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-input text-foreground border-border hover:bg-secondary'}`}
              >
                Газовая
              </button>
            </div>
          </div>

          <InlineFormRow>
            <InlineLabel>с даты</InlineLabel>
            <InputDateText 
              value={plateDate}
              onDateChange={setPlateDate}
            />
          </InlineFormRow>

          <button
            onClick={handleCopyPlate}
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
