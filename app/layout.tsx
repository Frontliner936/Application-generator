import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Charles Career Assistant",
  description: "Generate tailored CVs, cover letters and job application emails."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
