import React from 'react';
 
export default function BerryLogo({ size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
    >
      <path d="M50 15 Q48 25 46 35 Q44 40 42 45" stroke="#5A7A3A" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M50 15 Q52 25 55 33 Q57 38 60 42" stroke="#5A7A3A" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M50 15 Q50 30 50 45 Q50 55 50 60" stroke="#5A7A3A" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <ellipse cx="58" cy="14" rx="12" ry="6" transform="rotate(-30 58 14)" fill="#34D399" opacity="0.9"/>
      <path d="M50 15 Q58 12 68 10" stroke="#2AB882" strokeWidth="1.5" fill="none"/>
      <circle cx="36" cy="56" r="18" fill="url(#berryGrad1)"/>
      <circle cx="30" cy="50" r="4" fill="#D63060" opacity="0.5"/>
      <circle cx="38" cy="48" r="4" fill="#D63060" opacity="0.5"/>
      <circle cx="34" cy="57" r="4" fill="#D63060" opacity="0.5"/>
      <circle cx="42" cy="55" r="4" fill="#D63060" opacity="0.4"/>
      <circle cx="30" cy="62" r="3.5" fill="#D63060" opacity="0.4"/>
      <circle cx="39" cy="64" r="3.5" fill="#D63060" opacity="0.35"/>
      <circle cx="31" cy="48" r="2.5" fill="white" opacity="0.35"/>
      <circle cx="64" cy="53" r="17" fill="url(#berryGrad2)"/>
      <circle cx="58" cy="47" r="3.8" fill="#7A1845" opacity="0.5"/>
      <circle cx="66" cy="46" r="3.8" fill="#7A1845" opacity="0.5"/>
      <circle cx="62" cy="54" r="3.8" fill="#7A1845" opacity="0.5"/>
      <circle cx="70" cy="52" r="3.5" fill="#7A1845" opacity="0.4"/>
      <circle cx="58" cy="60" r="3.5" fill="#7A1845" opacity="0.4"/>
      <circle cx="67" cy="60" r="3.5" fill="#7A1845" opacity="0.35"/>
      <circle cx="59" cy="45" r="2.3" fill="white" opacity="0.3"/>
      <circle cx="50" cy="75" r="16" fill="url(#berryGrad3)"/>
      <circle cx="44" cy="70" r="3.5" fill="#3A4DB0" opacity="0.5"/>
      <circle cx="52" cy="68" r="3.5" fill="#3A4DB0" opacity="0.5"/>
      <circle cx="48" cy="77" r="3.5" fill="#3A4DB0" opacity="0.5"/>
      <circle cx="56" cy="75" r="3.5" fill="#3A4DB0" opacity="0.4"/>
      <circle cx="44" cy="82" r="3" fill="#3A4DB0" opacity="0.35"/>
      <circle cx="54" cy="82" r="3" fill="#3A4DB0" opacity="0.35"/>
      <circle cx="45" cy="68" r="2.2" fill="white" opacity="0.35"/>
      <defs>
        <radialGradient id="berryGrad1" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#F04080"/>
          <stop offset="70%" stopColor="#C02858"/>
          <stop offset="100%" stopColor="#8C1E40"/>
        </radialGradient>
        <radialGradient id="berryGrad2" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#B83070"/>
          <stop offset="70%" stopColor="#8C2A5E"/>
          <stop offset="100%" stopColor="#5A1535"/>
        </radialGradient>
        <radialGradient id="berryGrad3" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#6070E0"/>
          <stop offset="70%" stopColor="#4A5BCF"/>
          <stop offset="100%" stopColor="#2A3590"/>
        </radialGradient>
      </defs>
    </svg>
  );
}