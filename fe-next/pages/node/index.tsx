import ProductList from "@/components/product-list";
import { useState, useEffect } from "react";
import { IoIosAddCircle, IoIosArrowBack } from "react-icons/io";

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

  const [showDetails, setShowDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const openDetails = (product: Product) => {
    setSelectedProduct(product);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setSelectedProduct(null);
    setShowDetails(false);
  };

  useEffect(() => {
    if (showDetails) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showDetails]);

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

    if (
      !productToSend.name ||
      !productToSend.description ||
      !productToSend.price
    ) {
      alert("name, description, and price are required");
      return;
    }

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

      <div className="flex flex-col my-4 gap-2">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          style={{ marginRight: "1rem" }}
          className="w-full border border-gray-300 rounded-md p-2"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          style={{ marginRight: "1rem" }}
          className="w-full border border-gray-300 rounded-md p-2"
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
        />
        <IoIosAddCircle
          onClick={handleSubmit}
          size={32}
          className="cursor-pointer self-center"
        />
      </div>

      <ProductList
        products={products}
        showDetails={showDetails}
        selectedProduct={selectedProduct}
        setShowDetails={setShowDetails}
        setSelectedProduct={setSelectedProduct}
      />
    </div>
  );
}
