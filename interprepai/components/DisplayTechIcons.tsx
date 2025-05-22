import Image from "next/image";

import { cn, getTechLogos } from "@/lib/utils";

const DisplayTechIcons = async ({ techStack = [] }: TechIconProps) => {
  const techIcons = await getTechLogos(techStack);

  return (
    <div className="flex flex-row">
      {techIcons.slice(0, 3).map(({ tech, url }, index) => (
        <div
          key={tech}
          className={cn(
            "relative group bg-gradient-to-b from-dark-300/90 to-dark-200/90 backdrop-blur-md rounded-full p-2 flex items-center justify-center border border-light-400/20 hover:border-primary-200/70 hover:shadow-[0_0_10px_rgba(202,197,254,0.2)] transition-all duration-300",
            index >= 1 && "-ml-3"
          )}
        >
          <span className="tech-tooltip z-50 bg-dark-200 border border-light-400/30 font-medium">{tech}</span>

          <div className="relative w-6 h-6 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-10 rounded-full"></div>
            <Image
              src={url}
              alt={tech}
              width={100}
              height={100}
              className="size-6 object-contain relative z-0"
            />
          </div>
        </div>
      ))}
      {techStack.length > 3 && (
        <div className="relative -ml-3 group bg-gradient-to-b from-dark-300/90 to-dark-200/90 backdrop-blur-md rounded-full p-2 flex items-center justify-center border border-light-400/20 hover:border-primary-200/70 hover:shadow-[0_0_10px_rgba(202,197,254,0.2)] transition-all duration-300">
          <span className="tech-tooltip z-50 bg-dark-200 border border-light-400/30 font-medium">More technologies</span>
          <span className="text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-200 to-primary-100">+{techStack.length - 3}</span>
        </div>
      )}
    </div>
  );
};

export default DisplayTechIcons;