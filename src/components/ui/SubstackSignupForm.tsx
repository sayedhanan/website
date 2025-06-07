// components/ui/SubstackSignupForm.tsx
"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/utils/cn";

export default function SubstackSignupForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const substackUrl = `https://sayedhanan.substack.com/subscribe?email=${encodeURIComponent(email)}`;
    window.open(substackUrl, "_blank");
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="newsletter signup form"
      className="w-full flex flex-col sm:flex-row sm:justify-start gap-2 mt-4"
    >
      <div className="flex justify-center sm:justify-start w-full sm:w-auto">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          inputSize="lg"
          onChange={(e) => setEmail(e.target.value)}
          required
          className="sm:w-[300px] text-[--color-primary-text] bg-[--color-surface] border-[--color-border]"
        />
      </div>
      <button
        type="submit"
        className={cn(
          "btn btn-primary",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--color-accent]"
        )}
      >
        Subscribe
      </button>
    </form>
  );
}
