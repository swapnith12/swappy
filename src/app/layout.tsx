import type { Metadata } from "next";
import RootLayoutClient from "./rootLayout"; 

export const metadata: Metadata = {
  title: "swappy",
  description: "word guessing game",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootLayoutClient>{children}</RootLayoutClient>;
}
