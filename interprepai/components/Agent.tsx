"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.actions";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.log("Error:", error);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      console.log("handleGenerateFeedback");

      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages,
        feedbackId,
      });

      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.log("Error saving feedback");
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
    } else {
      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      {/* Status indicator */}
      <div className="flex items-center justify-center">
        <div className={cn(
          "px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-medium transition-all duration-300",
          callStatus === "ACTIVE" ? "bg-success-100/20 text-success-100" : 
          callStatus === "CONNECTING" ? "bg-primary-200/20 text-primary-200" : 
          "bg-light-400/20 text-light-400"
        )}>
          <span className={cn(
            "h-2 w-2 rounded-full",
            callStatus === "ACTIVE" ? "bg-success-100 animate-pulse" : 
            callStatus === "CONNECTING" ? "bg-primary-200 animate-pulse" : 
            "bg-light-400"
          )}></span>
          {callStatus === "ACTIVE" ? "Interview in progress" : 
           callStatus === "CONNECTING" ? "Connecting..." :
           callStatus === "FINISHED" ? "Interview ended" : "Ready to start"}
        </div>
      </div>

      {/* Interview cards section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* AI Interviewer Card */}
        <div className="bg-gradient-to-b from-[#171532] to-[#08090D] rounded-2xl border border-primary-200/30 shadow-lg overflow-hidden relative group">
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-200/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary-200/5 rounded-full blur-2xl"></div>
          
          {/* Card content */}
          <div className="flex flex-col items-center justify-center p-8 h-[350px] relative z-10 transition-transform duration-300 group-hover:scale-[1.02]">
            {/* Avatar with animation */}
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-200/40 to-primary-100/20 blur-md opacity-70"></div>
              <div className="relative z-10 flex items-center justify-center rounded-full size-[130px] bg-gradient-to-br from-[#c7c7ef] to-[#6363b7] p-1 border border-primary-200/30">
                <Image
                  src="/ai-avatar.png"
                  alt="AI Interviewer"
                  width={90}
                  height={90}
                  className="object-cover"
                  priority
                />
                {isSpeaking && (
                  <span className="absolute inset-0 animate-ping rounded-full bg-primary-200/20 opacity-75"></span>
                )}
              </div>
              
              {/* Speaking indicator */}
              {isSpeaking && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-dark-300/80 backdrop-blur-sm px-3 py-1 rounded-full border border-primary-200/30">
                  <div className="flex gap-1.5 items-center">
                    <span className="h-2 w-2 bg-primary-200 rounded-full animate-pulse" style={{ animationDelay: "0ms" }}></span>
                    <span className="h-2 w-2 bg-primary-200 rounded-full animate-pulse" style={{ animationDelay: "200ms" }}></span>
                    <span className="h-2 w-2 bg-primary-200 rounded-full animate-pulse" style={{ animationDelay: "400ms" }}></span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Name and subtitle */}
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-100 to-primary-200 bg-clip-text text-transparent">AI Interviewer</h3>
            <p className="text-light-400 text-sm mt-1">Powered by InterPrep.AI</p>
          </div>
        </div>
        
        {/* User Profile Card */}
        <div className="bg-gradient-to-b from-[#1A1C20] to-[#08090D] rounded-2xl border border-light-600/20 shadow-lg overflow-hidden relative group">
          {/* Decorative elements */}
          <div className="absolute -top-16 -left-16 w-32 h-32 bg-light-400/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-light-400/5 rounded-full blur-3xl"></div>
          
          {/* Card content */}
          <div className="flex flex-col items-center justify-center p-8 h-[350px] relative z-10 transition-transform duration-300 group-hover:scale-[1.02]">
            {/* Avatar */}
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-light-400/20 to-light-600/5 blur-md opacity-50"></div>
              <div className="relative z-10 flex items-center justify-center rounded-full size-[130px] bg-gradient-to-br  from-[#c7c7ef] to-[#6363b7] p-1 border border-light-400/10">
                <Image
                  src="/user-avatar.png"
                  alt={`${userName}'s avatar`}
                  width={120}
                  height={120}
                  className="object-cover rounded-full"
                  priority
                />
              </div>
            </div>
            
            {/* Name and subtitle */}
            <h3 className="text-2xl font-bold text-white">{userName}</h3>
            <p className="text-light-400 text-sm mt-1">Interviewee</p>
          </div>
        </div>
      </div>

      {/* Transcript Area */}
      {messages.length > 0 && (
        <div className="w-full">
          <div className="bg-gradient-to-b from-[#1A1C20]/80 to-[#08090D] rounded-2xl px-6 py-5 shadow-md border border-light-600/10 transition-all duration-300 hover:border-light-600/20">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center mb-2">
                <div className="text-xs uppercase tracking-wider text-light-400 font-medium">Last Message</div>
                <div className="px-2 py-0.5 rounded bg-dark-300/50 text-xs text-light-400">
                  {messages.length} {messages.length === 1 ? 'message' : 'messages'}
                </div>
              </div>
              
              <div className="message-bubble bg-dark-200/50 rounded-2xl px-4 py-3 border-l-2 border-primary-200/40">
                <p
                  key={lastMessage}
                  className={cn(
                    "text-light-100 leading-relaxed transition-all duration-500",
                    "animate-fadeIn"
                  )}
                >
                  {lastMessage}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call Controls */}
      <div className="w-full flex justify-center my-6">
        {callStatus !== "ACTIVE" ? (
          <button
            onClick={() => handleCall()}
            disabled={callStatus === "CONNECTING"}
            className={cn(
              "relative inline-flex items-center justify-center px-8 py-3 rounded-full transition-all duration-300 shadow-lg font-medium text-base min-w-40",
              callStatus === "CONNECTING"
                ? "bg-dark-300 text-light-400 cursor-wait"
                : "bg-gradient-to-r from-success-100 to-success-200 text-white hover:shadow-[0_0_20px_rgba(73,222,80,0.3)] hover:scale-[1.02]"
            )}
          >
            {callStatus === "CONNECTING" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-light-100 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            
            <span className={cn("flex items-center gap-2", callStatus === "CONNECTING" && "opacity-0")}>
              {callStatus === "INACTIVE" || callStatus === "FINISHED" ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  Start Interview
                </>
              ) : "Connecting..."}
            </span>
          </button>
        ) : (
          <button
            onClick={() => handleDisconnect()}
            className="inline-flex items-center justify-center px-8 py-3 font-medium text-base rounded-full transition-all duration-300 shadow-lg bg-gradient-to-r from-destructive-100 to-destructive-200 text-white hover:shadow-[0_0_20px_rgba(247,83,83,0.3)] hover:scale-[1.02]"
          >
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="9" x2="15" y2="15"></line>
                <line x1="15" y1="9" x2="9" y2="15"></line>
              </svg>
              End Interview
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Agent;