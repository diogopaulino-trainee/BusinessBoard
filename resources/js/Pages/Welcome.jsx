import { Head, Link } from "@inertiajs/react";
import { Briefcase, MoveRight, ArrowRight } from "lucide-react";

export default function Welcome() {
    return (
        <>
            <Head title="Business Board" />
            <div className="bg-gray-900 text-gray-100 min-h-screen flex flex-col items-center justify-center px-6">
                {/* Cabeçalho */}
                <header className="text-center space-y-4">
                    <h1 className="text-4xl font-bold flex items-center gap-2">
                        <Briefcase className="text-blue-400" size={40} />
                        Welcome to Business Board
                    </h1>
                    <p className="text-lg text-gray-400 max-w-xl mx-auto">
                        A powerful tool to manage and track your businesses in a simple and organized way.
                    </p>
                </header>

                {/* Introdução ao Business Board */}
                <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl text-center">
                    <h2 className="text-2xl font-semibold flex items-center justify-center gap-2">
                        <MoveRight size={24} className="text-blue-400" /> Start Managing Your Businesses
                    </h2>
                    <p className="mt-2 text-gray-300">
                        Drag and drop businesses across different states, filter by type, and track key insights in real-time.
                    </p>
                    <Link
                        href="/business-board"
                        className="mt-4 inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-md font-semibold shadow-md transition hover:bg-blue-600"
                    >
                        Go to Business Board
                        <ArrowRight size={18} />
                    </Link>
                </div>

                {/* Footer */}
                <footer className="mt-10 text-gray-500 text-sm">
                    Built with Laravel & React | © {new Date().getFullYear()}
                </footer>
            </div>
        </>
    );
}
