"use client";
import { useState } from "react";
import { outlineButton } from "@/lib/tailwind-classes";

const zeroPad = (maxChars: number, toPad: string) => {
  const toGen = maxChars - toPad.length;
  return toGen <= 0 ? toPad : "0".repeat(toGen) + toPad;
};

export const LogoFun = () => {
  const cell = "bg-black text-white text-center font-mono";
  const logo = [0x7f, 0x41, 0x77, 0x14, 0x77, 0x00, 0x7f];
  const buttonLabels = [
    "Convert to binary",
    "Organize",
    "Explode",
    "Collapse to pixels",
    "Do it again :)",
  ];

  const [logoStage, setLogoStage] = useState(0);

  const stage0 = () => {
    return (
      <div className="mb-6 flex flex-wrap justify-center">
        {logo.map((hex, i) => {
          return (
            <span className={cell + " py-3 px-3 mx-1 my-1"} key={i}>
              {zeroPad(2, hex.toString(16))}
            </span>
          );
        })}
      </div>
    );
  };

  const stage1 = () => {
    return (
      <div className="mb-6 flex flex-wrap justify-center">
        {logo.map((hex) => {
          return (
            <span className={cell + " py-3 px-3 mb-0 mx-1 my-1"}>
              {zeroPad(7, hex.toString(2))}
            </span>
          );
        })}
      </div>
    );
  };

  const stage2 = () => {
    return (
      <div
        className={
          cell +
          " grid grid-cols-1 gap-4 w-72 mb-6 py-6 tracking-binary indent-7 m-auto"
        }
      >
        {logo.map((hex) => {
          return <p>{zeroPad(7, hex.toString(2)).trim()}</p>;
        })}
      </div>
    );
  };

  const stage3 = () => {
    return (
      <div className="grid w-72 grid-cols-7 gap-1 mb-6 m-auto">
        {logo.map((hex) => {
          return zeroPad(7, hex.toString(2))
            .split("")
            .map((bin) =>
              bin === "0" ? (
                <div
                  className={
                    "bg-black text-black text-center font-mono inline-block w-10 h-10 bg-white text-black py-2"
                  }
                >
                  0
                </div>
              ) : (
                <div className={cell + " inline-block w-10 h-10 bg-black py-2"}>
                  1
                </div>
              )
            );
        })}
      </div>
    );
  };

  const stage4 = () => {
    return (
      <div className={"mb-6 whitespace-pre"}>
        {logo.map((hex) => {
          return (
            <div>
              {zeroPad(7, hex.toString(2))
                .split("")
                .map((bin) =>
                  bin === "0" ? (
                    <div className={"inline-block w-8 h-8 bg-white"}> </div>
                  ) : (
                    <div className={"inline-block w-8 h-8 bg-black"}> </div>
                  )
                )}
            </div>
          );
        })}
      </div>
    );
  };

  const steps = [stage0, stage1, stage2, stage3, stage4];

  const cycleStages = () => {
    const step = buttonLabels.length - 1 > logoStage ? logoStage + 1 : 0;
    setLogoStage(step);
  };

  return (
    <>
      {steps[logoStage]()}
      <button className={outlineButton + " grow-0"} onClick={cycleStages}>
        {buttonLabels[logoStage]}
      </button>
    </>
  );
};
