import { cn, getTechLogos } from '@/lib/utils';
import Image from 'next/image';
import React from 'react'

const DisplayTechIcons = async ({ techStack }:TechIconProps) => {
    // Make sure techStack is properly defined before passing it to getTechLogos
    const techStackArray = Array.isArray(techStack) ? techStack : [];
    const techIcons = await getTechLogos(techStackArray);
    
    if (!techIcons || techIcons.length === 0) {
        return <div className='flex flex-row'>
            <div className='relative group bg-dark-300 rounded-full p-2 flex-center'>
                <Image src="/tech.svg" alt="No tech stack" width={100} height={100} className='size-6'/>
            </div>
        </div>;
    }
    
    return (
        <div className='flex flex-row'>
            {techIcons.slice(0,3).map(({tech, url}, index) => (
                <div key={tech || index} className={cn('relative group bg-dark-300 rounded-full p-2 flex-center', index>=1 && '-ml-3')}>
                    <span className='tech-tooltip'>{tech}</span>
                    <Image src={url} alt={tech} width={100} height={100} className='size-6'/> 
                </div>
            ))}
        </div>
    )
} 

export default DisplayTechIcons