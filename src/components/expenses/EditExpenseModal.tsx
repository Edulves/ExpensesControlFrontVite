import { useEffect, useState, type FormEvent } from 'react'
import {
  fetchTransactionCategories,
  updateDailyExpenses,
  type TransactionCategory,
} from '../../services/api'
import type { Expense } from '../../types'

interface EditExpenseModalProps {
  open: boolean
  expense: Expense | null
  onClose: () => void
  onSaved?: () => void
}

export default function EditExpenseModal({ open, expense, onClose, onSaved }: EditExpenseModalProps) {
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [categoryId, setCategoryId] = useState(0)
  const [note, setNote] = useState('')
  const [categs, setCategs] = useState<TransactionCategory[]>([])
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !expense) return
    setAmount(String(expense.amount))
    setDate(expense.date.slice(0, 10))
    setNote(expense.description)
    setCategoryId(0)
    setSubmitError(null)
    let cancelled = false
    fetchTransactionCategories()
      .then((list) => {
        if (cancelled) return
        setCategs(list)
        const match = list.find((c) => c.name.toLowerCase() === expense.categoryId.toLowerCase())
        setCategoryId(match?.transactionCategoryId ?? list[0]?.transactionCategoryId ?? 0)
      })
      .catch((err) => {
        if (!cancelled) setSubmitError(err instanceof Error ? err.message : 'Erro ao carregar categorias.')
      })
    return () => {
      cancelled = true
    }
  }, [open, expense])

  if (!open || !expense) return null

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!Number(amount) || Number(amount) <= 0 || !date || !categoryId) {
      setSubmitError('Informe valor, data e categoria válidos.')
      return
    }
    try {
      setSaving(true)
      setSubmitError(null)
      await updateDailyExpenses([
        {
          dailyExpenseId: Number(expense.id),
          expenseDate: date,
          expenseValue: Number(amount),
          note: note ? note : '',
          categoryId,
        },
      ])
      onSaved?.()
      onClose()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Erro ao atualizar despesa.')
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
      <div className="bg-surface-container-lowest border border-border-subtle rounded-xl w-full max-w-md mx-4 shadow-xl relative z-10 flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-center px-6 py-4 border-b border-border-subtle flex-shrink-0">
          <h3 className="font-title-md text-xl font-semibold text-on-surface">Editar Despesa</h3>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form className="flex flex-col gap-3 overflow-y-auto p-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-xs font-semibold text-on-surface-variant">Data</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container-lowest border border-border-subtle rounded-lg font-body-sm text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-xs font-semibold text-on-surface-variant">Valor</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface font-label-numeric text-sm">R$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-surface-container-lowest border border-border-subtle rounded-lg font-label-numeric text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-xs font-semibold text-on-surface-variant">Categoria</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="w-full px-3 py-2 bg-surface-container-lowest border border-border-subtle rounded-lg font-body-sm text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
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
            <label className="font-label-caps text-xs font-semibold text-on-surface-variant">Observação (Opcional)</label>
            <input
              type="text"
              placeholder="Descrição breve..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container-lowest border border-border-subtle rounded-lg font-body-sm text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          {submitError && <p className="font-body-sm text-sm text-negative-rose">{submitError}</p>}

          <div className="flex justify-end gap-1 mt-3 pt-3 border-t border-border-subtle flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-label-caps text-xs font-semibold text-primary hover:bg-surface-container-low rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || categs.length === 0}
              className="px-4 py-2 font-label-caps text-xs font-semibold bg-primary text-on-primary rounded-lg shadow-sm hover:bg-primary-container transition-colors active:scale-95 duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}