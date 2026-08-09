import { createContext, useState, useCallback, useContext } from "react";

const ToastContext = createContext();

export function useToast() {
    return useContext(ToastContext);
}

export default function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = "success") => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 space-y-2">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`px-4 py-3 rounded-lg shadow-md text-sm font-medium text-white ${
                            t.type === "error" ? "bg-red-500" : "bg-primary"
                        }`}
                    >
                        {t.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
