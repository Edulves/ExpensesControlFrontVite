interface TopNavBarProps {
    title: string;
    subtitle?: string;
    searchPlaceholder?: string;
    onMenuClick?: () => void;
}

export default function TopNavBar({ title, subtitle, onMenuClick }: TopNavBarProps) {
    return (
        <header className="bg-surface w-full border-b border-border-subtle flex flex-col flex-shrink-0 z-30 relative">
            <div className="h-20 flex justify-between items-center px-4 md:px-8">
                <div className="flex items-center gap-3 min-w-0">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={onMenuClick}
                        className="md:hidden text-on-surface-variant p-2 -ml-2 rounded-full hover:bg-surface-container transition-colors flex-shrink-0"
                    >
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <div className="min-w-0 pt-5 pb-5">
                        <h2 className="font-headline-lg-mobile md:font-headline-lg text-2xl font-semibold md:text-4xl text-primary truncate">
                            {title}
                        </h2>
                        {subtitle && <p className="hidden md:block font-body-lg text-base text-on-surface-variant mt-1">{subtitle}</p>}
                    </div>
                </div>
            </div>
        </header>
    );
}
