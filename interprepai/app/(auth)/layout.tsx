import { isAuthenticated } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import Image from "next/image";

const AuthLayout = async ({ children }: {children: ReactNode}) => {
  const isUserAuthenticated = await isAuthenticated();
  
  if(isUserAuthenticated) redirect('/');
  
  return (
    <div className="min-h-screen  w-full bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-50 pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary-100/20 to-primary-200/30 blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-primary-200/20 to-primary-100/30 blur-[80px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
          <div className="absolute inset-0 opacity-[0.02]">
            <Image src="/pattern.png" alt="Background pattern" fill style={{ objectFit: 'cover' }} />
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout