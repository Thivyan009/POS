"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface AdminNavProps {
  currentSection: string
  onSelectSection: (section: string) => void
  mobileMenuOpen?: boolean
  onMobileMenuOpenChange?: (open: boolean) => void
}

export default function AdminNav({ currentSection, onSelectSection, mobileMenuOpen, onMobileMenuOpenChange }: AdminNavProps) {
  const sections = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "menu", label: "Menu", icon: "🍽️" },
    { id: "users", label: "Users", icon: "👥" },
    { id: "customers", label: "Customers", icon: "👤" },
    { id: "bills", label: "Bills", icon: "🧾" },
    { id: "discounts", label: "Discounts", icon: "🎫" },
  ]

  const handleSectionClick = (sectionId: string) => {
    onSelectSection(sectionId)
    if (onMobileMenuOpenChange) {
      onMobileMenuOpenChange(false)
    }
  }

  const NavContent = () => (
    <div className="space-y-2 w-full">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => handleSectionClick(section.id)}
          className={`w-full text-left px-4 py-3 rounded-lg transition-colors text-sm ${
            currentSection === section.id ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
          }`}
        >
          <span className="mr-2">{section.icon}</span>
          {section.label}
        </button>
      ))}
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex lg:w-48 xl:w-56 border-r border-border bg-card p-4">
        <NavContent />
      </nav>

      {/* Mobile/Tablet Sheet Drawer */}
      <Sheet open={mobileMenuOpen} onOpenChange={onMobileMenuOpenChange}>
        <SheetContent side="left" className="w-64 sm:w-72 p-0">
          <SheetHeader className="p-4 border-b border-border">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <NavContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
