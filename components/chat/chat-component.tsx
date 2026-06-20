"use client";
import { ArrowUp, Loader } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { GenerationComponent } from "./generation-component";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useCustomChat } from "./use-custom-chat";
import { useSearchParams } from "next/navigation";

export const ChatComponent = ({ chatId }: { chatId: string }) => {
	const searchParams = useSearchParams();
	const initialPrompt = searchParams.get("prompt");

	const { messages, input, handleInputChange, handleSubmit, isLoading, append, error } = useCustomChat({
		api: '/api/chat',
		id: chatId,
	});

	const chatRef = useRef<HTMLDivElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// Handle initial prompt
	useEffect(() => {
		if (initialPrompt && messages.length === 0) {
			append({
				role: 'user',
				content: initialPrompt,
			});
			// remove the prompt from URL to avoid re-triggering on refresh
			window.history.replaceState({}, '', `/chat/${chatId}`);
		}
	}, [initialPrompt, append, messages.length, chatId]);

	useEffect(() => {
		function handleEnter(e: KeyboardEvent) {
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				if (input.trim() && !isLoading) {
					// Need to dispatch a synthetic event or call handleSubmit manually
					const form = document.getElementById("chat-form") as HTMLFormElement;
					if (form) form.requestSubmit();
				}
			}
		}
		if (textareaRef.current) {
			textareaRef.current.addEventListener("keypress", handleEnter);
		}
		return () => {
			if (textareaRef.current) {
				textareaRef.current.removeEventListener("keypress", handleEnter);
			}
		};
	}, [input, isLoading]);

	useEffect(() => {
		const area = chatRef.current;
		if (area) {
			area.scrollTo({
				top: area.scrollHeight,
				behavior: "smooth",
			});
		}
	}, [messages, isLoading]);

	return (
		<main className="h-screen max-h-screen bg-[#f3f6fb] grow relative">
			<div
				ref={chatRef}
				className="overflow-y-scroll h-[calc(100%-130px)] flex flex-col items-center pt-20 pb-10"
			>
				{messages.length === 0 && !isLoading && (
					<div className="text-neutral-500 font-medium flex flex-col items-center justify-center h-full">
						Start asking your JEE doubts!
					</div>
				)}
				{messages.map((message) => (
					<GenerationComponent
						key={message.id}
						message={message}
						isLoading={isLoading && message.role === 'assistant' && message === messages[messages.length - 1]}
					/>
				))}
				{isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
					<div className="flex flex-col w-[95%] max-w-[800px] gap-5 mx-2 mb-5">
						<div className="w-[85%] bg-card p-4 rounded-2xl border">
							<div className="flex items-center text-sm font-medium h-full animate-pulse">
								<Loader size={20} className="animate-spin mr-2" />
								Generating response...
							</div>
						</div>
					</div>
				)}
				{error && (
					<div className="w-[95%] max-w-[800px] text-red-500 bg-red-100 p-3 rounded-lg mt-4 mx-2 text-sm font-medium">
						Error: {error.message.includes("429") || error.message.includes("Rate limit") ? "You have reached your 5 messages per day limit." : error.message}
					</div>
				)}
				{/* fade out at bottom */}
				<div className="absolute bottom-[130px] right-0 left-0 h-10 bg-linear-to-t from-[#f3f6fb] to-transparent pointer-events-none"></div>
			</div>
			<div className="absolute bottom-0 right-0 left-0 bg-background lg:max-w-[800px] max-w-[90vw] mx-auto flex gap-2 rounded-xl mb-5">
				<form id="chat-form" onSubmit={handleSubmit} className="rounded-xl border-ei-accent-mid border-2 flex w-full p-2">
					<Textarea
						ref={textareaRef}
						className="resize-none bg-background! shadow-none w-full border-none focus-visible:border-none focus-visible:ring-0"
						placeholder="Ask EI Assistant..."
						value={input}
						onChange={handleInputChange}
					/>
					<div className="flex items-end justify-end">
						<Button
							type="submit"
							size="icon-lg"
							className="text-white bg-ei-accent hover:bg-ei-accent/80 h-9 w-9"
							disabled={input.trim().length === 0 || isLoading}
						>
							{isLoading ? <Loader size={20} className="animate-spin" /> : <ArrowUp />}
						</Button>
					</div>
				</form>
			</div>
		</main>
	);
};
