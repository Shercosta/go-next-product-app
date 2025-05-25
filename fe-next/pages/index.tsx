import Link from "next/link";
import { FaNode } from "react-icons/fa6";
import { RiResetLeftFill } from "react-icons/ri";
import { SiGo } from "react-icons/si";

const API_URL_GO =
  process.env.NEXT_PUBLIC_API_URL_GO || "http://localhost:3001";
const API_URL_NODE =
  process.env.NEXT_PUBLIC_API_URL_NODE || "http://localhost:3002";

export default function Home() {
  const reset = () => {
    fetch(`${API_URL_GO}/reset`, {
      method: "GET",
    });
    fetch(`${API_URL_NODE}/reset`, {
      method: "GET",
    });
    alert("Data has been reset on both Go and Node");
  };

  return (
    <div
      style={{ padding: "2rem" }}
      className="flex flex-col gap-4 items-center"
    >
      <h1>Shercosta&apos;s submission for the task</h1>

      <div className="flex gap-4">
        {/* <a className="bn39" href="/go">
          <span className="bn39span gap-2">
            Use <SiGo size={40} />
          </span>
        </a>
        <a className="bn39" href="/node">
          <span className="bn39span gap-2">
            Use <FaNode size={40} />
          </span>
        </a> */}
        <Link href="/go" className="bn39">
          <span className="bn39span gap-2">
            Use <SiGo size={40} />
          </span>
        </Link>
        <Link href="/node" className="bn39">
          <span className="bn39span gap-2">
            Use <FaNode size={40} />
          </span>
        </Link>
      </div>

      <div>
        <button
          className="flex gap-2 items-center border border-gray-300 p-2 rounded-md bg-gray-100"
          onClick={reset}
        >
          Reset data <RiResetLeftFill size={30} />
        </button>
      </div>
    </div>
  );
}
