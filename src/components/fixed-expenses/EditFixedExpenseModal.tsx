import { useEffect, useState, type FormEvent } from 'react'
import { updateFixedExpenses } from '../../services/api'
import type { FixedExpense } from '../../types'

interface EditFixedExpenseModalProps {
  open: boolean
  expense: FixedExpense | null
  onClose: () => void
  onSaved?: () => void
}

/** Converte "dd/MM/yyyy" para "yyyy-MM-dd". */
function dueDateToDateInput(due: string): string {
  const parts = due.split('/')
  if (parts.length !== 3) return ''
  const [d, m, y] = parts
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
}

export default function EditFixedExpenseModal({ open, expense, onClose, onSaved }: EditFixedExpenseModalProps) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [isPaid, setIsPaid] = useState(false)
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !expense) return
    setDescription(expense.description)
    setAmount(String(expense.amount))
    setDueDate(dueDateToDateInput(expense.dueDate))
    setIsPaid(expense.status === 'paid')
    setSubmitError(null)
  }, [open, expense])

  if (!open || !expense) return null

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!description.trim()) {
      setSubmitError('Informe uma descrição.')
      return
    }
    if (!Number(amount) || Number(amount) <= 0) {
      setSubmitError('Informe um valor válido.')
      return
    }
    if (!dueDate) {
      setSubmitError('Informe a data de vencimento.')
      return
    }
    try {
      setSaving(true)
      setSubmitError(null)
      await updateFixedExpenses([
        {
          fixedExpensesId: Number(expense.id),
          description: description.trim(),
          amount: Number(amount),
          isPaid,
          fixedExpenseDate: dueDate,
        },
      ])
      onSaved?.()
      onClose()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Erro ao atualizar despesa fixa.')
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
          <h3 className="font-title-md text-xl font-semibold text-on-surface">Editar Despesa Fixa</h3>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form className="flex flex-col gap-3 overflow-y-auto p-6" onSubmit={handleSubmit}>
          {/* Descrição */}
          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-xs font-semibold text-on-surface-variant">Descrição</label>
            <input
              type="text"
              placeholder="Nome da despesa fixa"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container-lowest border border-border-subtle rounded-lg font-body-sm text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          {/* Valor */}
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

          {/* Data de Vencimento */}
          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-xs font-semibold text-on-surface-variant">Data de Vencimento</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container-lowest border border-border-subtle rounded-lg font-body-sm text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          {/* Status: Pago */}
          <div className="flex items-center gap-3 py-1">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isPaid}
                onChange={(e) => setIsPaid(e.target.checked)}
              />
              <div className="w-10 h-5 bg-surface-container-high border border-border-subtle rounded-full peer peer-checked:bg-positive-emerald peer-checked:border-positive-emerald/20 peer-focus:ring-1 peer-focus:ring-primary transition-all" />
              <span className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all peer-checked:translate-x-5" />
            </label>
            <span className="font-body-sm text-sm text-on-surface">{isPaid ? 'Pago' : 'Não pago'}</span>
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
              disabled={saving}
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
