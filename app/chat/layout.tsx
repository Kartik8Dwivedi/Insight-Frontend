import type React from "react";
import { LeftSidebar } from "@/components/chat/left-sidebar";

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="flex">
			<LeftSidebar />
			{children}
		</div>
	);
};

export default ChatLayout;
