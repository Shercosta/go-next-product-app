import { Product } from "@/pages/_app";
import { IoIosArrowBack } from "react-icons/io";

type ProductListProps = {
  products: Product[];
  showDetails: boolean;
  selectedProduct: Product | null;
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>;
};

export default function ProductList({
  products,
  showDetails,
  selectedProduct,
  setShowDetails,
  setSelectedProduct,
}: ProductListProps) {
  const openDetails = (product: Product) => {
    setSelectedProduct(product);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setSelectedProduct(null);
    setShowDetails(false);
  };

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">Product List</h1>
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
            <div className="absolute bottom-0 right-0 p-4">
              <h2>Rp. {selectedProduct?.price.toFixed(3)}</h2>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
