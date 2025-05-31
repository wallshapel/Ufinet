import spinner from '../../assets/spinner.svg';

export default function Spinner() {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <img
                src={spinner}
                alt="Cargando..."
                className="w-12 h-12 animate-spin"
            />
        </div>
    );
}
