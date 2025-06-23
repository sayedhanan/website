import React from 'react';

export const metadata = {
  title: 'Privacy Policy — Sayed Hanan',
  description: 'Understand how Sayed Hanan collects, uses, and protects your data when you visit this website.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-6 text-[var(--color-primary-text)]">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4 text-[var(--color-secondary-text)]">
        This Privacy Policy explains how I, Sayed Hanan, collect, use, and protect your information when you visit <strong>sayedhanan.com</strong>.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">1. Information I Collect</h2>
      <ul className="list-disc pl-5 mb-4">
        <li><strong>Contact Form:</strong> Your name, email, and message content when you send a message through the contact form.</li>
        <li><strong>Newsletter:</strong> Your email address when you subscribe to my newsletter (managed via Substack or similar services).</li>
        <li><strong>Analytics:</strong> Basic anonymous analytics data (e.g. page views) if I enable analytics tools in the future.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-2">2. How I Use Your Information</h2>
      <ul className="list-disc pl-5 mb-4">
        <li>To respond to your messages or inquiries.</li>
        <li>To send newsletters if you’ve subscribed (you can unsubscribe anytime).</li>
        <li>To improve the website (using analytics, if enabled).</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-2">3. Sharing Your Information</h2>
      <p className="mb-4">
        I do not sell or share your personal information with third parties, except as necessary to provide services (e.g. Substack for newsletters).
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">4. Your Rights</h2>
      <p className="mb-4">
        You can request to access, update, or delete your personal data by contacting me at <strong>contact@sayedhanan.com</strong>.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">5. Changes</h2>
      <p className="mb-4">
        This Privacy Policy may be updated from time to time. I encourage you to review it periodically.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">6. Contact</h2>
      <p>
        If you have questions about this policy, please contact me at <strong>contact@sayedhanan.com</strong>.
      </p>
    </main>
  );
}
