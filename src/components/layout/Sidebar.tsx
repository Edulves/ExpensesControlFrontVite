import { NavLink, useNavigate } from 'react-router-dom'
import { navItems } from '../../data'
import { deleteCookie } from '../../utils/cookies'

interface SidebarProps {
  onNavigate?: () => void
}

const linkBaseClasses =
  'flex items-center gap-3 px-2 py-1 rounded-lg transition-all active:scale-95 duration-200 font-label-caps text-xs font-semibold'

export default function Sidebar({ onNavigate }: SidebarProps) {
  const navigate = useNavigate()

  const handleLogout = () => {
    deleteCookie('authToken')
    deleteCookie('tokenExpiration')
    navigate('/login')
  }

  return (
    <aside className="hidden md:flex flex-col py-6 px-2 bg-surface-container-lowest fixed left-0 top-0 h-full w-[240px] z-40 border-r border-border-subtle">
      {/* Header */}
      <div className="mb-6 flex items-center gap-2 px-2">
        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
          <span className="material-symbols-outlined">account_balance_wallet</span>
        </div>
        <div>
          <h1 className="font-title-md text-xl font-semibold text-primary tracking-tight">
            Expenses Control
          </h1>
          <p className="font-body-sm text-sm text-on-surface-variant opacity-70">
            Financial Calm
          </p>
        </div>
      </div>

      {/* CTA */}
      <button className="w-full bg-primary text-on-primary font-body-sm text-sm py-1 px-2 rounded flex items-center justify-center gap-2 hover:opacity-90 transition-opacity active:scale-95 shadow-sm mb-6">
        <span className="material-symbols-outlined" data-weight="fill">
          add
        </span>
        Add Expense
      </button>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            className={({ isActive }) =>
              isActive
                ? `${linkBaseClasses} bg-surface-container text-primary font-bold`
                : `${linkBaseClasses} text-on-surface-variant opacity-70 hover:bg-surface-container-low`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined"
                  data-weight={isActive ? 'fill' : undefined}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto space-y-1 pt-3 border-t border-border-subtle">
        <a
          href="#"
          className={`${linkBaseClasses} text-on-surface-variant opacity-70 hover:bg-surface-container-low`}
        >
          <span className="material-symbols-outlined">help</span>
          <span>Help</span>
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            handleLogout()
          }}
          className={`${linkBaseClasses} text-on-surface-variant opacity-70 hover:bg-surface-container-low`}
        >
          <span className="material-symbols-outlined">logout</span>
          <span>Logout</span>
        </a>
      </div>
    </aside>
  )
}
