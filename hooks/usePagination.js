import { useState, useMemo } from 'react'
export default function usePagination(items = [], pageSize = 10){
  const [page, setPage] = useState(1)
  const total = Math.ceil(items.length / pageSize)
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize
    return items.slice(start, start + pageSize)
  }, [items, page, pageSize])
  return { page, setPage, total, paged }
}
