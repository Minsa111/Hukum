import { Toaster } from "@/components/ui/sonner";
export function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
    <div className="flex flex-1 flex-col">
        {children}
        <Toaster />
    </div>
    );
}
