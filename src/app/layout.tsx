import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TestGen — C# Unit Test Generator",
  description:
    "Generate production-ready C# unit tests in seconds. AST-powered analysis + AI generation, directly in VS Code.",
  openGraph: {
    title: "TestGen — C# Unit Test Generator",
    description: "Generate production-ready C# unit tests in seconds.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
