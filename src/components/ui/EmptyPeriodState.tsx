interface EmptyPeriodStateProps {
    description: string;
    title?: string;
    className?: string;
}

// Estado vazio padrão das telas quando o período/filtro selecionado não tem lançamentos.
export default function EmptyPeriodState({ description, title = "Nenhum lançamento para o período selecionado", className = "" }: EmptyPeriodStateProps) {
    return (
        <div className={`bg-surface-container-lowest border border-border-subtle rounded-xl p-6 flex flex-col items-center justify-center text-center ${className}`}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-surface-container-low text-on-surface-variant">
                <span className="material-symbols-outlined text-2xl">event_busy</span>
            </div>
            <p className="font-body-lg text-base text-on-surface mb-1">{title}</p>
            <p className="font-body-sm text-sm text-on-surface-variant">{description}</p>
        </div>
    );
}
