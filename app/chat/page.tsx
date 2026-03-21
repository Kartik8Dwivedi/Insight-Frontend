"use client";

import { ArrowUp, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";



const suggestions = [
	"Explain the bubble sort algorithm",
	"Explain the collatz conjecture",
	"Explain the fibonacci sequence",
];


const NewChatPage = () => {
	const [prompt, setPrompt] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
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

	const handleNewChat = async () => {
		try {
			setIsLoading(true);

		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<div className="w-full h-screen flex flex-col items-center bg-[#f3f6fb] justify-center relative">
			<h1 className="text-2xl font-semibold mb-1  text-center">
				Hi, Rupam
			</h1>
			<p className="text-neutral-600 text-lg font-medium text-center mb-5">
				What would you like to ask?
			</p>
			<div className="bg-background w-full sm:max-w-[700px] max-w-[90vw]  mx-auto  flex gap-2 rounded-xl mb-5">
				<div className="rounded-xl border-ei-accent-mid border-2 w-full p-2">
					<Textarea
						ref={textareaRef}
						className="resize-none bg-background! shadow-none w-full border-none focus-visible:border-none focus-visible:ring-0"
						placeholder="Ask EI Assistant..."
						value={prompt}
						onChange={(e) => setPrompt(e.target.value)}
					/>
					<div className="flex justify-end">
						<Button
							ref={buttonRef}
							size="icon-lg"
							className="text-white h-9 w-9 bg-ei-accent hover:bg-ei-accent/80"
							// disabled={prompt.length === 0 || isLoading}
							onClick={handleNewChat}
						>
							<ArrowUp />
						</Button>
					</div>
				</div>
			</div>
			{/* <div className="w-full max-w-[700px] mx-auto flex flex-wrap gap-2 px-2 mb-5">
				{
					suggestions.map((suggestion) => (
						<button
							key={suggestion}
							className="w-fit cursor-pointer bg-card text-[13px] font-medium p-1 px-4 rounded-xl"
							onClick={() => {
								setPrompt(suggestion)
								setTimeout(() => {
									buttonRef.current?.click()
								}, 100)
							}}
						>
							{suggestion}
						</button>
					))
				}
			</div> */}
		</div>
	);
};

export default NewChatPage;
