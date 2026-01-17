import * as React from "react";

export const Avatar = ({ children, className = "" }: { children?: React.ReactNode; className?: string }) => {
  return (
    <div className={`inline-flex items-center justify-center rounded-full overflow-hidden bg-gray-100 ${className}`.trim()}>
      {children}
    </div>
  );
};

export const AvatarImage = ({ src, alt, ...props }: { src?: string; alt?: string } & React.ImgHTMLAttributes<HTMLImageElement>) => {
  if (!src) return null;
  return <img src={src} alt={alt} className="w-full h-full object-cover" {...props} />;
};

export const AvatarFallback = ({ children }: { children?: React.ReactNode }) => {
  return <span className="text-sm font-medium text-gray-700 px-2">{children}</span>;
};

export default Avatar;
