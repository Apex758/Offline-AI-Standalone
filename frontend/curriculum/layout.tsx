import type { ReactNode } from "react"

export default function CurriculumLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">{children}</div>
    </div>
  )
}
