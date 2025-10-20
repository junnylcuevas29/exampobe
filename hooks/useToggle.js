import { useState } from 'react'
export default function useToggle(initial=false){
  const [on, setOn] = useState(initial)
  const toggle = () => setOn(v => !v)
  return [on, toggle, setOn]
}
