import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {

    return (
        <main className={`${inter.className} min-h-[100vh] pt-52 text-center`}>
            <h1 className="text-3xl font-bold">This service has shut down on 2024/10/31.</h1>
            <p>This service is no longer available.</p>
        </main>
    );
}
