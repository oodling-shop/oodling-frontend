export const siteConfig = {
  name: 'Oodling',
  description: 'Premium Next.js Frontend Framework',
  url: 'https://oodling.com',
  ogImage: 'https://oodling.com/og.jpg',
  links: {
    twitter: 'https://twitter.com/oodling',
    github: 'https://github.com/oodling',
  },
  mainNav: [
    {
      title: 'Features',
      href: '/#features',
    },
    {
      title: 'Pricing',
      href: '/pricing',
    },
    {
      title: 'About',
      href: '/about',
    },
  ],
};

export type SiteConfig = typeof siteConfig;
