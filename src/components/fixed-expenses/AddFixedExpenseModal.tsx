import { useEffect, useState, type FormEvent } from 'react'
import { createFixedExpenses, fetchFixedExpenses } from '../../services/api'
import type { FixedExpense } from '../../types'

interface AddFixedExpenseModalProps {
  open: boolean
  onClose: () => void
  onSaved?: () => void
  copyMonth?: number
  copyYear?: number
}

interface EntryRow {
  description: string
  amount: string
  fixedExpenseDate: string
}

const today = new Date().toISOString().slice(0, 10)

const emptyRow = (): EntryRow => ({
  description: '',
  amount: '',
  fixedExpenseDate: today,
})

export default function AddFixedExpenseModal({ open, onClose, onSaved, copyMonth, copyYear }: AddFixedExpenseModalProps) {
  const [rows, setRows] = useState<EntryRow[]>([])
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [showCopySection, setShowCopySection] = useState(false)
  const [copySourceMonth, setCopySourceMonth] = useState(copyMonth ?? new Date().getMonth() + 1)
  const [copySourceYear, setCopySourceYear] = useState(copyYear ?? new Date().getFullYear())
  const [loadingCopy, setLoadingCopy] = useState(false)
  const [copiedCount, setCopiedCount] = useState(0)

  useEffect(() => {
    if (!open) return
    setRows([emptyRow()])
    setSubmitError(null)
    setCopiedCount(0)
    setShowCopySection(false)
    setCopySourceMonth(copyMonth ?? new Date().getMonth() + 1)
    setCopySourceYear(copyYear ?? new Date().getFullYear())
  }, [open, copyMonth, copyYear])

  if (!open) return null

  const setRow = (index: number, patch: Partial<EntryRow>) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)))
  }

  const addRow = () => setRows((prev) => [...prev, emptyRow()])

  const removeRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index))
  }

  const handleCopyFromMonth = async () => {
    try {
      setLoadingCopy(true)
      setSubmitError(null)
      const sourceExpenses = await fetchFixedExpenses({ month: copySourceMonth, year: copySourceYear })
      if (sourceExpenses.length === 0) {
        setSubmitError('Nenhuma despesa fixa encontrada no mês selecionado.')
        return
      }
      const newRows: EntryRow[] = sourceExpenses.map((exp: FixedExpense) => ({
        description: exp.description,
        amount: String(exp.amount),
        fixedExpenseDate: today,
      }))
      setRows(newRows)
      setCopiedCount(sourceExpenses.length)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Erro ao copiar despesas do mês.')
    } finally {
      setLoadingCopy(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const payload = rows
      .filter((r) => r.description.trim() && Number(r.amount) > 0 && r.fixedExpenseDate)
      .map((r) => ({ description: r.description.trim(), amount: Number(r.amount), fixedExpenseDate: r.fixedExpenseDate }))
    if (payload.length === 0) {
      setSubmitError('Informe descrição, valor e data em pelo menos um lançamento.')
      return
    }
    try {
      setSaving(true)
      setSubmitError(null)
      await createFixedExpenses(payload)
      onSaved?.()
      onClose()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Erro ao salvar despesas fixas.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-surface-container-lowest border border-border-subtle rounded-xl w-full max-w-md mx-4 max-h-[85vh] flex flex-col shadow-xl relative z-10">
        <div className="flex justify-between items-center px-6 py-4 border-b border-border-subtle flex-shrink-0">
          <h3 className="font-title-md text-xl font-semibold text-on-surface">
            {copiedCount > 0 ? `${copiedCount} despesa(s) copiada(s)` : 'Nova Despesa Fixa'}
          </h3>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="px-6 pt-4 pb-2 border-b border-border-subtle">
          <button type="button" onClick={() => setShowCopySection(!showCopySection)}
            className="flex items-center gap-2 text-primary hover:text-primary-container transition-colors font-label-caps text-xs font-semibold">
            <span className="material-symbols-outlined text-[16px]">{showCopySection ? 'expand_less' : 'content_copy'}</span>
            Copiar de um mês específico
          </button>
          {showCopySection && (
            <div className="mt-3 flex flex-wrap items-end gap-2">
              <div className="flex flex-col gap-1">
                <label className="font-label-caps text-[10px] font-semibold text-on-surface-variant">Mês</label>
                <select value={copySourceMonth} onChange={(e) => setCopySourceMonth(Number(e.target.value))}
                  className="px-2 py-1.5 bg-surface-container-lowest border border-border-subtle rounded-lg font-body-sm text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                  {['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'].map((name, idx) => (<option key={idx+1} value={idx+1}>{name}</option>))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-caps text-[10px] font-semibold text-on-surface-variant">Ano</label>
                <input type="number" value={copySourceYear} onChange={(e) => setCopySourceYear(Number(e.target.value))}
                  className="w-20 px-2 py-1.5 bg-surface-container-lowest border border-border-subtle rounded-lg font-body-sm text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <button type="button" disabled={loadingCopy} onClick={handleCopyFromMonth}
                className="px-3 py-1.5 font-label-caps text-xs font-semibold bg-primary text-on-primary rounded-lg shadow-sm hover:bg-primary-container transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                {loadingCopy ? 'Copiando...' : 'Copiar'}
              </button>
            </div>
          )}
        </div>

        <form className="flex flex-col gap-3 overflow-y-auto p-6" onSubmit={handleSubmit}>
          {rows.map((row, index) => (
            <div key={index} className="border border-border-subtle rounded-lg p-3 flex flex-col gap-3 relative">
              {rows.length > 1 && (
                <button type="button" onClick={() => removeRow(index)}
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-negative-rose text-white flex items-center justify-center shadow hover:bg-negative-rose/80 transition-colors">
                  <span className="material-symbols-outlined text-[12px]">close</span>
                </button>
              )}
              <div className="flex flex-col gap-1">
                <label className="font-label-caps text-[10px] font-semibold text-on-surface-variant">Descrição</label>
                <input type="text" placeholder="Ex: Internet, Aluguel, Streaming..." value={row.description}
                  onChange={(e) => setRow(index, { description: e.target.value })}
                  className="w-full px-2 py-1.5 bg-surface-container-lowest border border-border-subtle rounded-lg font-body-sm text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-label-caps text-[10px] font-semibold text-on-surface-variant">Valor</label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-on-surface font-label-numeric text-xs">R$</span>
                    <input type="number" min="0" step="0.01" placeholder="0,00" value={row.amount}
                      onChange={(e) => setRow(index, { amount: e.target.value })}
                      className="w-full pl-7 pr-2 py-1.5 bg-surface-container-lowest border border-border-subtle rounded-lg font-label-numeric text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-caps text-[10px] font-semibold text-on-surface-variant">Data de Vencimento</label>
                  <input type="date" value={row.fixedExpenseDate}
                    onChange={(e) => setRow(index, { fixedExpenseDate: e.target.value })}
                    className="w-full px-2 py-1.5 bg-surface-container-lowest border border-border-subtle rounded-lg font-body-sm text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                </div>
              </div>
            </div>
          ))}

          <button type="button" onClick={addRow}
            className="flex items-center justify-center gap-2 border border-dashed border-border-subtle rounded-lg py-2 font-label-caps text-xs font-semibold text-primary hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-[16px]">add</span>
            Adicionar outra despesa fixa
          </button>

          {submitError && <p className="font-body-sm text-sm text-negative-rose">{submitError}</p>}
          {copiedCount > 0 && (
            <p className="font-body-sm text-sm text-positive-emerald">
              {copiedCount} despesa(s) importada(s) — revise e ajuste as datas antes de salvar.
            </p>
          )}

          <div className="flex justify-end gap-1 mt-3 pt-3 border-t border-border-subtle flex-shrink-0">
            <button type="button" onClick={onClose}
              className="px-4 py-2 font-label-caps text-xs font-semibold text-primary hover:bg-surface-container-low rounded-lg transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              className="px-4 py-2 font-label-caps text-xs font-semibold bg-primary text-on-primary rounded-lg shadow-sm hover:bg-primary-container transition-colors active:scale-95 duration-200 disabled:opacity-60 disabled:cursor-not-allowed">
              {saving ? 'Salvando...' : 'Salvar Despesa(s) Fixa(s)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
