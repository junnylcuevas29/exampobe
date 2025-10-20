import useLocalStorage from './useLocalStorage'
export default function useCart(){
  const [cart, setCart] = useLocalStorage('manga_cart', [])
  const add = (item) => {
    setCart(prev => {
      const i = prev.find(p => p.manga_id === item.manga_id)
      if (i) return prev.map(p => p.manga_id===item.manga_id ? {...p, qty: p.qty+item.qty} : p)
      return [...prev, item]
    })
  }
  const remove = (manga_id) => setCart(prev => prev.filter(p => p.manga_id !== manga_id))
  const update = (manga_id, qty) => setCart(prev => prev.map(p => p.manga_id===manga_id ? {...p, qty} : p))
  const clear = () => setCart([])
  const total = cart.reduce((s, c) => s + (c.price * c.qty), 0)
  return { cart, add, remove, update, clear, total, setCart }
}
