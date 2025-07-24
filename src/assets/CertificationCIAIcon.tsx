import React from "react";

const CertificationCIAIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={80}
    height={80}
    viewBox="0 0 80 80"
    fill="none"
    {...props}
  >
    <rect x="10" y="20" width="60" height="40" rx="8" fill="#0ea5e9" />
    <rect x="20" y="30" width="40" height="20" rx="4" fill="white" />
    <circle cx="40" cy="40" r="6" fill="#0ea5e9" />
    <rect x="36" y="50" width="8" height="6" rx="2" fill="#0ea5e9" />
    <path d="M40 30 v-8" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="40" cy="20" r="3" fill="#0ea5e9" />
  </svg>
);

export default CertificationCIAIcon; 