"use client";
import React, { useEffect, useRef, useState } from "react";
import MetaballShader from "./metaballs.glsl";
import bayer8x8Path from "../../index-portfolio/img/shader/8x8-bayer.png";

export default function Shader() {
  const [loaded, setLoaded] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    canvasRef.current.width = 800;
    canvasRef.current.height = 384;
    console.log("test");

    import("glslCanvas").then((GlslCanvas) => {
      const shader = new GlslCanvas.default(canvasRef.current);
      shader.uniformTexture("u_tex0", bayer8x8Path.src);
      shader.load(MetaballShader);
      console.log(shader);
    });
  }, []);

  return (
    <div className="h-96">
      <canvas ref={canvasRef} />
    </div>
  );
}
