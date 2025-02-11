import React from "react";
import BlogPostCard from "../components/BlogPostCard";
import HeroSection from "../components/HeroSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <div className="w-full flex flex-col items-center">
        <BlogPostCard />
        <BlogPostCard />
        <BlogPostCard />
        <BlogPostCard />
      </div>
    </div>
  );
}
