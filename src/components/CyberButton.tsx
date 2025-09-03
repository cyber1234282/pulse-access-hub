import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CyberButtonProps {
  children: React.ReactNode;
  variant?: "cyber" | "pink" | "outline";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export const CyberButton = ({ 
  children, 
  variant = "cyber", 
  className,
  onClick,
  type = "button",
  disabled = false
}: CyberButtonProps) => {
  const variants = {
    cyber: "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:scale-105 cyber-glow",
    pink: "bg-gradient-to-r from-secondary to-primary text-secondary-foreground hover:scale-105 pink-glow",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground cyber-glow"
  };

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "transition-all duration-300 font-bold uppercase tracking-wider",
        variants[variant],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {children}
    </Button>
  );
};