"use client";
import React from "react";
import { useEffect, useState } from "react";
import db from "@/lib/firebase/firebase";
import { collection, deleteDoc, doc, getDocs, addDoc } from "firebase/firestore";
import { auth, provider } from "@/lib/firebase/firebase";
import { signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import ConfirmDialog from "./ConfirmDialog";

import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
    const [todos, setTodos] = useState([]);
    const [id, setId] = useState("");
    const [text, setText] = useState("");
    const [user] = useAuthState(auth);
    const [uid, setUid] = useState("");
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        addTodo(id, text);
        fetchTodos();
        setId("");
        setText("");
    };

    const fetchTodos = async () => {
        if (!uid) {
            console.error("UIDが設定されていません");
            return;
        }
        const todos = await getDocs(collection(db, `users/${uid}/todos`)).then((snapshot) =>
            snapshot.docs.map((doc) => ({
                docId: doc.id,
                ...doc.data(),
            }))
        );
        setTodos(todos);
    };

    const addTodo = async (id, title) => {
        await addDoc(collection(db, `users/${uid}/todos`), {
            title: title,
            createdAt: Date.now(),
        });
        fetchTodos();
        toast.success("ブックマークに追加しました");
    };

    const deleteTodo = async (todo) => {
        setSelectedTodo(todo);
        setShowConfirmDialog(true);
    };

    const confirmDelete = async () => {
        if (!selectedTodo || !user) return;
        const todoDoc = doc(db, `users/${user.uid}/todos`, selectedTodo.docId);
        await deleteDoc(todoDoc);
        fetchTodos();
        toast.success("ブックマークから削除しました");
        setShowConfirmDialog(false);
        setSelectedTodo(null);
    };

    const cancelDelete = () => {
        setShowConfirmDialog(false);
        setSelectedTodo(null);
    };

    const signInWithGoogle = async () => {
        if (isAuthenticating) return;
        setIsAuthenticating(true);
        try {
            const result = await signInWithPopup(auth, provider);
            setUid(result.user.uid);
        } catch (error) {
            console.error("Error during signIn:", error);
        } finally {
            setIsAuthenticating(false);
        }
    };

    const signOutWithGoogle = () => {
        auth.signOut();
        setTodos([]);
    };

    useEffect(() => {
        if (user) {
            setUid(user.uid);
        }
    }, [user]);

    useEffect(() => {
        if (uid) {
            fetchTodos();
        }
    }, [uid]);

    return (
        <main className="p-8">
            <h1 className="px-4 py-2 bg-blue-300 mb-4">Todo List</h1>
            {user ? (
                <button
                    onClick={signOutWithGoogle}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow"
                >
                    ログアウト
                </button>
            ) : (
                <button
                    onClick={signInWithGoogle}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow"
                    disabled={isAuthenticating}
                >
                    {isAuthenticating ? "認証中..." : "Googleログインして開始する"}
                </button>
            )}
            {todos.map((todo, index) => (
                <div key={index} className="flex items-center gap-2 mb-4">
                    <p>{todo.title}</p>
                    <button
                        onClick={() => deleteTodo(todo)}
                        className="px-2 py-1 bg-red-500 text-white"
                    >
                        Delete
                    </button>
                </div>
            ))}
            <form onSubmit={handleSubmit} className="mb-6">
                <label className="flex items-center gap-3 px-4 py-3 border border-primary/30 focus-within:border-primary/70 w-full max-w-full rounded-sm">
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        type="text"
                        name="title"
                        placeholder="title"
                        className="block p-0 w-full appearance-none outline-none bg-transparent border-transparent placeholder:text-primary"
                    />
                </label>
                <button type="submit" className="px-4 py-2 border rounded-md">
                    送信
                </button>
            </form>
            {showConfirmDialog && selectedTodo && (
                <ConfirmDialog
                    message="このタスクを本当に削除してもよろしいですか？"
                    todoTitle={selectedTodo.title}
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
            <ToastContainer
                position="top-center"
                autoClose={2500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Slide}
            />
        </main>
    );
}
