import { LucideIcon, Github, Linkedin, Mail, TwitterIcon } from 'lucide-react';

export interface SocialLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const socialLinks: SocialLink[] = [
  {
    href: 'mailto:hananhaider.pk@gmail.com',
    label: 'Email',
    icon: Mail,
  },
  {
    href: 'https://github.com/sayedhanan',
    label: 'GitHub',
    icon: Github,
  },
  {
    href: 'https://linkedin.com/in/sayedhanan',
    label: 'LinkedIn',
    icon: Linkedin,
  },
  {
    href: 'https://x.com/iSayedHanan',
    label: 'Twitter',
    icon: TwitterIcon,
  },
];
