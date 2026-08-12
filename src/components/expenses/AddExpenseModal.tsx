import { useState, type FormEvent } from 'react'
import { categories } from '../../data'

interface AddExpenseModalProps {
  open: boolean
  onClose: () => void
  onSave?: (data: { amount: string; date: string; category: string; note: string }) => void
}

const today = new Date().toISOString().slice(0, 10)

export default function AddExpenseModal({ open, onClose, onSave }: AddExpenseModalProps) {
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(today)
  const [category, setCategory] = useState(categories[0]?.id ?? '')
  const [note, setNote] = useState('')

  if (!open) return null

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSave?.({ amount, date, category, note })
    onClose()
  }

  const setYesterday = () => {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    setDate(d.toISOString().slice(0, 10))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal Content */}
      <div className="bg-surface-container-lowest border border-border-subtle rounded-xl w-full max-w-md mx-4 p-6 shadow-xl relative z-10 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h3 className="font-title-md text-xl font-semibold text-on-surface">New Expense Entry</h3>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-xs font-semibold text-on-surface-variant">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface font-label-numeric">
                $
              </span>
              <input
                className="w-full pl-8 pr-3 py-2 bg-surface-container-lowest border border-border-subtle rounded-lg font-label-numeric text-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="0.00"
                step="0.01"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-xs font-semibold text-on-surface-variant">
              Date
            </label>
            <input
              className="w-full px-3 py-2 bg-surface-container-lowest border border-border-subtle rounded-lg font-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <div className="flex gap-2 mt-1">
              <button
                type="button"
                onClick={() => setDate(today)}
                className="text-[10px] font-label-caps px-2 py-1 bg-surface-container rounded text-on-surface-variant hover:bg-surface-variant"
              >
                Today
              </button>
              <button
                type="button"
                onClick={setYesterday}
                className="text-[10px] font-label-caps px-2 py-1 bg-surface-container rounded text-on-surface-variant hover:bg-surface-variant"
              >
                Yesterday
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-xs font-semibold text-on-surface-variant">
              Category
            </label>
            <select
              className="w-full px-3 py-2 bg-surface-container-lowest border border-border-subtle rounded-lg font-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name.charAt(0).toUpperCase() + c.name.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-xs font-semibold text-on-surface-variant">
              Note (Optional)
            </label>
            <textarea
              className="w-full px-3 py-2 bg-surface-container-lowest border border-border-subtle rounded-lg font-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
              placeholder="Brief description..."
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-1 mt-3 pt-3 border-t border-border-subtle">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-label-caps text-xs font-semibold text-primary hover:bg-surface-container-low rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-label-caps text-xs font-semibold bg-primary text-on-primary rounded-lg shadow-sm hover:bg-primary-container transition-colors active:scale-95 duration-200"
            >
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
