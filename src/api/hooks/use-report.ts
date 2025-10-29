// src/hooks/useReports.ts
import { useState, useEffect } from "react"
import { fetchWithAuth } from "@/controllers/fetchwithauths"
import { API_PURCHASE, API_SCHOOL } from "@/api/api"
import { toast } from "sonner"

export function useReports(school_id: string | null) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const reload = async () => {
    if (!school_id) return
    setLoading(true)
    setError(null)
    try {
      const response = await fetchWithAuth(`${API_PURCHASE}${API_SCHOOL}/${school_id}`)
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
  }, [school_id])

  return { data, loading, error, reload }
}
