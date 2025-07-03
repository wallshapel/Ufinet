import React from 'react';

type Props = {
    src: string;
    onClose: () => void;
};

export default function ImageModal({ src, onClose }: Props) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded shadow-lg max-w-2xl w-full relative">
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
                    onClick={onClose}
                    aria-label="Cerrar"
                >
                    ×
                </button>
                <img src={src} alt="Portada del libro" className="max-h-[70vh] mx-auto" />
            </div>
        </div>
    );
}
