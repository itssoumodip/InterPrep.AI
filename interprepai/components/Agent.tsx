'use client'
import { cn } from '@/lib/utils';
import Image from 'next/image'
import { useState } from 'react'

enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED'
}

const Agent = ({ userName }: AgentProps) => {
    const isSpeaking = true;
    const [status, setStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    
    return (
        <>
            <div className='call-view'>
                <div className='card-interviewer'>
                    <div className='avatar'>
                        <Image src="/ai-avatar.png" alt='Vapi' width={65} height={54} className='object-cover' />
                        {isSpeaking && <span className="animate-speak"></span>}
                    </div>
                    <h3>AI Interviewer</h3>
                </div>
                <div className='card-border'>
                    <div className='card-content'>
                        <Image src="/user-avatar.png" alt="user avatar" width={540} height={540} className='rounded-full object-cover size-[120px]' />
                        <h3>{userName}</h3>
                    </div>
                </div>
            </div>
                <div className='w-full flex justify-center'>
                    {status !== CallStatus.ACTIVE ? (
                        <button className='relative btn-call'>
                            <span className={cn('absolute aniamte-ping rounded-full opacity-75', status !==='CONNECTING' & 'hidden')} />
                                
                            <span>
                            </span>
                        </button>
                    ) : (
                        <button className='btn-disconnect'>
                            End
                        </button>
                    )}
                </div>
        </>
    )
}

export default Agent