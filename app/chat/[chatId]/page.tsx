import React from "react";
import { ChatComponent } from "@/components/chat/chat-component";


const ChatPage = async ({
	params,
}: {
	params: Promise<{ chatId: string }>;
}) => {
	const { chatId } = await params;
	return <ChatComponent chatId={chatId} />;
};

export default ChatPage;
