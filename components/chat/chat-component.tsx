"use client";
import {
	ArrowBigDown,
	ArrowBigUp,
	ArrowUp,
	ChevronUp,
	Loader,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { GenerationComponent } from "./generation-component";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { MockChatResponse } from "@/types";

const mockChats: MockChatResponse[] = [{
	id: "54454545",
	userPrompt: "josajdosjd sj sjdosjd osjo sd",
	status: "success",
	llmResponse: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
},
{
	id: "544545452312",
	userPrompt: "josajdosjd sj sjdosjd osjo sd",
	status: "success",
	llmResponse: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
}]

export const ChatComponent = ({ chatId }: { chatId: string }) => {
	const chats = mockChats
	const lastGenerationStatus = "pending"
	const [prompt, setPrompt] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const chatRef = useRef<HTMLDivElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	useEffect(() => {
		function handleEnter(e: KeyboardEvent) {
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				buttonRef.current?.click();
			}
		}
		console.log("textareaRef", textareaRef);
		if (textareaRef.current) {
			console.log("textareaRef.current");
			textareaRef.current.addEventListener("keypress", handleEnter);
		}
		return () => {
			if (textareaRef.current) {
				textareaRef.current.removeEventListener("keypress", handleEnter);
			}
		};
	}, []);

	useEffect(() => {
		const area = chatRef.current;
		if (area && chats) {
			area.scrollTo({
				top: area.scrollHeight - 200,
				behavior: "instant",
			});
		}
	}, [chats]);

	const handleClick = async () => {

	}
	return (
		<main className="h-screen max-h-screen bg-[#f3f6fb] grow relative">
			{chats === undefined ? (
				<main className="h-screen max-h-screen grow">
					<div className="text-primary font-semibold flex items-center justify-center h-full">
						<Loader size={20} className="animate-spin mr-2" />
						Loading contents...
					</div>
				</main>
			) : (
				<div
					ref={chatRef}
					className="overflow-y-scroll h-[calc(100%-130px)] flex flex-col items-center pt-20"
				>
					{chats.map((chat) => (
						<GenerationComponent
							chat={chat}
							key={chat.id}
						/>
					))}
					{/* fade out at bottom */}
					<div className="absolute bottom-[130px] right-0 left-0 h-10 bg-linear-to-t from-[#f3f6fb] to-transparent"></div>
				</div>
			)}
			<div className="absolute bottom-0 right-0 left-0 bg-background lg:max-w-[600px] max-w-[350px] mx-auto flex gap-2 rounded-xl mb-5">
				<form onSubmit={handleClick} className="rounded-xl border-ei-accent-mid border-2 flex w-full p-2">
					<Textarea
						ref={textareaRef}
						className="resize-none bg-background! shadow-none w-full border-none focus-visible:border-none focus-visible:ring-0"
						placeholder="Ask EI Assistant..."
						value={prompt}
						onChange={(e) => setPrompt(e.target.value)}
					/>
					<div className="flex items-end justify-end">

						<Button
							ref={buttonRef}
							size="icon-lg"
							className="text-white bg-ei-accent hover:bg-ei-accent/80 h-9 w-9"
							// disabled={
							// 	prompt.length === 0 ||
							// 	isLoading ||
							//  lastGenerationStatus === "pending"
							// }
							onClick={handleClick}
						>
							{isLoading ? <Loader size={20} className="animate-spin" /> : <ArrowUp />}
						</Button>
					</div>
				</form>
			</div>
		</main>
	);
};
