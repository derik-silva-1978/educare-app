
import React from 'react';
import { cn } from '@/lib/utils';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

const Image: React.FC<ImageProps> = ({ 
  src, 
  alt = '', 
  className, 
  fallback = '/placeholder.svg',
  ...props 
}) => {
  const [imgSrc, setImgSrc] = React.useState<string | undefined>(src);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);
  
  React.useEffect(() => {
    setImgSrc(src);
    setIsLoading(true);
    setIsError(false);
  }, [src]);
  
  const handleLoad = () => {
    setIsLoading(false);
  };
  
  const handleError = () => {
    setIsLoading(false);
    setIsError(true);
    // Set to null instead of fallback to hide the image completely if needed
    if (!fallback) {
      setImgSrc(null);
    } else {
      setImgSrc(fallback);
    }
  };
  
  // If there's no image to show, return null
  if (!imgSrc && isError) {
    return null;
  }
  
  return (
    <div className={cn(
      "relative overflow-hidden",
      isLoading && "bg-muted animate-pulse",
      className
    )}>
      {imgSrc && (
        <img
          src={imgSrc}
          alt={alt}
          className={cn(
            "w-full h-auto",
            isError && "opacity-70"
          )}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
    </div>
  );
};

export default Image;
