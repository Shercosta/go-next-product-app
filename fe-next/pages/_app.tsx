// pages/_app.tsx

import type { AppProps } from "next/app";
import "../pages/global.css";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
};

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <div className="p-4">
      {router.pathname !== "/" && (
        <div className="flex flex-col gap-4 items-center">
          <div>
            <FontAwesomeIcon
              icon={faHouse}
              size="2xl"
              onClick={() => router.push("/")}
              className="cursor-pointer"
            />
          </div>
        </div>
      )}
      {/* <header>My Global Header</header> */}
      <main>
        <Component {...pageProps} />
      </main>
    </div>
  );
}
