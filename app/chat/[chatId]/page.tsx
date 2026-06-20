import React, { Suspense } from "react";
import { ChatComponent } from "@/components/chat/chat-component";


const ChatPage = async ({
	params,
}: {
	params: Promise<{ chatId: string }>;
}) => {
	const { chatId } = await params;
	return (
		<Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
			<ChatComponent chatId={chatId} />
		</Suspense>
	);
};

export default ChatPage;
