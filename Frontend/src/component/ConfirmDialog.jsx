export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="bg-card border border-border-custom rounded-xl shadow-lg max-w-sm w-full p-6">
                <h3 className="text-lg font-semibold text-text-main mb-2">{title}</h3>
                <p className="text-text-secondary mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg bg-gray-200 text-text-main hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
