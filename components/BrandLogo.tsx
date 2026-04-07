
"use client";

import Image from "next/image";
import { BelagaviInlineText } from "@/components/BelagaviInlineText";

type BrandLogoProps = {
  showText?: boolean;
  imageClassName?: string;
  textClassName?: string;
};

export function BrandLogo({
  showText = true,
  imageClassName = "h-10 w-auto",
  textClassName = "font-semibold text-lg hidden sm:inline",
}: BrandLogoProps) {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/grid-log.png"
        alt="Solve for Belagavi logo"
        width={160}
        height={40}
        className={imageClassName}
        priority
      />
      {showText ? (
        <span className={textClassName}>
          Solve for <BelagaviInlineText />
        </span>
      ) : null}
    </div>
  );
}
