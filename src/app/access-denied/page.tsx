import Link from 'next/link';
export const runtime = 'edge';

export default function AccessDeniedPage() {
    return (
        <main className="container mx-auto p-4 pt-8 max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-lg text-gray-700">
            You do not have the necessary permissions to view this content.
        </p>
        <p className="text-md text-gray-600 mt-2">
            Please ensure you are a member of the required Discord server and have successfully verified your membership.
        </p>
        <Link href="/" className="text-blue-500 hover:underline mt-6 inline-block">
            Go to Homepage
        </Link>
        </main>
    );
}