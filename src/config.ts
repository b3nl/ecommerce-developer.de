import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://ecommerce-developer.de/", // replace this with your deployed domain
  author: "Björn Lange",
  desc: "Ich bin der E-Commerce Developer und hier " +
    "teile ich meine Gedanken, Erfahrungen und Einblicke aus der spannenden Welt " +
    "des E-Commerce und der Softwareentwicklung. Als CTO führender " +
    "Digitalagenturen habe ich über die Jahre viel gelernt – von agilen " +
    "Prozessen und innovativen Technologien bis hin zu Teamführung und " +
    "Unternehmenskultur. Dieser Blog ist meine Plattform, um diese Erkenntnisse mit " +
    "Dir zu teilen und gemeinsam über die Zukunft unserer Branche nachzudenken.",
  title: "E-Commerce Developer",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 10,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: false,
};

export const LOCALE = {
  lang: "de", // html lang code. Set this empty and default will be "en"
  langTag: ["de-DE"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/b3nl",
    linkTitle: `${SITE.title} on Github`,
    active: true,
  },
  {
    name: "Facebook",
    href: "https://www.linkedin.com/in/bjoern-simon-lange/",
    linkTitle: `${SITE.title} on Facebook`,
    active: false,
  },
  {
    name: "Instagram",
    href: "https://www.linkedin.com/in/bjoern-simon-lange/",
    linkTitle: `${SITE.title} on Instagram`,
    active: false,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/bjoern-simon-lange/",
    linkTitle: `${SITE.title} on LinkedIn`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:blog@ecommerce-developer.de",
    linkTitle: `Send an email to ${SITE.title}`,
    active: true,
  },
  {
    name: "X",
    href: "https://www.linkedin.com/in/bjoern-simon-lange/",
    linkTitle: `${SITE.title} on X`,
    active: false,
  },
  {
    name: "Twitch",
    href: "https://www.linkedin.com/in/bjoern-simon-lange/",
    linkTitle: `${SITE.title} on Twitch`,
    active: false,
  },
  {
    name: "YouTube",
    href: "https://www.linkedin.com/in/bjoern-simon-lange/",
    linkTitle: `${SITE.title} on YouTube`,
    active: false,
  },
  {
    name: "WhatsApp",
    href: "https://www.linkedin.com/in/bjoern-simon-lange/",
    linkTitle: `${SITE.title} on WhatsApp`,
    active: false,
  },
  {
    name: "Snapchat",
    href: "https://www.linkedin.com/in/bjoern-simon-lange/",
    linkTitle: `${SITE.title} on Snapchat`,
    active: false,
  },
  {
    name: "Pinterest",
    href: "https://www.linkedin.com/in/bjoern-simon-lange/",
    linkTitle: `${SITE.title} on Pinterest`,
    active: false,
  },
  {
    name: "TikTok",
    href: "https://www.linkedin.com/in/bjoern-simon-lange/",
    linkTitle: `${SITE.title} on TikTok`,
    active: false,
  },
  {
    name: "CodePen",
    href: "https://www.linkedin.com/in/bjoern-simon-lange/",
    linkTitle: `${SITE.title} on CodePen`,
    active: false,
  },
  {
    name: "Discord",
    href: "https://www.linkedin.com/in/bjoern-simon-lange/",
    linkTitle: `${SITE.title} on Discord`,
    active: false,
  },
  {
    name: "GitLab",
    href: "https://www.linkedin.com/in/bjoern-simon-lange/",
    linkTitle: `${SITE.title} on GitLab`,
    active: false,
  },
  {
    name: "Reddit",
    href: "https://www.linkedin.com/in/bjoern-simon-lange/",
    linkTitle: `${SITE.title} on Reddit`,
    active: false,
  },
  {
    name: "Skype",
    href: "https://www.linkedin.com/in/bjoern-simon-lange/",
    linkTitle: `${SITE.title} on Skype`,
    active: false,
  },
  {
    name: "Steam",
    href: "https://www.linkedin.com/in/bjoern-simon-lange/",
    linkTitle: `${SITE.title} on Steam`,
    active: false,
  },
  {
    name: "Telegram",
    href: "https://www.linkedin.com/in/bjoern-simon-lange/",
    linkTitle: `${SITE.title} on Telegram`,
    active: false,
  },
  {
    name: "Mastodon",
    href: "https://www.linkedin.com/in/bjoern-simon-lange/",
    linkTitle: `${SITE.title} on Mastodon`,
    active: false,
  },
];
