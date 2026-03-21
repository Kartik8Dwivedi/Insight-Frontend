import { Copy, FileExclamationPoint, Loader, RefreshCw, Share, ThumbsDown, ThumbsUp } from "lucide-react";
import { motion } from "motion/react";
import React from "react";
import { DottedDivider } from "../ui/dotted-divider";
import type { MockChatResponse } from "@/types";
import Image from "next/image";
import { Button } from "../ui/button";

export const GenerationComponent = ({
  chat,
}: {
  chat: MockChatResponse;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(20px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.5 }}
      className="flex flex-col w-[95%] max-w-[800px] gap-5 mx-2 mb-5"
    >
      <div className="flex justify-end">
        <h3 className="bg-ei-accent-light text-ei-accent font-medium p-2 px-6 rounded-full rounded-tr-md">
          {chat.userPrompt}
        </h3>
      </div>
      {chat.status === "success" && (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <figure className="w-5 h-5 relative rounded-full bg-ei-accent-mid">
              {/* <Image src="/assets/images/ai-avatar.png" fill alt="AI Avatar" width={24} height={24} /> */}
            </figure>
            <p className="text-ei-accent font-medium text-sm">EI Assistant</p>
          </div>
          <h3 className="font-medium p-2 rounded-full lg:max-w-[90%] max-w-[95%] rounded-tl-md">
            {chat.llmResponse}
          </h3>
          <ResponseActions />
        </div>
      )}
      {chat.status === "failed" && (
        <div className="flex flex-col gap-1">
          <h3 className="flex bg-card font-medium p-2 px-6 text-red-500 rounded-full w-fit rounded-tl-md">
            <FileExclamationPoint className="mr-2 " />
            Something went wrong. Please try again.
          </h3>
        </div>
      )}
      {chat.status === "pending" && (
        <div className="w-[85%] bg-card aspect-video p-2.5 rounded-2xl border  ">
          <div className="flex items-center justify-center rounded-xl border text-sm font-medium h-full animate-pulse">
            <Loader size={20} className="animate-spin mr-2" />
            Generating video...
          </div>
        </div>
      )}
      <DottedDivider />
    </motion.div>
  );
};

// for copy, like, dislike, regenerate, share
function ResponseActions() {
  const buttons = [
    {
      icon: ThumbsUp,
      onClick: () => { },
    },
    {
      icon: ThumbsDown,
      onClick: () => { },
    },
    {
      icon: RefreshCw,
      onClick: () => { },
    },
    {
      icon: Copy,
      onClick: () => { },
    },
  ]
  return (
    <div className="mt-3 flex items-center gap-2 w-fit rounded-full p-1">
      {buttons.map((button, index) => (
        <React.Fragment key={index}>
          <Button className=" hover:bg-ei-accent-light! text-ei-ink-muted hover:text-ei-accent rounded-full" size="icon-sm" variant="ghost">
            <button.icon size={18} strokeWidth={2.5} />
          </Button>
          {/* {index !== buttons.length - 1 && <span className="h-4 w-px border-r border-ei-ink-muted/50" />} */}
        </React.Fragment>
      ))}
    </div>
  )
}