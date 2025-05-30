export default function Spinner() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/60 z-50">
            <img
                src="/src/assets/spinner.svg"
                alt="Cargando..."
                className="w-12 h-12"
            />
        </div>
    );
}
