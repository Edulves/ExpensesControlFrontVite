import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  sublabel: string
  icon: string
  children: ReactNode
  accentColor?: string
}

export default function StatCard({
  label,
  sublabel,
  icon,
  children,
  accentColor,
}: StatCardProps) {
  return (
    <div className="bg-surface-container-lowest border border-border-subtle p-6 rounded-xl flex flex-col justify-between h-full relative overflow-hidden">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-body-lg text-base text-on-surface-variant">{label}</h3>
          <p className="font-body-sm text-sm text-outline mt-1">{sublabel}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-surface-container-high text-primary flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
      </div>
      <div>{children}</div>
      {accentColor && (
        <div className={`absolute bottom-0 left-0 w-full h-1 ${accentColor} opacity-80`} />
      )}
    </div>
  )
}
