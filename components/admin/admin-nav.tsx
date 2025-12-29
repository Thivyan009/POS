"use client"

interface AdminNavProps {
  currentSection: string
  onSelectSection: (section: string) => void
}

export default function AdminNav({ currentSection, onSelectSection }: AdminNavProps) {
  const sections = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "menu", label: "Menu", icon: "🍽️" },
    { id: "users", label: "Users", icon: "👥" },
    { id: "bills", label: "Bills", icon: "🧾" },
  ]

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex lg:w-48 border-r border-border bg-card p-4">
        <div className="space-y-2 w-full">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSelectSection(section.id)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors text-sm ${
                currentSection === section.id ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
              }`}
            >
              <span className="mr-2">{section.icon}</span>
              {section.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-card z-50">
        <div className="grid grid-cols-4 h-16">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSelectSection(section.id)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                currentSection === section.id ? "text-primary bg-primary/10" : "text-muted-foreground"
              }`}
            >
              <span className="text-lg">{section.icon}</span>
              <span className="text-xs font-medium">{section.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  )
}
