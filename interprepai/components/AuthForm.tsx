"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { signIn, signUp } from "@/lib/actions/auth.action";
import FormField from "./FormField";
import { cn } from "@/lib/utils";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (type === "sign-up") {
        const { name, email, password } = data;

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        const { email, password } = data;

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in Failed. Please try again.");
          return;
        }

        await signIn({
          email,
          idToken,
        });

        toast.success("Signed in successfully.");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`);
    }
  };

  const isSignIn = type === "sign-in";

  return (
    <div className="flex w-full min-h-screen">
      {/* Left side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[480px] space-y-6 md:space-y-8 backdrop-blur-sm bg-background/40 p-6 sm:p-8 lg:p-10 rounded-3xl shadow-lg border border-primary-100/10">
          {/* Logo */}
          <div className="flex items-center gap-3 justify-center lg:justify-start">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-100/30 blur-xl rounded-full"></div>
              <Image 
                src="/logo.svg" 
                alt="logo" 
                height={48} 
                width={48} 
                className="relative z-10 drop-shadow-md" 
              />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-100 to-primary-200 bg-clip-text text-transparent">
              InterPrep.AI
            </h2>
          </div>
          
          {/* Title */}
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight">
              {isSignIn ? "Welcome back" : "Join InterPrep.AI"}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isSignIn 
                ? "Sign in to your account to continue your interview preparation journey" 
                : "Create an account to practice job interviews with AI and improve your skills"
              }
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-7 mt-8"
            >
              {!isSignIn && (
                <FormField
                  control={form.control}
                  name="name"
                  label="Full Name"
                  placeholder="Your full name"
                  type="text"
                />
              )}

              <FormField
                control={form.control}
                name="email"
                label="Email Address"
                placeholder="you@example.com"
                type="email"
              />

              <FormField
                control={form.control}
                name="password"
                label="Password"
                placeholder="••••••••"
                type="password"
              />

              <div className="pt-2">                <Button 
                  className={cn(
                    "w-full h-14 text-base font-medium rounded-xl",
                    "bg-gradient-to-r from-primary-100 via-primary-200 to-primary-100 hover:opacity-90 transition-all duration-300",
                    "shadow-md hover:shadow-lg shadow-primary-100/20"
                  )}
                  type="submit"
                >
                  {isSignIn ? "Sign In" : "Create Account"}
                </Button>
              </div>
            </form>
          </Form>

          <div className="text-center lg:text-left pb-2">
            <p className="text-sm text-muted-foreground">
              {isSignIn ? "Don't have an account yet?" : "Already have an account?"}
              <Link
                href={!isSignIn ? "/sign-in" : "/sign-up"}
                className="font-semibold ml-1.5 text-primary-200 hover:text-primary-100 hover:underline transition-all"
              >
                {!isSignIn ? "Sign In" : "Sign Up"}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Interactive Interview Mockup */}
      <div className="hidden lg:block w-1/2 bg-dark-300 relative overflow-hidden">
        {/* Coding interview visualization */}
        <div className="absolute inset-0 flex items-center justify-center p-8">          <div className="w-full max-w-3xl mx-auto" style={{ perspective: '1000px' }}>            {/* Code editor mockup with interview context */}
            <div style={{ transform: 'rotateY(-5deg) rotateX(5deg)' }} className="bg-dark-200 rounded-xl shadow-2xl overflow-hidden border border-light-800/30">
              {/* Editor header */}
              <div className="bg-dark-100 p-3 flex items-center gap-2 border-b border-light-800/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive-100"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-success-100"></div>
                </div>
                <div className="ml-2 text-xs text-light-400">InterviewQuestion.js</div>
              </div>
              
              {/* Code content */}
              <div className="p-5 bg-dark-300 font-mono text-sm leading-relaxed text-light-100/90">
                <div className="flex">
                  <div className="text-light-400/50 mr-4 select-none">
                    <div>1</div>
                    <div>2</div>
                    <div>3</div>
                    <div>4</div>
                    <div>5</div>
                    <div>6</div>
                    <div>7</div>
                    <div>8</div>
                    <div>9</div>
                    <div>10</div>
                    <div>11</div>
                    <div>12</div>
                  </div>
                  <div className="flex-1">                    <div><span className="text-blue-400">function</span> <span className="text-yellow-300">findMissingNumber</span>(<span className="text-orange-300">nums</span>) {'{'}</div>
                    <div className="pl-4"><span className="text-blue-400">const</span> n = nums.length;</div>
                    <div className="pl-4"><span className="text-blue-400">const</span> expectedSum = n * (n + 1) / 2;</div>
                    <div className="pl-4"><span className="text-blue-400">const</span> actualSum = nums.reduce(<span className="text-yellow-300">(sum, num)</span> {'=> sum + num'}, 0);</div>
                    <div className="pl-4"><span className="text-blue-400">return</span> expectedSum - actualSum;</div>
                    <div>{'}'}</div>
                    <div className="mt-4"><span className="text-green-400">// Test case</span></div>
                    <div><span className="text-blue-400">const</span> nums = [0, 1, 3, 4, 5];</div>
                    <div><span className="text-blue-400">const</span> missingNumber = <span className="text-yellow-300">findMissingNumber</span>(nums);</div>
                    <div>console.<span className="text-teal-300">log</span>(<span className="text-green-300">"Missing number: 2"</span>); <span className="text-green-400">// Output: 2</span></div>
                  </div>
                </div>
              </div>

              {/* Interactive chat overlay */}
              <div className="bg-dark-200/95 p-5 border-t border-light-800/30">
                <div className="flex gap-3 items-start mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary-200/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <Image src="/robot.png" alt="AI" width={24} height={24} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-light-400 mb-1">Interviewer:</div>
                    <div className="text-sm text-white">
                      Great solution! Can you explain the time and space complexity of this algorithm?
                    </div>
                  </div>
                </div>
                
                {/* Input field */}
                <div className="relative mt-6">
                  <input 
                    type="text" 
                    className="w-full rounded-lg bg-dark-100 border border-light-800/30 py-3 px-4 text-white text-sm focus:outline-none"
                    placeholder="Type your response..." 
                    readOnly 
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-200/80 hover:bg-primary-200 text-dark-300 rounded-md px-3 py-1 text-xs font-medium transition-colors">
                    Send
                  </button>
                </div>
              </div>
            </div>

            {/* Company badges */}
            <div className="mt-12 text-center">
              <p className="text-white/70 text-sm mb-4">Our platform helps you prepare for interviews at top companies</p>
              <div className="flex flex-wrap justify-center gap-6 items-center mt-6">
                <div className="bg-white/5 p-3 rounded-lg hover:bg-white/10 transition-colors">
                  <Image src="/covers/amazon.png" alt="Amazon" width={90} height={30} className="opacity-80 hover:opacity-100 transition-opacity" />
                </div>
                <div className="bg-white/5 p-3 rounded-lg hover:bg-white/10 transition-colors">
                  <Image src="/covers/facebook.png" alt="Facebook" width={90} height={30} className="opacity-80 hover:opacity-100 transition-opacity" />
                </div>
                <div className="bg-white/5 p-3 rounded-lg hover:bg-white/10 transition-colors">
                  <Image src="/covers/adobe.png" alt="Adobe" width={90} height={30} className="opacity-80 hover:opacity-100 transition-opacity" />
                </div>
                <div className="bg-white/5 p-3 rounded-lg hover:bg-white/10 transition-colors">
                  <Image src="/covers/spotify.png" alt="Spotify" width={90} height={30} className="opacity-80 hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background glowing effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[20%] right-[10%] w-64 h-64 bg-primary-100/5 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-[10%] left-[20%] w-80 h-80 bg-primary-200/5 rounded-full filter blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;