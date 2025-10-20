import React from 'react'
import { useParams } from 'react-router-dom'
import useFetchData from '../hooks/useFetchData'
import useCart from '../hooks/useCart'
import useAuth from '../hooks/useAuth'

export default function MangaDetails() {
  const { id } = useParams()
  const { data, loading } = useFetchData(`/api/manga/read_single.php?id=${id}`, [id])
  const { add } = useCart()
  const { user } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!data || data.error) return <div>Not found</div>

  const manga = data

  const handleAddToCart = () => {
    if (!user) return alert('Please login to add manga to cart.')
    if (user.role === 'admin') return alert('Admins cannot add manga to cart.')

    add({
      manga_id: manga.manga_id,
      title: manga.title,
      price: manga.price,
      qty: 1,
    })
    alert(`${manga.title} added to cart!`)
  }

  return (
    <div className="row mt-4">
      <div className="col-md-4">
        <img
          src={manga.image_url || `http://localhost/MangaStore/uploads/${manga.image}`}
          alt={manga.title}
          className="img-fluid rounded shadow-sm"
        />
      </div>

      <div className="col-md-8">
        <h2>{manga.title}</h2>
        <p className="text-muted">{manga.author}</p>
        <p>{manga.description}</p>
        <p><strong>Price:</strong> ₱{manga.price}</p>
        <p><strong>Category:</strong> {manga.category_name}</p>

        {user && user.role !== 'admin' ? (
          <button className="btn btn-primary" onClick={handleAddToCart}>Add to Cart</button>
        ) : (
          <button className="btn btn-secondary" disabled>Login to add</button>
        )}
      </div>
    </div>
  )
}
