import  SubstackSignupForm  from "@/components/ui/SubstackSignupForm"

export default function NewsletterSection() {
  return (
    <section className="w-full py-16 px-4 border-t border-[--color-border] bg-[--color-surface] dark:bg-[--color-surface]">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h2 className="text-3xl font-bold text-[--color-primary-text]">
          Stay sharp with my thoughts
        </h2>
        <p className="text-[--color-secondary-text] text-base md:text-lg">
          Get insights on machine learning, writing, and deep thinking. No noise, just signals. One short email every week.
        </p>
        <SubstackSignupForm />
        <p className="text-xs text-[--color-secondary-text] mt-2">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
