import { Card } from "@/components/ui/Card";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden">
      {/* Background orbs (reused from landing page idea) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-600/20 blur-[120px] animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/20 blur-[120px] animate-blob" style={{ animationDelay: "2s" }}></div>
      
      <div className="z-10 w-full max-w-md p-4">
        <Card className="w-full relative overflow-hidden">
          {/* Subtle gradient line on top */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          {children}
        </Card>
      </div>
    </div>
  );
}
