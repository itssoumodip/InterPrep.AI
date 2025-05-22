import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";

import { cn, getRandomInterviewCover } from "@/lib/utils";
import { getFeedbackByInterviewId } from "@/lib/actions/general.actions";

const InterviewCard = async ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const feedback =
    userId && interviewId
      ? await getFeedbackByInterviewId({
          interviewId,
          userId,
        })
      : null;

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const badgeColor =
    {
      Behavioral: "bg-primary-100",
      Mixed: "bg-light-600",
      Technical: "bg-light-800",
    }[normalizedType] || "bg-light-600";

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  return (
    <div className="card-border w-[360px] max-sm:w-full min-h-96 hover:scale-[1.02] transition-all duration-300">
      <div className="card-interview">
        <div>
          {/* Type Badge */}
          <div
            className={cn(
              "absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg backdrop-blur-sm shadow-md",
              badgeColor
            )}
          >
            <p className="badge-text font-medium">{normalizedType}</p>
          </div>

          

          {/* Interview Role */}
          <div className=""></div>
          <h3 className="mt-5 capitalize text-primary-100 font-bold ">
            {role} Interview</h3>

          {/* Date & Score */}
          <div className="flex flex-row gap-6 mt-4 items-center">
            <div className="flex flex-row gap-3 items-center backdrop-blur-sm bg-dark-300/50 px-3 py-1.5 rounded-full">
              <Image
                src="/calendar.svg"
                width={18}
                height={18}
                alt="calendar"
                className="opacity-80"
              />
              <p className="text-sm">{formattedDate}</p>
            </div>

            <div className="flex flex-row gap-3 items-center backdrop-blur-sm bg-dark-300/50 px-3 py-1.5 rounded-full">
              <Image 
                src="/star.svg" 
                width={18} 
                height={18} 
                alt="star" 
                className="opacity-80"
              />
              <p className="text-sm font-medium">{feedback?.totalScore || "---"}/100</p>
            </div>
          </div>

          {/* Feedback or Placeholder Text */}
          <div className="mt-6 backdrop-blur-sm bg-dark-300/30 p-4 rounded-xl">
            <p className="line-clamp-2 text-sm">
              {feedback?.finalAssessment ||
                "You haven't taken this interview yet. Take it now to improve your skills."}
            </p>
          </div>
        </div>

        <div className="flex flex-row justify-between items-center mt-2">
          <DisplayTechIcons techStack={techstack} />          <Button 
            className="btn-primary transition-all duration-300 hover:shadow-[0_0_15px_rgba(202,197,254,0.5)]"
          >
            <Link
              href={
                feedback
                  ? `/interview/${interviewId}/feedback`
                  : `/interview/${interviewId}`
              }
              className="flex items-center gap-2"
            >
              {feedback ? "Check Feedback" : "View Interview"}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;