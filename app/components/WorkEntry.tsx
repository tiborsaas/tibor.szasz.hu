"use client";
import { StaticImageData } from "next/image";
import React, { useEffect, useRef } from "react";

type WorkEntryType = {
  image: StaticImageData;
  title: string;
  description: string;
  link?: string;
  buttonText?: string;
  grayscale?: boolean;
};

export default function WorkEntry({
  image,
  title,
  description,
  link,
  buttonText = "Read more",
  grayscale,
}: WorkEntryType) {
  const buttonClassList =
    "bg-white hover:bg-black hover:text-white border border-black text-black font-bold py-2 px-3 duration-200 transition-colors";
  const grayscaleClasses = grayscale ? "saturate-0 hover:saturate-100 " : "";
  const imageClasses = `${grayscaleClasses}transition-all mb-4`;

  return (
    <article className="mb-16">
      <img src={image.src} alt={title} className={imageClasses} />
      <h2 className="font-bold text-2xl tracking-tighter mb-1">{title}</h2>
      <p className="mb-4">{description}</p>
      {link && (
        <a href={link} className={buttonClassList}>
          {buttonText}
        </a>
      )}
    </article>
  );
}
