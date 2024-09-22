import React from "react";

interface ConfirmDialogProps {
    message: string;
    todoTitle: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    message,
    todoTitle,
    onConfirm,
    onCancel,
}) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded shadow-lg">
                <p>{message}</p>
                <p className="mt-2 font-bold">「{todoTitle}」</p>
                <div className="flex justify-end gap-4 mt-4">
                    <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded-md">
                        キャンセル
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded-md"
                    >
                        削除
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
