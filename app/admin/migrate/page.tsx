"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function MigratePage() {
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<any>(null)
  const { toast } = useToast()

  const runMigration = async () => {
    setIsRunning(true)
    setResult(null)

    try {
      const response = await fetch("/api/db/run-migration", {
        method: "POST",
      })

      const data = await response.json()
      setResult(data)

      if (data.success) {
        toast({
          title: "Success",
          description: "Migration completed successfully!",
        })
      } else if (data.needsSQLMigration) {
        toast({
          title: "SQL Migration Required",
          description: "Please run the SQL migration in Supabase SQL Editor",
          variant: "destructive",
          duration: 10000,
        })
      } else {
        toast({
          title: "Migration Issues",
          description: data.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Migration error:", error)
      toast({
        title: "Error",
        description: "Failed to run migration",
        variant: "destructive",
      })
    } finally {
      setIsRunning(false)
    }
  }

  const copySQL = () => {
    if (result?.migrationSQL) {
      navigator.clipboard.writeText(result.migrationSQL)
      toast({
        title: "Copied!",
        description: "Migration SQL copied to clipboard",
      })
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Database Migration</h1>

      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Run Migration</h2>
          <Button onClick={runMigration} disabled={isRunning}>
            {isRunning ? "Running..." : "Run Migration"}
          </Button>
        </div>

        {result && (
          <div className="space-y-4">
            <div
              className={`p-4 rounded-lg ${
                result.success
                  ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                  : result.needsSQLMigration
                  ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                  : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
              }`}
            >
              <p className="font-medium">{result.message}</p>
            </div>

            {result.results && result.results.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Results:</h3>
                <pre className="bg-muted p-4 rounded-lg text-sm whitespace-pre-wrap">
                  {result.results.join("\n")}
                </pre>
              </div>
            )}

            {result.errors && result.errors.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 text-red-600 dark:text-red-400">
                  Errors:
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  {result.errors.map((error: string, idx: number) => (
                    <li key={idx} className="text-sm text-red-600 dark:text-red-400">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.needsSQLMigration && result.migrationSQL && (
              <div>
                <div className="flex gap-2 mb-2">
                  <Button onClick={copySQL} variant="outline" size="sm">
                    Copy SQL
                  </Button>
                  <Button
                    onClick={() => window.open("https://supabase.com/dashboard", "_blank")}
                    variant="outline"
                    size="sm"
                  >
                    Open Supabase
                  </Button>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-mono whitespace-pre-wrap text-xs">
                    {result.migrationSQL}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}






