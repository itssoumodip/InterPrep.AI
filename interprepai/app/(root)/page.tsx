import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.actions";

async function Home() {
  const user = await getCurrentUser();

  const [userInterviews, allInterview] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getLatestInterviews({ userId: user?.id! }),
  ]);

  const hasPastInterviews = userInterviews?.length! > 0;
  const hasUpcomingInterviews = allInterview?.length! > 0;

  return (
    <>      <section className="card-cta relative overflow-hidden">
        {/* Background animated pattern */}
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10 bg-repeat"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-dark-300/30 to-dark-100/60 z-0"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col gap-6 max-w-lg">
          <div className="relative">
            <span className="inline-block px-4 py-2 rounded-full bg-primary-200/20 text-primary-100 font-medium text-sm mb-4">
              AI-Powered Interview Practice
            </span>
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-100 to-primary-200">
              Get Interview-Ready with AI-Powered Practice & Feedback
            </h2>
          </div>
          <p className="text-xl text-light-100/90 leading-relaxed">
            Practice real interview questions & get instant feedback from our AI interviewer
          </p>

          <Button 
            asChild 
            className="btn-primary max-sm:w-full mt-4 hover:shadow-[0_0_20px_rgba(202,197,254,0.6)] transition-all duration-300"
          >
            <Link href="/interview" className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m10 8 6 4-6 4V8z"/></svg>
              Start an Interview
            </Link>
          </Button>
        </div>

        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary-200/50 via-light-400/30 to-primary-100/50 opacity-70 blur-md"></div>
          <Image
            src="/robot.png"
            alt="AI Interviewer"
            width={450}
            height={450}
            className="max-sm:hidden relative z-10 animate-subtle-float"
          />
        </div>
      </section>      <div className="relative mt-16 mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-200/10 via-transparent to-transparent h-[1px] w-full"></div>
      </div>

      <section className="flex flex-col gap-8 mt-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-gradient-to-b from-primary-200 to-light-400 rounded-full"></div>
            <h2 className="text-3xl font-bold text-primary-100">Your Interviews</h2>
          </div>
          {hasPastInterviews && (
            <Button asChild variant="ghost" className="text-light-400 hover:text-primary-100">
              <Link href="/interview" className="flex items-center gap-2">
                See all
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </Link>
            </Button>
          )}
        </div>

        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <div className="w-full py-12 flex flex-col items-center justify-center bg-dark-300/30 rounded-2xl border border-light-800/10 backdrop-blur-sm">
              <Image src="/file.svg" width={64} height={64} alt="No Interviews" className="opacity-50 mb-4" />
              <p className="text-light-400 text-lg">You haven&apos;t taken any interviews yet</p>
              <Button asChild className="mt-6 btn-primary">
                <Link href="/interview" className="flex items-center gap-2">
                  Start your first interview
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 14 0"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-8 mt-16">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 bg-gradient-to-b from-[#3ABEFF] to-[#2E72E7] rounded-full"></div>
          <h2 className="text-3xl font-bold text-primary-100">Available Interviews</h2>
        </div>

        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            allInterview?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <div className="w-full py-12 flex flex-col items-center justify-center bg-dark-300/30 rounded-2xl border border-light-800/10 backdrop-blur-sm">
              <Image src="/file.svg" width={64} height={64} alt="No Interviews" className="opacity-50 mb-4" />
              <p className="text-light-400 align-center text-center text-lg">There are no interviews available at the moment</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Home;