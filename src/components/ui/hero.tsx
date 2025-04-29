"use client";

import { cn } from "@/utils/cn";
import { Input } from "@/components/ui/input";

export default function Hero() {
    return (
        <section
            aria-label="Homepage hero"
            className={cn(
                "container mx-auto px-4",           // fixed max-width + centered :contentReference[oaicite:5]{index=5}
                "py-12 md:py-16 lg:py-20",          // mobile-first vertical spacing :contentReference[oaicite:6]{index=6}
                "flex flex-col-reverse lg:flex-row items-center gap-8"  // responsive flex + gap :contentReference[oaicite:7]{index=7}
            )}
        >
            {/* Text & Newsletter Form */}
            <div className="flex-1 space-y-6">
                <h1 className="
          text-3xl md:text-4xl lg:text-5xl    // responsive typography :contentReference[oaicite:8]{index=8}
          font-bold leading-tight
          text-[--color-primary-text]         // primary text token :contentReference[oaicite:9]{index=9}
        ">
                    Hi, I’m Jane Doe.<br />
                    I build web experiences.
                </h1>
                <p className="
          text-lg md:text-xl
          text-[--color-secondary-text]       // secondary text token :contentReference[oaicite:10]{index=10}
          max-w-xl
        ">
                    Welcome to my personal site—explore my blog, portfolio, and courses.
                </p>

                <form
                    onSubmit={(e) => { e.preventDefault(); /* TODO: hook up newsletter */ }}
                    className="flex flex-col sm:flex-row items-center sm:items-end gap-4"  // form layout & gap :contentReference[oaicite:11]{index=11}
                >
                    <Input
                        id="newsletter-email"
                        type="email"
                        label="Email address"
                        placeholder="you@example.com"
                        required
                        inputSize="default"
                    />
                    <button
                        type="submit"
                        className="
              btn btn-primary                // component-layer primary button :contentReference[oaicite:12]{index=12}
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--color-accent]  // focus state :contentReference[oaicite:13]{index=13}
            "
                    >
                        Subscribe
                    </button>
                </form>
            </div>

            {/* Hero Image */}
            <div className="flex-1">

                <img
                    src="https://via.placeholder.com/600x400"
                    alt="Placeholder hero"
                    loading="lazy"
                    className="w-full max-w-md rounded-lg shadow-lg"
                />

            </div>

        </section>
    );
}
