import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const s = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export const ToothMark = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M8.1 3.4c-2.4 0-4.1 2-4.1 4.4 0 3.3 1.5 4.6 1.9 7.6.2 1.8.7 2.9 1.7 2.9 1.3 0 1-2.5 1.7-4.3.4-1.2 1-1.7 2.7-1.7s2.3.5 2.7 1.7c.7 1.8.4 4.3 1.7 4.3 1 0 1.5-1.1 1.7-2.9.4-3 1.9-4.3 1.9-7.6 0-2.4-1.7-4.4-4.1-4.4-1.5 0-2.2.9-3.8.9s-2.4-.9-3.1-.9Z" />
  </svg>
);

export const IconGentle = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...s} {...p}>
    <path d="M12 21c0-6 0-9 4.5-13" />
    <path d="M16.5 8c4.5 0 5.5-3 5.5-6-4.5 0-6 2-5.5 6Z" />
    <path d="M12 12c-3.5 0-5.5-1.5-6-5 4 0 5.5 1.5 6 5Z" />
  </svg>
);

export const IconScan = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...s} {...p}>
    <path d="M12 3 4.5 7v10L12 21l7.5-4V7L12 3Z" />
    <path d="M4.5 7 12 11l7.5-4" />
    <path d="M12 11v10" />
    <path d="M2 12h2M20 12h2" />
  </svg>
);

export const IconCrown = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...s} {...p}>
    <path d="m4 8 4 3.5L12 5l4 6.5L20 8l-1.5 10h-13L4 8Z" />
    <path d="M7 21h10" />
  </svg>
);

export const IconFlask = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...s} {...p}>
    <path d="M10 3h4" />
    <path d="M10.5 3v5.2L5.3 17a3.4 3.4 0 0 0 3 5h7.4a3.4 3.4 0 0 0 3-5l-5.2-8.8V3" />
    <path d="M7.5 14h9" />
  </svg>
);

export const IconReceipt = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...s} {...p}>
    <path d="M6 3h12v18l-2.4-1.6L13.2 21l-2.4-1.6L8.4 21 6 19.4V3Z" />
    <path d="M9.5 8h5M9.5 12h5" />
  </svg>
);

export const IconHours = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...s} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2.5" />
  </svg>
);

export const IconCheck = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...s} strokeWidth={2.2} {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

export const IconArrowRight = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...s} strokeWidth={1.8} {...p}>
    <path d="M4 12h15M13.5 6l6 6-6 6" />
  </svg>
);

export const IconArrowDown = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...s} strokeWidth={1.8} {...p}>
    <path d="M12 4v15M6 13.5l6 6 6-6" />
  </svg>
);

export const IconStar = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.3L12 17.1l-5.7 3.1 1.2-6.3L2.8 9.5l6.4-.8L12 2.8Z" />
  </svg>
);

export const IconPhone = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...s} {...p}>
    <path d="M5.5 3.5h3.2l1.6 4.2-2.1 1.6a12.5 12.5 0 0 0 6.5 6.5l1.6-2.1 4.2 1.6v3.2c0 1-.8 1.9-1.9 1.8C10 19.6 4.4 14 3.7 5.4c-.1-1 .8-1.9 1.8-1.9Z" />
  </svg>
);

export const IconMapPin = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...s} {...p}>
    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);

export const IconMail = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...s} {...p}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
    <path d="m4.5 7.5 7.5 5.5 7.5-5.5" />
  </svg>
);

export const IconPlus = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...s} strokeWidth={1.8} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconMenu = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...s} strokeWidth={1.8} {...p}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
);

export const IconClose = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...s} strokeWidth={1.8} {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const IconChevron = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...s} strokeWidth={1.8} {...p}>
    <path d="m9 5 7 7-7 7" />
  </svg>
);

export const IconQuote = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M9.6 6C6.4 7.5 4.5 10 4.5 13.6c0 2.7 1.6 4.4 3.7 4.4 1.9 0 3.3-1.4 3.3-3.2 0-1.7-1.2-3-2.9-3-.3 0-.7 0-.8.1.3-1.9 1.7-3.6 3.6-4.5L9.6 6Zm9 0c-3.2 1.5-5.1 4-5.1 7.6 0 2.7 1.6 4.4 3.7 4.4 1.9 0 3.3-1.4 3.3-3.2 0-1.7-1.2-3-2.9-3-.3 0-.7 0-.8.1.3-1.9 1.7-3.6 3.6-4.5L18.6 6Z" />
  </svg>
);

export const IconSparkle = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 2.5c.7 4.8 2.7 6.8 7.5 7.5-4.8.7-6.8 2.7-7.5 7.5-.7-4.8-2.7-6.8-7.5-7.5 4.8-.7 6.8-2.7 7.5-7.5Z" />
    <path d="M19 15.5c.35 2.4 1.35 3.4 3.75 3.75-2.4.35-3.4 1.35-3.75 3.75-.35-2.4-1.35-3.4-3.75-3.75 2.4-.35 3.4-1.35 3.75-3.75Z" opacity=".7" />
  </svg>
);

export const IconShield = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...s} {...p}>
    <path d="M12 3 5 5.8v5.4c0 4.4 3 7.7 7 9.3 4-1.6 7-4.9 7-9.3V5.8L12 3Z" />
    <path d="m8.8 11.8 2.3 2.3 4.1-4.6" />
  </svg>
);

export const IconCalendar = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...s} {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" />
  </svg>
);

export const IconInstagram = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...s} {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const IconFacebook = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...s} {...p}>
    <path d="M14.5 8.5H17V5h-2.5A4 4 0 0 0 10.5 9v2.5H8V15h2.5v6h3.5v-6h2.5l.5-3.5H14V9.5c0-.6.4-1 1-1Z" />
  </svg>
);

export const IconGlobe = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...s} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17" />
    <path d="M12 3.5c2.5 2.3 3.8 5.2 3.8 8.5s-1.3 6.2-3.8 8.5c-2.5-2.3-3.8-5.2-3.8-8.5s1.3-6.2 3.8-8.5Z" />
  </svg>
);

export const IconPlay = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...p}>
    <path d="M7 4l12 8-12 8V4Z" />
  </svg>
);

export const IconXSocial = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...s} strokeWidth={1.8} {...p}>
    <path d="m4.5 4.5 15 15M19.5 4.5 13 11.5M11 12.5 4.5 19.5" />
  </svg>
);
