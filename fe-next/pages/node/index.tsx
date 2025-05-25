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

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col border border-gray-300 p-4 rounded h-full"
            onClick={() => openDetails(product)}
          >
            <h2 className="text-lg font-semibold truncate">{product.name}</h2>
            <img
              className="my-2"
              src="https://media.licdn.com/dms/image/v2/D560BAQF357LrMnXQZA/company-logo_200_200/company-logo_200_200/0/1684437939926/drxwear_logo?e=2147483647&v=beta&t=WN2VJBkGNlK8AIwFsCUCknphEfF-3es0Td_J705C4SY"
              alt="sample image drx"
            />
            <p className="flex-grow truncate">{product.description}</p>
            <h2 className="mt-2">Rp. {product.price.toFixed(3)}</h2>
          </div>
        ))}
      </div>

      {showDetails && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeDetails}
          />

          <div className="relative z-50 w-full max-w-md bg-white shadow-xl h-full overflow-y-auto">
            <div className="sticky top-0 bg-white flex p-4 w-full gap-4 border-b">
              <h1 className="text-2xl h-min">{selectedProduct?.name}</h1>
              <IoIosArrowBack
                onClick={closeDetails}
                className="cursor-pointer ml-auto"
                size={32}
              />
            </div>
            <div className="p-4">
              <img
                className="my-2 mx-auto"
                src="https://media.licdn.com/dms/image/v2/D560BAQF357LrMnXQZA/company-logo_200_200/company-logo_200_200/0/1684437939926/drxwear_logo?e=2147483647&v=beta&t=WN2VJBkGNlK8AIwFsCUCknphEfF-3es0Td_J705C4SY"
                alt="sample image drx"
              />
              <p className="text-justify">{selectedProduct?.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
