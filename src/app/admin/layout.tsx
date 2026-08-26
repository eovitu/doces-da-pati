import type { Metadata } from "next";
import { AreaAdmin } from "@/components/admin/AreaAdmin";

export const metadata: Metadata = {
  title: "Administração — Os Doces da Pati",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <AreaAdmin>{children}</AreaAdmin>;
}
