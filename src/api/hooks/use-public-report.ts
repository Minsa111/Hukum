// src/hooks/useReports.ts
import { useState, useEffect } from "react"
import { fetchWithAuth } from "@/controllers/fetchwithauths"
import { API_PUBLIC, API_PURCHASE, } from "@/api/api"
import { toast } from "sonner"

export function usePublicReports() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const reload = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetchWithAuth(`${API_PURCHASE}${API_PUBLIC}`)
      setData(response)
    } catch (err: any) {
      toast.error(`Error fetching reports: ${err}`)
      console.error("❌ Error fetching reports:", err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [])

  return { data, loading, error, reload }
}
