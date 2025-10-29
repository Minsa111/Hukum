import { useState, useEffect } from "react"
import { fetchWithAuth } from "@/controllers/fetchwithauths"
import { API_PURCHASE} from "@/api/api"

export function useActivities(purchase_report_id?: string) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const reload = async () => {
    if (!purchase_report_id) return
    try {
      const res = await fetchWithAuth(`${API_PURCHASE}/${purchase_report_id}`)
      setData(res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [purchase_report_id])

  return { data, loading, reload }
}
