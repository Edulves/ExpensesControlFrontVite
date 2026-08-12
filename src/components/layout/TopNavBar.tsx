interface TopNavBarProps {
  title: string
  subtitle?: string
  searchPlaceholder?: string
  onMenuClick?: () => void
}

export default function TopNavBar({
  title,
  subtitle,
  searchPlaceholder,
  onMenuClick,
}: TopNavBarProps) {
  return (
    <header className="bg-surface w-full border-b border-border-subtle flex flex-col flex-shrink-0 z-30 relative">
      <div className="h-16 flex justify-between items-center px-4 md:px-8">
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="md:hidden text-on-surface-variant p-2 -ml-2 rounded-full hover:bg-surface-container transition-colors flex-shrink-0"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="min-w-0">
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-2xl font-semibold md:text-4xl font-semibold text-primary truncate">
              {title}
            </h2>
            {subtitle && (
              <p className="hidden md:block font-body-lg text-base text-on-surface-variant mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {searchPlaceholder && (
            <div className="hidden md:flex items-center bg-surface-container-lowest border border-border-subtle rounded-full px-4 py-2 w-64 focus-within:ring-2 ring-primary-container transition-shadow">
              <span className="material-symbols-outlined text-outline mr-2 text-sm">
                search
              </span>
              <input
                className="bg-transparent border-none outline-none text-sm font-body-sm w-full text-on-surface placeholder-outline focus:ring-0 p-0"
                placeholder={searchPlaceholder}
                type="text"
              />
            </div>
          )}
          <button className="text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer active:opacity-80 p-2 rounded-full relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-negative-rose rounded-full" />
          </button>
          <button className="hidden sm:inline-flex text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer active:opacity-80 p-2 rounded-full">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="ml-1 w-8 h-8 rounded-full bg-surface-variant border border-border-subtle overflow-hidden flex-shrink-0">
            <img
              alt="User profile photo"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRXua6uEgMX-hORyLlItGzV6JlfSm0yDcpe2sSCmwuVyBo8cGB7vwMYZEbDCyOTt3unqkt2U49Wm8450tFw_MDbML9DElsqZhkXg28pHlgyfqtGqKCEW5_jRuJUAPcoidCpttKcdVNEJC-MJvoHB3tFJQQUuSjIoxHrtyPsz7ElgJTcNvas83aoB1GbK2f2jVqTUvNuNM6BgBjA4TyvlvMi2d0_sSzhMau3HQwLb6gme0vgDx505Z4PA"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
