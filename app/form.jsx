"use client";

import React, { useState } from "react";
import db from "@/lib/firebase/firebase";
import {
    Timestamp,
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    setDoc,
    addDoc,
    updateDoc,
    where,
} from "firebase/firestore";

export const fetchTodos = async () => {
    const todos = await getDocs(collection(db, "todos")).then((snapshot) =>
        snapshot.docs.map((doc) => {
            return doc.data();
        })
    );
    return todos;
};

const addTodo = async (id, title) => {
    await addDoc(collection(db, "todos"), {
        id: id,
        title: title,
        createdAt: Date.now(),
    });
};

const TodoForm = () => {
    const [id, setId] = useState("");
    const [text, setText] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        addTodo(id, text);
        fetchTodos();
        setId("");
        setText("");
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <label className="flex items-center gap-3 px-4 py-3 border border-primary/30 focus-within:border-primary/70 w-full max-w-full rounded-sm">
                <input
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    type="text"
                    name="id"
                    placeholder="id"
                    className="block p-0 w-full appearance-none outline-none bg-transparent border-transparent placeholder:text-primary"
                />
            </label>
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
            <button type="submit">送信</button>
            {/* <button onSubmit={handleSubmit}>送信</button> */}
        </form>
    );
};

export default TodoForm;
