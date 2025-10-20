import { useState, useEffect, useRef } from 'react'

export default function useFetchData(url, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  useEffect(() => {
    abortRef.current = new AbortController()
    setLoading(true)
    fetch(url, { signal: abortRef.current.signal })
      .then(res => res.json())
      .then(json => { setData(json); setLoading(false) })
      .catch(err => { if (err.name !== 'AbortError') setError(err); setLoading(false) })
    return () => abortRef.current.abort()
  
  }, deps)

  return { data, loading, error }
}
