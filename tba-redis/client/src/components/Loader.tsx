import { Loader2 } from "lucide-react";

export function Loaders() {
  return (
    <div className="flex h-[200px] w-full flex-col items-center justify-center gap-2 animate-in fade-in duration-500">
      {/* Ang 'animate-spin' ang magpapa-ikot, 'text-primary' para sa kulay */}
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-sm font-medium text-muted-foreground animate-pulse">
        Wait...
      </p>
    </div>
  );
}
