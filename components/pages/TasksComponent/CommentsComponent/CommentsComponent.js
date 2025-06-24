"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { fetchComments, postComment } from "@/lib/services/comments";
import { X } from "lucide-react";

export default function CommentSection({ taskId, token }) {
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState("");
	const [selectedFiles, setSelectedFiles] = useState([]);

	const loadComments = async () => {
		const data = await fetchComments(taskId, token);
		setComments(data);
	};

	const handleFileChange = (e) => {
		const files = Array.from(e.target.files);
		const newFiles = files.filter(
			(file) =>
				!selectedFiles.some((f) => f.name === file.name && f.size === file.size)
		);
		setSelectedFiles([...selectedFiles, ...newFiles]);
	};

	const handleRemoveFile = (index) => {
		const updatedFiles = [...selectedFiles];
		updatedFiles.splice(index, 1);
		setSelectedFiles(updatedFiles);
	};

	const handlePost = async () => {
		if (!newComment.trim()) return;
		await postComment(taskId, newComment, token, selectedFiles);
		setNewComment("");
		setSelectedFiles([]);
		document.getElementById("comment-attachments").value = "";
		await loadComments();
	};

	useEffect(() => {
		if (taskId && token) loadComments();
	}, [taskId, token]);

	return (
		<div className="space-y-4 mt-6">
			<Label>Comentarios</Label>

			<div className="space-y-4 max-h-[400px] overflow-y-auto border rounded p-4 bg-muted">
				<div className="bg-white rounded-md p-4 shadow-sm border border-dashed border-gray-300 space-y-2">
					<Label htmlFor="new-comment">Agregar comentario</Label>
					<Textarea
						id="new-comment"
						placeholder="Escribe un comentario..."
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
					/>
					<input
						id="comment-attachments"
						type="file"
						multiple
						onChange={handleFileChange}
						className="block w-full text-sm text-gray-500
					file:mr-4 file:py-2 file:px-4
					file:rounded-full file:border-0
					file:text-sm file:font-semibold
					file:bg-primary file:text-white
					hover:file:bg-primary/80"
					/>
					{selectedFiles.length > 0 && (
						<div className="flex flex-wrap gap-2 mt-2">
							{selectedFiles.map((file, index) => (
								<div
									key={index}
									className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
									<span>{file.name}</span>
									<button
										onClick={() => {
											const updatedFiles = selectedFiles.filter(
												(_, i) => i !== index
											);
											setSelectedFiles(updatedFiles);
										}}
										className="font-bold text-sm cursor-pointer"
										aria-label="Eliminar archivo">
										<X />
									</button>
								</div>
							))}
						</div>
					)}

					<Button onClick={handlePost} className="mt-2">
						Publicar
					</Button>
				</div>
				{comments.map((comment) => (
					<div
						key={comment.id}
						className="bg-white rounded-md p-4 shadow-sm border border-gray-200 space-y-2">
						<div className="flex justify-between items-center">
							<p className="font-semibold text-sm text-gray-800">
								{comment.user?.first_name || "Usuario"}
							</p>
							<span className="text-xs text-gray-400">
								{new Date(comment.comment_date).toLocaleString()}
							</span>
						</div>

						<p className="text-sm text-gray-700">{comment.content}</p>

						{comment.attachments?.length > 0 && (
							<div className="pt-2 border-t border-gray-100 space-y-1 text-xs text-blue-500">
								<p className="text-xs text-gray-500 font-medium">
									Archivos adjuntos:
								</p>
								{comment.attachments.map((file) => (
									<a
										key={file.id}
										href={file.file}
										target="_blank"
										rel="noopener noreferrer"
										className="block underline">
										📎 {file.file.split("/").pop()}
									</a>
								))}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
