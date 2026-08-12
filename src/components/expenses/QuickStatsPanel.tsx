interface TopCategory {
    categoryId: string;
    label: string;
    amount: number;
    color: string;
}

interface QuickStatsPanelProps {
    totalToday: number;
    topCategories: TopCategory[];
}

export default function QuickStatsPanel({ totalToday, topCategories }: QuickStatsPanelProps) {
    return (
        <div className="flex flex-col gap-6">
            {/* Stat Card */}
            <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 flex flex-col justify-center items-center text-center shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-surface-container-low to-surface-bright opacity-50 pointer-events-none" />
                <h4 className="font-label-caps text-lg font-semibold text-on-surface-variant relative z-10">GASTOS TOTAIS</h4>
                <p className="text-[40px] leading-[48px] font-bold text-on-surface mt-1 font-label-numeric relative z-10">
                    {totalToday.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    })}
                </p>
            </div>

            {/* Category Breakdown Snippet */}
            <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 flex flex-col shadow-sm">
                <h4 className="font-title-md text-xl font-semibold text-on-surface mb-3">Top Categories</h4>
                <ul className="flex flex-col gap-3">
                    {topCategories.map((category) => (
                        <li key={category.categoryId} className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${category.color}`} />
                                <span className="font-body-sm text-on-surface">{category.label}</span>
                            </div>
                            <span className="font-label-numeric text-sm font-medium text-on-surface-variant">${category.amount.toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
