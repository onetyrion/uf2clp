import { InstallButton } from '../atoms/InstallButton';

export const Navbar = () => {
    return (
        <nav className="max-w-5xl mx-auto p-6 flex justify-between items-center">
            <h1 className="text-2xl font-extrabold tracking-tighter">
                uf2<span className="text-blue-600">clp.cl</span>
            </h1>
            <div className="flex items-center gap-4">
                <InstallButton />
                {/* <ThemeToggle /> */}
            </div>
        </nav>
    );
};
