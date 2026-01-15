export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export const api = {
  async get<T>(url: string) {
    const res = await fetch(`${BASE_URL}${url}`)
    if (!res.ok) throw new Error(await res.text())
    return res.json() as Promise<T>
  },
  async post<T>(url: string, body: any) {
    const res = await fetch(`${BASE_URL}${url}`, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(body) 
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json() as Promise<T>
  }
}
