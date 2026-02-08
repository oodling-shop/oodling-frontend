export const siteConfig = {
  name: 'Nayzak',
  description: 'Premium Next.js Frontend Framework',
  url: 'https://nayzak.com',
  ogImage: 'https://nayzak.com/og.jpg',
  links: {
    twitter: 'https://twitter.com/nayzak',
    github: 'https://github.com/nayzak',
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
