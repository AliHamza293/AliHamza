import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Unity Game Developer | Gameplay Systems & Multiplayer Specialist",
  description:
    "Freelance Unity Game Developer specializing in gameplay mechanics, Photon PUN multiplayer systems, and polished mobile game experiences. Hire me for your next project.",
  keywords: [
    "Unity Developer", "Game Developer", "Freelance Unity", "Photon PUN",
    "Multiplayer Game Development", "Mobile Game Developer", "Unity 2D 3D",
    "Gameplay Systems", "Upwork Unity Developer", "Fiverr Game Developer",
  ],
  openGraph: {
    title: "Unity Game Developer | Gameplay Systems & Multiplayer Specialist",
    description:
      "Freelance Unity Developer specializing in gameplay mechanics, Photon PUN multiplayer, and polished mobile games.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
