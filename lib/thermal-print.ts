/**
 * Thermal receipt printing for 80mm printers (e.g. XP-Q809K).
 * Uses the browser print dialog; user selects the thermal printer.
 * Page is sized 80mm width, height varies with content.
 */

const BODY_PRINT_CLASS = "thermal-print-active"

export function triggerThermalPrint(printRoot: HTMLElement | null): void {
  if (typeof window === "undefined" || !printRoot) return

  const body = document.body
  if (!body) return

  printRoot.classList.add("thermal-print-root")

  const cleanup = () => {
    body.classList.remove(BODY_PRINT_CLASS)
    printRoot.classList.remove("thermal-print-root")
    window.removeEventListener("afterprint", onAfterPrint)
  }

  const onAfterPrint = () => {
    cleanup()
  }

  window.addEventListener("afterprint", onAfterPrint)
  body.classList.add(BODY_PRINT_CLASS)

  requestAnimationFrame(() => {
    window.print()
  })
}
