import type { SVGProps } from 'react';

function ContactIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="9.5" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5.5 18.5c1.3-2.6 3.8-4 6.5-4s5.2 1.4 6.5 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default ContactIcon;
