import * as React from "react";
import { cn } from "@/lib/utils";
import { Construction, Wrench } from "lucide-react";

interface DevBadgeProps {
  variant?: "inline" | "overlay" | "banner";
  size?: "sm" | "md" | "lg";
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

export function DevBadge({
  variant = "inline",
  size = "sm",
  className,
  showIcon = true,
  children
}: DevBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5"
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  if (variant === "banner") {
    return (
      <div
        className={cn(
          "w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 px-4 flex items-center justify-center gap-2 font-medium",
          sizeClasses[size],
          className
        )}
      >
        {showIcon && <Construction className={iconSizes[size]} />}
        <span>{children || "Em Desenvolvimento"}</span>
      </div>
    );
  }

  if (variant === "overlay") {
    return (
      <div
        className={cn(
          "absolute top-2 right-2 z-10 bg-amber-500/90 text-white rounded-md flex items-center gap-1 font-medium shadow-lg",
          sizeClasses[size],
          className
        )}
      >
        {showIcon && <Wrench className={iconSizes[size]} />}
        <span>{children || "Dev"}</span>
      </div>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 font-medium",
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Wrench className={iconSizes[size]} />}
      <span>{children || "Em Desenvolvimento"}</span>
    </span>
  );
}

interface DevWrapperProps {
  children: React.ReactNode;
  showBadge?: boolean;
  badgeVariant?: "inline" | "overlay" | "banner";
  badgePosition?: "top" | "bottom";
  className?: string;
  message?: string;
}

export function DevWrapper({
  children,
  showBadge = true,
  badgeVariant = "overlay",
  badgePosition = "top",
  className,
  message
}: DevWrapperProps) {
  if (!showBadge) {
    return <>{children}</>;
  }

  return (
    <div className={cn("relative", className)}>
      {badgeVariant === "banner" && badgePosition === "top" && (
        <DevBadge variant="banner">{message}</DevBadge>
      )}
      {badgeVariant === "overlay" && (
        <DevBadge variant="overlay">{message}</DevBadge>
      )}
      {children}
      {badgeVariant === "banner" && badgePosition === "bottom" && (
        <DevBadge variant="banner">{message}</DevBadge>
      )}
    </div>
  );
}

export function DevPlaceholder({
  title = "Em Desenvolvimento",
  description = "Esta funcionalidade está em desenvolvimento e estará disponível em breve.",
  icon: Icon = Construction,
  className
}: {
  title?: string;
  description?: string;
  icon?: React.ElementType;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-[300px] p-8 text-center",
        "bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/30 dark:to-orange-950/30",
        "border border-amber-200/50 dark:border-amber-800/50 rounded-lg",
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-amber-600 dark:text-amber-400" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md">{description}</p>
    </div>
  );
}

export default DevBadge;
