/**
 * Компонент карточки формы
 * 
 * Используется для группировки полей ввода внутри аккордеона
 */

interface FormCardProps {
  label?: string
  children: React.ReactNode
}

export function FormCard({ label, children }: FormCardProps) {
  return (
    <div className="bg-secondary/30 border border-border rounded-lg p-4">
      {/* Заголовок карточки */}
      {label && (
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          {label}
        </div>
      )}
      
      {/* Содержимое */}
      {children}
    </div>
  )
}

/**
 * Компонент строки формы с inline полями
 */
interface InlineFormRowProps {
  children: React.ReactNode
  className?: string
}

export function InlineFormRow({ children, className = '' }: InlineFormRowProps) {
  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {children}
    </div>
  )
}

/**
 * Компонент метки для inline полей
 */
interface InlineLabelProps {
  children: React.ReactNode
}

export function InlineLabel({ children }: InlineLabelProps) {
  return (
    <span className="text-sm text-muted-foreground whitespace-nowrap">
      {children}
    </span>
  )
}

/**
 * Маленький input
 */
interface InputSmProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export function InputSm({ error, className = '', ...props }: InputSmProps) {
  return (
    <input
      className={`
        w-[72px] px-2 py-1.5 text-sm border rounded-md
        bg-input text-foreground placeholder:text-muted-foreground
        focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15
        transition-all
        ${error ? 'border-destructive ring-2 ring-destructive/15' : 'border-border'}
        ${className}
      `}
      {...props}
    />
  )
}

/**
 * Средний input
 */
export function InputMd({ error, className = '', ...props }: InputSmProps) {
  return (
    <input
      className={`
        w-[130px] px-2.5 py-1.5 text-sm border rounded-md
        bg-input text-foreground placeholder:text-muted-foreground
        focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15
        transition-all
        ${error ? 'border-destructive ring-2 ring-destructive/15' : 'border-border'}
        ${className}
      `}
      {...props}
    />
  )
}

/**
 * Большой input
 */
export function InputLg({ error, className = '', ...props }: InputSmProps) {
  return (
    <input
      className={`
        w-[280px] max-w-full px-3 py-2 text-sm border rounded-md
        bg-input text-foreground placeholder:text-muted-foreground
        focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15
        transition-all
        ${error ? 'border-destructive ring-2 ring-destructive/15' : 'border-border'}
        ${className}
      `}
      {...props}
    />
  )
}

/**
 * Input для даты
 */
export function InputDate({ error, className = '', ...props }: InputSmProps) {
  return (
    <input
      type="date"
      className={`
        px-2.5 py-1.5 text-sm border rounded-md
        bg-input text-foreground
        focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15
        transition-all
        ${error ? 'border-destructive ring-2 ring-destructive/15' : 'border-border'}
        ${className}
      `}
      {...props}
    />
  )
}

/**
 * Input с датой в формате ДД.ММ.ГГГГ
 */
interface InputDateTextProps extends Omit<InputSmProps, 'onChange'> {
  onDateChange?: (value: string) => void
}

export function InputDateText({ onDateChange, error, className = '', ...props }: InputDateTextProps) {
  // Обработчик форматирования даты
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d]/g, '')
    if (value.length > 8) value = value.slice(0, 8)
    
    let formatted = ''
    if (value.length > 4) {
      formatted = value.slice(0, 2) + '.' + value.slice(2, 4) + '.' + value.slice(4)
    } else if (value.length > 2) {
      formatted = value.slice(0, 2) + '.' + value.slice(2)
    } else {
      formatted = value
    }
    
    onDateChange?.(formatted)
  }

  return (
    <input
      placeholder="ДД.ММ.ГГГГ"
      maxLength={10}
      onChange={handleChange}
      className={`
        w-[96px] px-2 py-1.5 text-sm border rounded-md
        bg-input text-foreground placeholder:text-muted-foreground
        focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15
        transition-all
        ${error ? 'border-destructive ring-2 ring-destructive/15' : 'border-border'}
        ${className}
      `}
      {...props}
    />
  )
}
