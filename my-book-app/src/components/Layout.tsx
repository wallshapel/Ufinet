type Props = {
    children: React.ReactNode;
};

export default function Layout({ children }: Props) {
    return (
        <div className="min-h-screen bg-white text-gray-900">
            <header className="bg-blue-700 text-white p-4 shadow">
                <h1 className="text-xl font-bold">My Book App</h1>
            </header>
            <main className="p-4">
                {children}
            </main>
        </div>
    );
}
