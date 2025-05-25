import { useState, useEffect } from "react";
import { FaNode } from "react-icons/fa6";
import { SiGo } from "react-icons/si";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL_GO || "http://localhost:3001";

export default function Home() {
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
    <div
      style={{ padding: "2rem" }}
      className="flex flex-col gap-4 items-center"
    >
      <h1>Shercosta's submission for the task</h1>

      <div className="flex gap-4">
        <a className="bn39" href="/go">
          <span className="bn39span gap-2">
            Use <SiGo size={40} />
          </span>
        </a>
        <a className="bn39" href="/node">
          <span className="bn39span gap-2">
            Use <FaNode size={40} />
          </span>
        </a>
      </div>
    </div>
  );
}
