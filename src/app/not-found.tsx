import Link from 'next/link';
export const runtime = 'edge'; // この行を追加

export default function NotFound() {
  return (
    <main className="container mx-auto p-4 pt-8 max-w-2xl text-center">
      <h1 className="text-3xl font-bold text-yellow-600 mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-700">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link href="/" className="text-blue-500 hover:underline mt-6 inline-block">
        Go to Homepage
      </Link>
    </main>
  );
}