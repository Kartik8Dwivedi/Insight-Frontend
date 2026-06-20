import { Copy, FileExclamationPoint, RefreshCw, ThumbsDown, ThumbsUp } from "lucide-react";
import { motion } from "motion/react";
import React from "react";
import { DottedDivider } from "../ui/dotted-divider";
import Image from "next/image";
import { Button } from "../ui/button";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export const GenerationComponent = ({
  message,
  isLoading,
}: {
  message: any;
  isLoading?: boolean;
}) => {
  if (message.role === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col w-[95%] max-w-[800px] gap-5 mx-2 my-2"
      >
        <div className="flex justify-end">
          <h3 className="bg-ei-accent-light text-ei-accent font-medium p-3 px-6 rounded-3xl rounded-tr-sm inline-block max-w-[80%] whitespace-pre-wrap">
            {message.content}
          </h3>
        </div>
      </motion.div>
    );
  }

  // Assistant message
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.5 }}
      className="flex flex-col w-[95%] max-w-[800px] gap-5 mx-2 my-2 mb-5"
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center gap-2">
          <figure className="w-6 h-6 relative rounded-full bg-ei-accent-mid flex items-center justify-center">
             {/* <Image src="/assets/images/ai-avatar.png" fill alt="AI Avatar" width={24} height={24} /> */}
             <span className="text-[10px] text-white font-bold">EI</span>
          </figure>
          <p className="text-ei-accent font-semibold text-sm">EI Assistant</p>
        </div>
        <div className="font-medium p-4 rounded-3xl lg:max-w-[100%] max-w-[100%] rounded-tl-sm bg-white border shadow-sm">
          <div className="prose prose-sm md:prose-base max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                p: ({ node, ...props }) => <p className="mb-2 leading-relaxed" {...props} />,
                a: ({ node, ...props }) => <a className="text-ei-accent hover:underline" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-2" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-2" {...props} />,
                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                code: ({ node, inline, className, children, ...props }: any) => {
                  return inline ? (
                    <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-ei-accent" {...props}>
                      {children}
                    </code>
                  ) : (
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto my-4 font-mono text-sm">
                      <code {...props}>{children}</code>
                    </pre>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
        {!isLoading && <ResponseActions />}
      </div>
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
  ];
  return (
    <div className="mt-1 flex items-center gap-2 w-fit rounded-full p-1">
      {buttons.map((button, index) => (
        <React.Fragment key={index}>
          <Button className="hover:bg-ei-accent-light! text-ei-ink-muted hover:text-ei-accent rounded-full h-8 w-8" size="icon" variant="ghost">
            <button.icon size={16} strokeWidth={2.5} />
          </Button>
        </React.Fragment>
      ))}
    </div>
  );
}