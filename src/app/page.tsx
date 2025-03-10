import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Welcome to Question Visualiser!</h1>
      <div className="mt-4">
        <Link href="/example">
          <button className="px-4 py-2 bg-white text-black rounded cursor-pointer">
            Start Example Question
          </button>
        </Link>
      </div>
      <div className="mt-4">
        <Link href="/practise">
          <button className="px-4 py-2 bg-white text-black rounded cursor-pointer">
            Start Practise Question
          </button>
        </Link>
      </div>
      <div className="mt-4">
        <Link href="/test">
          <button className="px-4 py-2 bg-white text-black rounded cursor-pointer">
            Start Test Question
          </button>
        </Link>
      </div>
    </div>
  );
}
