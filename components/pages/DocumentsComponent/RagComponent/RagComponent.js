"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

import {
    ThumbsUp,
    ThumbsDown,
    FileSearch,
    FolderSearch,
    SendHorizonal,
    ChevronLeft,
    ChevronRight,
    Loader2
} from "lucide-react";

import api from "@/lib/api";
import { usePaginatedDocuments } from "@/hooks/use-document";

export default function RagComponent() {
    const { data: session } = useSession();

    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "👋 Hola, selecciona los documentos antes de consultar.",
            sender: "bot",
        },
    ]);

    const [input, setInput] = useState("");

    const {
        documents,
        loading,
        hasNext,
        hasPrev,
        nextPage,
        prevPage,
        currentPage,
        totalPages,
    } = usePaginatedDocuments();

    const [selectedDocs, setSelectedDocs] = useState([]);
    const [openDocModal, setOpenDocModal] = useState(true);
    const [openFeedbackModal, setOpenFeedbackModal] = useState(false);

    const [feedbackReason, setFeedbackReason] = useState("");
    const [feedbackComment, setFeedbackComment] = useState("");
    const [answerToRate, setAnswerToRate] = useState(null);

    const messagesEndRef = useRef();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // -----------------------------------------------------
    // ENVIAR MENSAJE CON TYPING + LIMPIEZA DE INPUT
    // -----------------------------------------------------
    const sendMessage = async () => {
        if (!input.trim()) return;

        if (selectedDocs.length === 0) {
            alert("Selecciona documentos antes de realizar una consulta.");
            return;
        }

        const userMsg = { id: Date.now(), text: input, sender: "user" };

        // limpiar input inmediatamente
        const textToSend = input;
        setInput("");

        // agregar mensaje del usuario
        setMessages((prev) => [...prev, userMsg]);

        // agregar mensaje "typing"
        const typingId = Date.now() + 9999;
        setMessages((prev) => [
            ...prev,
            {
                id: typingId,
                sender: "typing",
                text: "El asistente está escribiendo...",
            },
        ]);

        try {
            const res = await api.post(
                "/document-rag/rag/",
                {
                    message: textToSend,
                    documents: selectedDocs,
                },
                {
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`,
                    },
                }
            );

            // eliminar mensaje typing
            setMessages((prev) => prev.filter((m) => m.id !== typingId));

            // añadir respuesta
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    text: res.data.response,
                    sender: "bot",
                    rateable: true,
                },
            ]);
        } catch (err) {
            console.error("Error en RAG:", err);

            setMessages((prev) => prev.filter((m) => m.id !== typingId));

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    text: "Hubo un error al consultar el asistente.",
                    sender: "bot",
                },
            ]);
        }
    };

    // -----------------------------------------------------
    // FEEDBACK
    // -----------------------------------------------------
    const markUseful = (id) => {
        setMessages((prev) =>
            prev.map((m) => (m.id === id ? { ...m, rated: "useful" } : m))
        );
    };

    const markNotUseful = (msg) => {
        setAnswerToRate(msg);
        setOpenFeedbackModal(true);
    };

    const submitFeedback = () => {
        setMessages((prev) =>
            prev.map((m) =>
                m.id === answerToRate.id ? { ...m, rated: "not_useful" } : m
            )
        );

        console.log("Feedback enviado:", {
            message_id: answerToRate.id,
            reason: feedbackReason,
            comment: feedbackComment,
        });

        setFeedbackReason("");
        setFeedbackComment("");
        setOpenFeedbackModal(false);
    };

    const toggleDocument = (id) => {
        setSelectedDocs((prev) =>
            prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
        );
    };

    // -----------------------------------------------------
    // UI COMPLETA
    // -----------------------------------------------------
    return (
        <div className="h-screen bg-gradient-to-b from-gray-50 to-gray-200 flex items-center justify-center relative">
            
            {/* BOTÓN CAMBIAR DOCUMENTOS */}
            <Button
                className="fixed top-6 right-6 rounded-full shadow-lg bg-[#003b99] hover:bg-[#002d73]"
                onClick={() => setOpenDocModal(true)}
            >
                <FolderSearch className="mr-2 h-5 w-5" />
                Cambiar documentos
            </Button>

            {/* MODAL DE DOCUMENTOS */}
            <Dialog open={openDocModal} onOpenChange={setOpenDocModal}>
                <DialogContent className="max-w-lg rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                            <FileSearch size={22} />
                            Selecciona documentos
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 mt-4 max-h-64 overflow-y-auto">
                        {loading ? (
                            <p className="text-gray-500">Cargando documentos...</p>
                        ) : (
                            documents.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition"
                                >
                                    <Checkbox
                                        checked={selectedDocs.includes(doc.id)}
                                        onCheckedChange={() => toggleDocument(doc.id)}
                                    />
                                    <span className="text-sm">{doc.name}</span>
                                </div>
                            ))
                        )}
                    </div>

                    {/* PAGINACIÓN */}
                    <div className="flex justify-between mt-4 px-2 items-center">
                        <Button disabled={!hasPrev} onClick={prevPage} size="sm">
                            <ChevronLeft /> Anterior
                        </Button>

                        <span className="text-sm text-gray-600">
                            Página {currentPage} de {totalPages}
                        </span>

                        <Button disabled={!hasNext} onClick={nextPage} size="sm">
                            Siguiente <ChevronRight />
                        </Button>
                    </div>

                    <DialogFooter>
                        <Button
                            className="bg-[#003b99]"
                            onClick={() => setOpenDocModal(false)}
                        >
                            Confirmar selección
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* CHAT COMPLETO */}
            <Card className="w-full h-3/4 max-w-4xl flex flex-col rounded-2xl shadow-2xl bg-white">
                <div className="px-6 py-4 border-b bg-white/80 rounded-t-2xl">
                    <h2 className="text-xl font-bold text-[#003b99]">Asistente RAG</h2>
                </div>

                <CardContent className="flex-1 flex flex-col">
                    <ScrollArea className="flex-1 pr-4 py-4">
                        <div className="space-y-5">

                            {messages.map((msg) => (
                                <div key={msg.id} className="flex flex-col gap-1">

                                    {/* BURBUJA */}
                                    <div
                                        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm shadow
                                            ${
                                                msg.sender === "user"
                                                    ? "bg-[#003b99] text-white ml-auto"
                                                    : msg.sender === "typing"
                                                    ? "bg-gray-200 text-gray-600 italic flex items-center gap-2"
                                                    : "bg-gray-100 text-gray-800"
                                            }
                                        `}
                                    >
                                        {msg.sender === "typing" && (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        )}
                                        {msg.text}
                                    </div>

                                    {/* FEEDBACK BOTONES */}
                                    {msg.sender === "bot" && msg.rateable && !msg.rated && (
                                        <div className="flex gap-4 ml-2 text-xs">
                                            <button
                                                onClick={() => markUseful(msg.id)}
                                                className="flex items-center gap-1 text-green-700 hover:underline"
                                            >
                                                <ThumbsUp size={14} /> Útil
                                            </button>

                                            <button
                                                onClick={() => markNotUseful(msg)}
                                                className="flex items-center gap-1 text-red-600 hover:underline"
                                            >
                                                <ThumbsDown size={14} /> No útil
                                            </button>
                                        </div>
                                    )}

                                    {/* ESTADO DE FEEDBACK */}
                                    {msg.rated === "useful" && (
                                        <p className="text-green-600 ml-2 text-xs flex items-center gap-1">
                                            <ThumbsUp size={12} /> Marcado como útil
                                        </p>
                                    )}

                                    {msg.rated === "not_useful" && (
                                        <p className="text-red-600 ml-2 text-xs flex items-center gap-1">
                                            <ThumbsDown size={12} /> Marcado como no útil
                                        </p>
                                    )}
                                </div>
                            ))}

                            <div ref={messagesEndRef} />
                        </div>
                    </ScrollArea>

                    {/* INPUT */}
                    <div className="px-4 py-4 border-t bg-white">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Escribe tu pregunta..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                className="rounded-full px-4 py-6"
                            />

                            <Button
                                onClick={sendMessage}
                                className="rounded-full px-6 bg-[#003b99]"
                            >
                                <SendHorizonal size={20} />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* MODAL DE FEEDBACK */}
            <Dialog open={openFeedbackModal} onOpenChange={setOpenFeedbackModal}>
                <DialogContent className="rounded-xl max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">
                            ¿Por qué no fue útil la respuesta?
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 mt-2">
                        <Input
                            placeholder="Razón principal"
                            value={feedbackReason}
                            onChange={(e) => setFeedbackReason(e.target.value)}
                        />

                        <Input
                            placeholder="Comentario adicional (opcional)"
                            value={feedbackComment}
                            onChange={(e) => setFeedbackComment(e.target.value)}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            onClick={submitFeedback}
                            className="bg-[#003b99]"
                        >
                            Enviar feedback
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
