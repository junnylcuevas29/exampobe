import React, { useState, useEffect } from 'react';

export default function ManageManga() {
  const [manga, setManga] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: '',
    author: '',
    price: '',
    stock: '',
    category_id: '',
    image: '',
    description: ''
  });
  const [imageFile, setImageFile] = useState(null);

  const loadCategories = async () => {
    const res = await fetch('/api/admin/categories.php');
    const data = await res.json();
    setCategories(data);
  };

  const loadManga = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/manga.php');
    const data = await res.json();
    setManga(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
    loadManga();
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  Object.entries(form).forEach(([key, value]) => {
    formData.append(key, value);
  });

  if (imageFile) {
    formData.append('image', imageFile);
  }

 
  if (editing) {
    formData.append('manga_id', editing.manga_id);

    const res = await fetch('/api/admin/manga.php', {
      method: 'POST',
      body: formData,
    });

    const json = await res.json();
    if (json.error) {
      alert('❌ ' + json.error);
    } else {
      alert('✅ Manga updated!');
      setEditing(null);
      setForm({
        title: '',
        author: '',
        price: '',
        stock: '',
        category_id: '',
        image: '',
        description: '',
      });
      setImageFile(null);
      loadManga();
    }
    return;
  }

  
  const res = await fetch('/api/admin/manga.php', {
    method: 'POST',
    body: formData,
  });

  const json = await res.json();
  if (json.error) {
    alert('❌ ' + json.error);
  } else {
    alert('✅ Manga added!');
    setForm({
      title: '',
      author: '',
      price: '',
      stock: '',
      category_id: '',
      image: '',
      description: '',
    });
    setImageFile(null);
    loadManga();
  }
};


  const handleEdit = (m) => {
    setEditing(m);
    setForm(m);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this manga?')) return;
    await fetch('/api/admin/manga.php', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ manga_id: id }),
    });
    alert('🗑️ Manga deleted!');
    loadManga();
  };

  if (loading) return <div>Loading manga...</div>;

  return (
    <div>
      <h2>Manage Manga</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-2">
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Author"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="Price"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="Stock"
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
          </div>

          <div className="col-md-2">
            <select
              className="form-select"
              value={form.category_id}
              onChange={(e) =>
                setForm({ ...form, category_id: e.target.value })
              }
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.category_id} value={c.category_id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-12">
            <input
              className="form-control"
              type="file"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
            {form.image && (
              <small className="text-muted">Current: {form.image}</small>
            )}
          </div>

          <div className="col-md-12">
            <textarea
              className="form-control"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div className="col-md-12 text-end">
            <button className="btn btn-primary">
              {editing ? 'Update Manga' : 'Add Manga'}
            </button>
          </div>
        </div>
      </form>

      <div className="table-scroll">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Image</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {manga.map((m) => (
              <tr key={m.manga_id}>
                <td>{m.manga_id}</td>
                <td>{m.title}</td>
                <td>
                  {m.image ? (
                    <img
                      src={
                        m.image_url ||
                        'http://localhost/MangaStore/uploads/default.jpg'
                      }
                      alt={m.title}
                      width="60"
                      height="60"
                      className="rounded"
                    />
                  ) : (
                    'No image'
                  )}
                </td>
                <td>{m.price}</td>
                <td>{m.stock}</td>
                <td>{m.category_name}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(m)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(m.manga_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
