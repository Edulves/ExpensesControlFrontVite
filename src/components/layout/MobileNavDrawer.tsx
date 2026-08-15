import { NavLink, useNavigate } from "react-router-dom";
import { navItems } from "../../config/navigation";
import { deleteCookie } from "../../utils/cookies";

interface MobileNavDrawerProps {
    open: boolean;
    onClose: () => void;
}

export default function MobileNavDrawer({ open, onClose }: MobileNavDrawerProps) {
    const navigate = useNavigate();

    const handleLogout = () => {
        deleteCookie("authToken");
        deleteCookie("tokenExpiration");
        navigate("/login");
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm" onClick={onClose} />
            <aside className="absolute left-0 top-0 h-full w-[260px] bg-surface-container-lowest flex flex-col py-6 px-2 shadow-xl">
                <div className="mb-6 flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
                            <span className="material-symbols-outlined">account_balance_wallet</span>
                        </div>
                        <div>
                            <h1 className="font-title-md text-xl font-semibold text-primary tracking-tight">Controle de Despesas</h1>
                            <p className="font-label-md text-label-md text-on-surface-variant opacity-70">Calma Financeira</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-on-surface-variant p-2 rounded-full hover:bg-surface-container transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <nav className="flex-1 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) =>
                                isActive
                                    ? "flex items-center gap-3 px-2 py-1 rounded-lg bg-surface-container text-primary font-bold font-label-md text-label-md "
                                    : "flex items-center gap-3 px-2 py-1 rounded-lg text-on-surface-variant opacity-70 hover:bg-surface-container-low transition-all font-label-caps text-xs font-semibold"
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <span className="material-symbols-outlined" data-weight={isActive ? "fill" : undefined}>
                                        {item.icon}
                                    </span>
                                    <span>{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-auto pt-3 border-t border-border-subtle space-y-1">
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            handleLogout();
                        }}
                        className="flex items-center gap-3 px-2 py-1 rounded-lg text-on-surface-variant opacity-70 hover:bg-surface-container-low transition-all font-label-caps text-xs font-semibold"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        <span>Sair</span>
                    </a>
                </div>
            </aside>
        </div>
    );
}
