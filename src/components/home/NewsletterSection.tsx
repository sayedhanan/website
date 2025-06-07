// components/NewsletterSection.tsx
import SubstackSignupForm from "@/components/ui/SubstackSignupForm";

export default function NewsletterSection() {
  return (
    <section className="w-full py-16 px-4 border-t border-[--color-border] bg-[--color-surface] dark:bg-[--color-surface]">
      <div className="max-w-2xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-[--color-primary-text]">
          Stay sharp with my thoughts
        </h2>

        {/* Description */}
        <p className="mt-2 text-[--color-secondary-text] text-base md:text-lg">
          Get insights on machine learning, writing, and deep thinking. No noise—just signals. One short email every week.
        </p>

        {/* Centered wrapper around the “shrink-to-fit” div */}
        <div className="mt-6 flex justify-center">
          {/* This inner div “w-auto” shrinks to exactly the width of SubstackSignupForm */}
          <div className="w-auto">
            <SubstackSignupForm />
          </div>
        </div>

        {/* “No-spam” note */}
        <p className="mt-2 text-xs text-[--color-secondary-text]">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
