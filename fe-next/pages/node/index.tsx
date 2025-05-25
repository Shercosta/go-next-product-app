import { useState, useEffect } from "react";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL_NODE || "http://localhost:3001";

export default function WithNode() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ name: "", description: "", price: "" });

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const productToSend = { ...form, price: parseFloat(form.price) };
    const res = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productToSend),
    });
    const newProduct = await res.json();
    setProducts([...products, newProduct]);
    setForm({ name: "", description: "", price: "" });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Product Management</h1>

      <div style={{ marginBottom: "1rem" }}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          style={{ marginRight: "1rem" }}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          style={{ marginRight: "1rem" }}
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
        />
        <button onClick={handleSubmit} style={{ marginLeft: "1rem" }}>
          Add Product
        </button>
      </div>

      <ul>
        {products.map(({ id, name, description, price }) => (
          <li key={id}>
            <b>{name}</b> - {description} (Rp. {price.toFixed(3)})
          </li>
        ))}
      </ul>
    </div>
  );
}
