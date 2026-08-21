import type { Metadata } from "next";
import { SessionProvider } from "@/hooks/useSession";

export const metadata: Metadata = {
  title: "Pulse",
  description: "Real-time one-to-one and group chat.",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
