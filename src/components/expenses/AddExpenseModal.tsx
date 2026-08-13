import { useEffect, useState, type FormEvent } from 'react'
import {
  fetchTransactionCategories,
  createDailyExpenses,
  type TransactionCategory,
} from '../../services/api'

interface AddExpenseModalProps {
  open: boolean
  onClose: () => void
  onSaved?: () => void
}

interface EntryRow {
  amount: string
  date: string
  categoryId: number
  note: string
}

const today = new Date().toISOString().slice(0, 10)

const emptyRow = (categoryId: number): EntryRow => ({
  amount: '',
  date: today,
  categoryId,
  note: '',
})

export default function AddExpenseModal({ open, onClose, onSaved }: AddExpenseModalProps) {
  const [rows, setRows] = useState<EntryRow[]>([])
  const [categs, setCategs] = useState<TransactionCategory[]>([])
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Ao abrir: reinicia com um lançamento vazio e carrega as categorias reais (Ids inteiros)
  useEffect(() => {
    if (!open) return
    setRows([emptyRow(0)])
    setSubmitError(null)
    let cancelled = false
    fetchTransactionCategories()
      .then((list) => {
        if (!cancelled) setCategs(list)
      })
      .catch((err) => {
        if (!cancelled) setSubmitError(err instanceof Error ? err.message : 'Erro ao carregar categorias.')
      })
    return () => {
      cancelled = true
    }
  }, [open])

  // Preenche as linhas que ainda não tinham categoria assim que a lista carrega
  useEffect(() => {
    if (!categs.length) return
    const firstId = categs[0].transactionCategoryId
    setRows((prev) => prev.map((r) => (r.categoryId ? r : { ...r, categoryId: firstId })))
  }, [categs])

  if (!open) return null

  const setRow = (index: number, patch: Partial<EntryRow>) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)))
  }

  const addRow = () => {
    setRows((prev) => [...prev, emptyRow(categs[0]?.transactionCategoryId ?? 0)])
  }

  const removeRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const payload = rows
      .filter((r) => r.amount && Number(r.amount) > 0 && r.date && r.categoryId)
      .map((r) => ({
        expenseDate: r.date,
        amount: Number(r.amount),
        note: r.note ? r.note : null,
        categoryId: r.categoryId,
      }))

    if (payload.length === 0) {
      setSubmitError('Informe valor, data e categoria em pelo menos um lançamento.')
      return
    }

    try {
      setSaving(true)
      setSubmitError(null)
      await createDailyExpenses(payload)
      onSaved?.()
      onClose()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Erro ao salvar despesas.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal Content */}
      <div className="bg-surface-container-lowest border border-border-subtle rounded-xl w-full max-w-md mx-4 max-h-[85vh] flex flex-col shadow-xl relative z-10">
        <div className="flex justify-between items-center px-6 py-4 border-b border-border-subtle flex-shrink-0">
          <h3 className="font-title-md text-xl font-semibold text-on-surface">New Expense Entries</h3>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form className="flex flex-col gap-3 overflow-y-auto p-6" onSubmit={handleSubmit}>
          {rows.map((row, index) => (
            <div
              key={index}
              className="border border-border-subtle rounded-lg p-3 flex flex-col gap-2 relative"
            >
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-[10px] font-semibold text-on-surface-variant uppercase">
                  Entry {index + 1}
                </span>
                {rows.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    className="text-on-surface-variant hover:text-negative-rose transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="font-label-caps text-[10px] font-semibold text-on-surface-variant">
                    Date
                  </label>
                  <input
                    type="date"
                    value={row.date}
                    onChange={(e) => setRow(index, { date: e.target.value })}
                    className="w-full px-2 py-1.5 bg-surface-container-lowest border border-border-subtle rounded-lg font-body-sm text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-caps text-[10px] font-semibold text-on-surface-variant">
                    Amount
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={row.amount}
                    onChange={(e) => setRow(index, { amount: e.target.value })}
                    className="w-full px-2 py-1.5 bg-surface-container-lowest border border-border-subtle rounded-lg font-label-numeric text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-caps text-[10px] font-semibold text-on-surface-variant">
                  Category
                </label>
                <select
                  value={row.categoryId}
                  onChange={(e) => setRow(index, { categoryId: Number(e.target.value) })}
                  className="w-full px-2 py-1.5 bg-surface-container-lowest border border-border-subtle rounded-lg font-body-sm text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
                >
                  {categs.length === 0 && <option value="">Carregando categorias...</option>}
                  {categs.map((c) => (
                    <option key={c.transactionCategoryId} value={c.transactionCategoryId}>
                      {c.name.charAt(0).toUpperCase() + c.name.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-caps text-[10px] font-semibold text-on-surface-variant">
                  Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Brief description..."
                  value={row.note}
                  onChange={(e) => setRow(index, { note: e.target.value })}
                  className="w-full px-2 py-1.5 bg-surface-container-lowest border border-border-subtle rounded-lg font-body-sm text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addRow}
            className="flex items-center justify-center gap-2 border border-dashed border-border-subtle rounded-lg py-2 font-label-caps text-xs font-semibold text-primary hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Add entry
          </button>

          {submitError && (
            <p className="font-body-sm text-sm text-negative-rose">{submitError}</p>
          )}

          <div className="flex justify-end gap-1 mt-3 pt-3 border-t border-border-subtle flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-label-caps text-xs font-semibold text-primary hover:bg-surface-container-low rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || categs.length === 0}
              className="px-4 py-2 font-label-caps text-xs font-semibold bg-primary text-on-primary rounded-lg shadow-sm hover:bg-primary-container transition-colors active:scale-95 duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Entries'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
