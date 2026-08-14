import * as React from "react";

function Svg({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className="h-10 w-10 shrink-0" role="img" aria-label={label}>
      {children}
    </svg>
  );
}

/** Official Instagram rounded-square mark. */
export function InstagramBrandIcon() {
  const uid = React.useId().replace(/:/g, "");
  return (
    <Svg label="Instagram">
      <defs>
        <radialGradient id={`${uid}-ig`} cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill={`url(#${uid}-ig)`} />
      <circle cx="12" cy="12" r="4.15" fill="none" stroke="#fff" strokeWidth="1.7" />
      <circle cx="16.55" cy="7.45" r="1.05" fill="#fff" />
      <rect
        x="4.35"
        y="4.35"
        width="15.3"
        height="15.3"
        rx="4.4"
        fill="none"
        stroke="#fff"
        strokeWidth="1.7"
      />
    </Svg>
  );
}

/** Official Facebook f-in-blue mark. */
export function FacebookBrandIcon() {
  return (
    <Svg label="Facebook">
      <rect width="24" height="24" rx="6" fill="#1877F2" />
      <path
        fill="#fff"
        d="M16.55 8.2h-2.05c-.28 0-.85.14-.85.9v1.2h2.85l-.38 2.55h-2.47V21h-3.05v-7.15H8.4v-2.55h2.15V8.85c0-2.55 1.12-3.95 3.85-3.95.82 0 1.95.15 1.95.15v2.2h-1.12c-1.08 0-.68.52-.68 1.35v1.6z"
      />
    </Svg>
  );
}

/** Official X (Twitter) mark. */
export function XBrandIcon() {
  return (
    <Svg label="X">
      <rect width="24" height="24" rx="6" fill="#000" />
      <path
        fill="#fff"
        d="M16.99 6.15h1.84l-4.02 4.6 4.73 6.25h-3.7l-2.9-3.79-3.32 3.79H6.78l4.3-4.92-4.54-5.93h3.8l2.62 3.47 3.03-3.47zm-.65 9.75h1.02L8.16 7.19H7.07l9.27 8.71z"
      />
    </Svg>
  );
}

/** Official WhatsApp mark. */
export function WhatsAppBrandIcon() {
  return (
    <Svg label="WhatsApp">
      <rect width="24" height="24" rx="12" fill="#25D366" />
      <path
        fill="#fff"
        d="M17.06 14.29c-.22-.11-1.32-.65-1.52-.73-.2-.07-.35-.11-.5.11-.15.22-.57.72-.7.87-.13.15-.26.17-.48.06-.22-.11-.94-.35-1.79-1.11-.66-.59-1.11-1.32-1.24-1.54-.13-.22-.01-.34.1-.45.1-.1.22-.26.33-.39.11-.13.15-.22.22-.37.07-.15.04-.28-.02-.39-.06-.11-.5-1.21-.69-1.66-.18-.43-.37-.37-.5-.38-.13 0-.28-.01-.43-.01-.15 0-.39.06-.59.28-.2.22-.78.76-.78 1.86 0 1.1.8 2.16.91 2.31.11.15 1.57 2.4 3.81 3.36.53.23.95.37 1.27.47.53.17 1.02.15 1.4.09.43-.06 1.32-.54 1.5-1.06.19-.52.19-.97.13-1.06-.05-.09-.2-.15-.43-.26zM12.05 19.4h0a7.4 7.4 0 0 1-3.77-1.03l-.27-.16-2.81.74.75-2.74-.18-.28a7.4 7.4 0 0 1-1.13-3.94C4.65 8.22 7.97 4.9 12.05 4.9a7.37 7.37 0 0 1 5.24 2.17 7.37 7.37 0 0 1 2.17 5.24c0 4.08-3.32 7.4-7.41 7.4zm6.31-13.72A9.05 9.05 0 0 0 12.05 3C7.13 3 3.13 7 3.13 11.92c0 1.57.41 3.11 1.19 4.46L3 21l4.73-1.24a9.06 9.06 0 0 0 4.32 1.1h0c4.92 0 8.92-4 8.92-8.92a9.04 9.04 0 0 0-2.61-6.26z"
      />
    </Svg>
  );
}

/** Gmail-style mark for email share. */
export function GmailBrandIcon() {
  return (
    <Svg label="Email">
      <rect width="24" height="24" rx="6" fill="#fff" />
      <path fill="#4285F4" d="M3.6 6.6v10.8l6-4.65V8.7L3.6 6.6z" />
      <path fill="#34A853" d="M20.4 6.6v10.8l-6-4.65V8.7l6-2.1z" />
      <path fill="#FBBC04" d="M3.6 17.4 12 10.8l8.4 6.6v1.2c0 .99-.81 1.8-1.8 1.8H5.4c-.99 0-1.8-.81-1.8-1.8v-1.2z" />
      <path fill="#EA4335" d="M20.4 6.6 12 12.6 3.6 6.6 5.4 4.8h13.2l1.8 1.8z" />
    </Svg>
  );
}

/** Standard copy-link glyph (no brand). */
export function CopyLinkIcon() {
  return (
    <Svg label="Copy link">
      <rect width="24" height="24" rx="6" fill="#5B5FC7" />
      <path
        fill="none"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
        d="M10.2 13.8a3.2 3.2 0 0 0 4.53.13l2.27-2.27a3.2 3.2 0 0 0-4.53-4.53l-1.3 1.29"
      />
      <path
        fill="none"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
        d="M13.8 10.2a3.2 3.2 0 0 0-4.53-.13L7 12.34a3.2 3.2 0 0 0 4.53 4.53l1.3-1.29"
      />
    </Svg>
  );
}

export const SHARE_DESTINATIONS = [
  { id: "Instagram", label: "Instagram", Icon: InstagramBrandIcon },
  { id: "Facebook", label: "Facebook", Icon: FacebookBrandIcon },
  { id: "X / Twitter", label: "X / Twitter", Icon: XBrandIcon },
  { id: "Copy Link", label: "Copy Link", Icon: CopyLinkIcon },
  { id: "WhatsApp", label: "WhatsApp", Icon: WhatsAppBrandIcon },
  { id: "Email", label: "Email", Icon: GmailBrandIcon },
] as const;
