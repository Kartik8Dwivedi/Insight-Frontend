"use client";

import { LogOut, MessageCircleMore, Plus, SidebarClose, SidebarOpen } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { MockChatResponse } from "@/types";

export const LeftSidebar = () => {
  const [open, setOpen] = React.useState(false);
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setOpen(true);
    }
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      <div
        className={cn(
          "z-200 bg-background absolute lg:relative h-screen border-r overflow-x-hidden duration-200",
          open
            ? "w-[250px] min-w-[250px] max-w-[250px]"
            : "w-0 min-w-0 max-w-0 px-0",
        )}
      >
        <div className="p-4 h-[calc(100%-80px)] overflow-y-scroll">
          <NewChat />
          <RecentChats />
        </div>
        <UserProfile />

        <Button
          size={"icon"}
          className="absolute text-ei-accent top-2 right-2 hover:bg-ei-accent-light! hover:text-ei-accent/80"
          variant="ghost"
          onClick={() => setOpen(false)}
        >
          <SidebarClose />
        </Button>
      </div>

      <Button
        size={"icon"}
        className="fixed  text-ei-accent top-2 left-2 z-100 hover:bg-ei-accent-light! hover:text-ei-accent/80"
        variant="ghost"
        onClick={() => setOpen(true)}
      >
        <SidebarOpen />
      </Button>
    </>
  );
};

const UserProfile = () => {
  return (
    <div className=" w-full text-sm font-medium h-[80px] border-t p-4 flex items-center gap-2 ">
      <figure className="aspect-square h-10 relative rounded-full bg-ei-accent-mid">
        {/* <Image src="/assets/images/ai-avatar.png" fill alt="AI Avatar" width={24} height={24} /> */}
      </figure>
      <div className="flex flex-col justify-center w-[150px]">
        <p className="text-nowrap text-ellipsis overflow-hidden">
          Rupam Bhattacharya
        </p>
        <p className="text-ei-ink-muted text-nowrap text-ellipsis overflow-hidden">
          rupambhattacharya1@gmail.com
        </p>
      </div>

      {/* <Button
				size="lg"
				variant="destructive"
				onClick={() => signOut()}
				className="text-xs h-8 p-4"
			>
				Sign Out
			</Button> */}
    </div>
  );
};

const RecentChats = () => {
  const params = useParams();
  const chatId = params.chatId;
  const chats: MockChatResponse[] = [{
    id: "sdjsodhishd",
    status: "success",
    llmResponse: "shdoshdos",
    userPrompt: "sdjsodhshd"
  },
  {
    id: "sdjsodhishd1232",
    status: "success",
    llmResponse: "shdoshdos",
    userPrompt: "sdjsodhshd"
  },
  {
    id: "sdjsodhishd232",
    status: "success",
    llmResponse: "shdoshdos",
    userPrompt: "sdjsodhshd"
  },
  {
    id: "sdjsodhishd3232",
    status: "success",
    llmResponse: "shdoshdos",
    userPrompt: "sdjsodhshd"
  }];
  return (
    <>
      <h3 className="font-semibold text-nowrap overflow-hidden text-ellipsis leading-[110%]">
        Recent
      </h3>
      <p className="text-ei-ink-muted font-medium text-sm text-nowrap overflow-hidden text-ellipsis">
        Continue your recent chats
      </p>

      <div className="flex flex-col gap-2 mt-4">
        {chats?.map((chat) => (
          <Link
            key={chat.id}
            href={`/chat/${chat.id}`}
            className={cn(
              "flex items-center text-ei-ink-muted transition-all text-ellipsis overflow-hidden text-nowrap duration-200 rounded-lg font-medium text-sm p-1.5 px-4 cursor-pointer",
              chatId === chat.id
                ? "bg-ei-accent-light text-ei-accent/90"
                : "hover:bg-ei-accent-light hover:text-ei-accent/80",
            )}
          >
            <MessageCircleMore strokeWidth={2.5} size={16} className="mr-2" />
            {chat.userPrompt}
          </Link>
        ))}
      </div>
    </>
  );
};

const NewChat = () => {
  const params = useParams();
  const chatId = params.chatId;
  return (
    <div className="flex flex-col">
      <h3 className="font-semibold text-nowrap overflow-hidden text-ellipsis leading-[110%]">
        New
      </h3>
      <p className="text-ei-ink-muted font-medium text-sm text-nowrap overflow-hidden text-ellipsis">
        Start from a clean slate
      </p>
      <Link
        className={cn(
          "mt-5 mb-10 flex justify-center text-ei-ink-muted transition-all text-ellipsis overflow-hidden text-nowrap duration-200 rounded-2xl font-medium text-sm p-2 pr-6 cursor-pointer",
          chatId === undefined
            ? "bg-ei-accent text-white"
            : "hover:bg-ei-accent-mid bg-ei-accent text-white",
        )}
        href="/chat"
      >
        <p className="flex uppercase text-xs tracking-wider font-medium items-center">
          <Plus size={16} className="mr-2" />
          New Chat
        </p>
      </Link>
    </div>
  );
};
