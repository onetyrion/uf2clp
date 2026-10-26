import { InstallButton } from '../atoms/InstallButton';

export const Navbar = () => {
    return (
        <nav aria-label="Navegación principal" className="max-w-5xl mx-auto p-6 flex justify-between items-center gap-4">
            <a href="/" className="text-2xl font-extrabold tracking-tighter shrink-0">
                uf2<span className="text-blue-600">clp.cl</span>
            </a>
            <div className="flex items-center gap-4 sm:gap-6">
                <a
                    href="/uf"
                    className="hidden sm:inline text-sm font-semibold text-slate-400 hover:text-blue-400 transition-colors"
                >
                    Historial
                </a>
                <a
                    href="/uf/manana"
                    className="hidden sm:inline text-sm font-semibold text-slate-400 hover:text-blue-400 transition-colors"
                >
                    UF mañana
                </a>
                <InstallButton />
            </div>
        </nav>
    );
};
