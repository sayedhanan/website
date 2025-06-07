"use client";

import React, { useState, useEffect } from "react";
import { Share2, Twitter, Linkedin, Copy, Check } from "lucide-react";

interface SocialShareProps {
  shareUrl: string;
  title: string;
  isMobile: boolean;
}

export default function SocialShare({ shareUrl, title, isMobile }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [fullUrl, setFullUrl] = useState(shareUrl);

  // Compute full URL on client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      setFullUrl(
        shareUrl.startsWith("http")
          ? shareUrl
          : `${window.location.origin}${shareUrl}`
      );
    }
  }, [shareUrl]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const shareLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(
        title
      )}`,
      color: "hover:text-[var(--color-accent)]",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
        fullUrl
      )}&title=${encodeURIComponent(title)}`,
      color: "hover:text-[var(--color-accent)]",
    },
  ];

  // Mobile/Tablet version
  if (isMobile) {
    return (
      <div className="bg-[var(--color-surface)] dark:bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-border)]">
        <div className="flex items-center justify-center space-x-1 mb-3">
          <Share2 className="w-4 h-4 text-[var(--color-secondary-text)]" />
          <span className="text-sm font-medium text-[var(--color-secondary-text)]">
            Share this post
          </span>
        </div>
        <div className="flex items-center justify-center space-x-4">
          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={
                `flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--color-surface)] dark:bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-secondary-text)] ${link.color} transition-all duration-200 hover:scale-105 hover:shadow-md`
              }
              aria-label={`Share on ${link.name}`}
            >
              <link.icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          ))}
          <button
            onClick={handleCopyLink}
            className={
              `flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--color-surface)] dark:bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-secondary-text)] hover:text-[var(--color-accent)] transition-all duration-200 hover:scale-105 hover:shadow-md ${
                copied ? 'text-[var(--color-success)]' : ''
              }`
            }
            aria-label="Copy link"
          >
            {copied ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : <Copy className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
        {copied && (
          <div className="text-center mt-2">
            <span className="text-xs text-[var(--color-success)] font-medium">
              ✓ Link copied to clipboard!
            </span>
          </div>
        )}
      </div>
    );
  }

  // Desktop version
  return (
    <div className="sticky top-4">
      <div className="flex flex-col items-center space-y-3">
        <div className="flex items-center space-x-2 mb-2">
          <Share2 className="w-4 h-4 text-[var(--color-secondary-text)]" />
          <span className="text-sm font-medium text-[var(--color-secondary-text)]">
            Share
          </span>
        </div>
        <div className="flex flex-col space-y-3">
          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={
                `flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-surface)] dark:bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-secondary-text)] ${link.color} transition-all duration-200 hover:scale-110 hover:shadow-lg`
              }
              aria-label={`Share on ${link.name}`}
            >
              <link.icon className="w-4 h-4" />
            </a>
          ))}
          <button
            onClick={handleCopyLink}
            className={
              `flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-surface)] dark:bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-secondary-text)] hover:text-[var(--color-accent)] transition-all duration-200 hover:scale-110 hover:shadow-lg ${
                copied ? "text-[var(--color-success)] bg-[var(--color-success-bg)] dark:bg-[var(--color-success-bg)]" : ""
              }`
            }
            aria-label="Copy link"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        {copied && (
          <div className="text-center">
            <span className="text-xs text-[var(--color-success)] font-medium">
              ✓ Copied!
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
