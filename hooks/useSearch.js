import { useState, useMemo } from 'react'
export default function useSearch(items = [], fields = []) {
  const [query, setQuery] = useState('')
  const results = useMemo(() => {
    if (!query) return items
    const q = query.toLowerCase()
    return items.filter(it => fields.some(f => (''+it[f]).toLowerCase().includes(q)))
  }, [items, fields, query])
  return { query, setQuery, results }
}
