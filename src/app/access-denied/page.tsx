export const runtime = 'edge';

export default function AccessDeniedPage() {
    return (
        <main className="container mx-auto p-4 pt-8 max-w-2xl text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-lg">You do not have the necessary permissions to view this content.</p>
            <p className="text-md">Please ensure you are a member of the required Discord server and have successfully verified your membership.</p>
        </main>
    );
}