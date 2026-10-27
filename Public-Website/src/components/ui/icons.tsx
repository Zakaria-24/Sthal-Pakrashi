import type { SVGProps } from "react";

import { cn } from "@/lib/utils";

/**
 * Inline icon set. Icons take their size from `className` (default size-4) and
 * their colour from `currentColor`, so they follow the surrounding text token.
 * They are decorative by default (aria-hidden); wrap them in a labelled
 * control for meaning.
 */
type IconProps = SVGProps<SVGSVGElement>;

function Svg({ className, children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cn("size-4 shrink-0", className)}
      {...props}
    >
      {children}
    </svg>
  );
}

export const SearchIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Svg>
);

export const CloseIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);

export const MenuIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);

export const ChevronDownIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
);

export const ChevronsRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m6 17 5-5-5-5M13 17l5-5-5-5" />
  </Svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);

export const ArrowUpRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </Svg>
);

export const PlusIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const MinusIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14" />
  </Svg>
);

export const PinIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 21s-7-6.4-7-11a7 7 0 1 1 14 0c0 4.6-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.3" />
  </Svg>
);

export const IdCardIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M7 9h6M7 13h4" />
  </Svg>
);

export const PlayIcon = (p: IconProps) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
  </Svg>
);

export const QuoteIcon = (p: IconProps) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <path d="M9.5 6C6.5 6.6 4 9.3 4 13v5h6v-6H7c0-2 1-3.3 2.9-3.8L9.5 6Zm9 0c-3 .6-5.5 3.3-5.5 7v5h6v-6h-3c0-2 1-3.3 2.9-3.8L18.5 6Z" />
  </Svg>
);

export const StarIcon = (p: IconProps) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <path d="m12 2.8 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.6l-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9L12 2.8Z" />
  </Svg>
);

export const FacebookIcon = (p: IconProps) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.79c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z" />
  </Svg>
);

export const YoutubeIcon = (p: IconProps) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <path d="M23.5 6.2s-.23-1.64-.94-2.36c-.9-.95-1.9-.95-2.36-1C16.9 2.5 12 2.5 12 2.5h-.01s-4.89 0-8.19.34c-.46.05-1.46.05-2.36 1-.71.72-.94 2.36-.94 2.36S0 8.1 0 10v1.79c0 1.9.23 3.8.23 3.8s.23 1.64.94 2.36c.9.95 2.08.92 2.6 1.02 1.9.18 8.23.34 8.23.34s4.9-.01 8.2-.35c.46-.05 1.46-.05 2.36-1 .71-.72.94-2.36.94-2.36s.23-1.9.23-3.8V10c0-1.9-.23-3.8-.23-3.8zM9.55 14.9V8.3l6.27 3.3-6.27 3.3z" />
  </Svg>
);

export const DocumentIcon = (p: IconProps) => (
  <Svg {...p} strokeWidth={1.8}>
    <path d="M8 3h6l4 4v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
    <path d="M14 3v4h4M9 13h6M9 17h6M9 9h2" />
  </Svg>
);

export const ClipboardCheckIcon = (p: IconProps) => (
  <Svg {...p} strokeWidth={1.8}>
    <rect x="6" y="4" width="12" height="17" rx="2" />
    <path d="M9 3h6a1 1 0 0 1 1 1v1H8V4a1 1 0 0 1 1-1Z" />
    <path d="m9.5 13 2 2 4-4" />
  </Svg>
);

export const RocketIcon = (p: IconProps) => (
  <Svg {...p} strokeWidth={1.8}>
    <path d="M12 2c2.5 2 4 5.2 4 9 0 2-1 4-4 6-3-2-4-4-4-6 0-3.8 1.5-7 4-9Z" />
    <circle cx="12" cy="10" r="1.6" />
    <path d="M9 15.5 6.5 19M15 15.5 17.5 19" />
  </Svg>
);

export const GraduationCapIcon = (p: IconProps) => (
  <Svg {...p} strokeWidth={1.8}>
    <path d="M22 9 12 5 2 9l10 4 10-4Z" />
    <path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5M22 9v6" />
  </Svg>
);

export const BulbIcon = (p: IconProps) => (
  <Svg {...p} strokeWidth={1.8}>
    <path d="M9 18h6M10 21h4" />
    <path d="M12 3a6 6 0 0 0-4 10.5c.5.5.8 1 .9 1.5h6.2c.1-.5.4-1 .9-1.5A6 6 0 0 0 12 3Z" />
  </Svg>
);

export const MedalIcon = (p: IconProps) => (
  <Svg {...p} strokeWidth={1.8}>
    <path d="M12 2v6M8 5l4 3 4-3" />
    <circle cx="12" cy="13" r="5" />
    <path d="m9.5 22 2.5-4 2.5 4" />
  </Svg>
);

export const TrophyIcon = (p: IconProps) => (
  <Svg {...p} strokeWidth={1.8}>
    <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
    <path d="M8 6H4v1.5A3.5 3.5 0 0 0 7.5 11M16 6h4v1.5a3.5 3.5 0 0 1-3.5 3.5" />
    <path d="M12 13v4M8.5 20h7M10 17h4v3h-4z" />
  </Svg>
);

export const BookIcon = (p: IconProps) => (
  <Svg {...p} strokeWidth={1.8}>
    <path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5v-13Z" />
    <path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5v-13Z" />
  </Svg>
);

export const UsersIcon = (p: IconProps) => (
  <Svg {...p} strokeWidth={1.8}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" />
    <path d="M16 5a3.2 3.2 0 0 1 0 6M18 14.8c1.8.7 3 2.4 3 5.2" />
  </Svg>
);

export const FlaskIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 3v7.5L4.5 18a1.5 1.5 0 0 0 1.3 2.25h12.4A1.5 1.5 0 0 0 19.5 18L15 10.5V3M9 3h6M8 15h8" />
  </Svg>
);

export const ActivityIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 12h4l3 8 4-16 3 8h4" />
  </Svg>
);

export const ClockIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </Svg>
);

export const CalendarIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M16 3v4M8 3v4M3 10h18" />
  </Svg>
);

export const ListIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8 6h13M8 12h13M8 18h13" />
    <circle cx="4" cy="6" r="1" />
    <circle cx="4" cy="12" r="1" />
    <circle cx="4" cy="18" r="1" />
  </Svg>
);

export const FileStackIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5M9 13h6M9 17h6" />
  </Svg>
);

export const CheckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 6 9 17l-5-5" />
  </Svg>
);
