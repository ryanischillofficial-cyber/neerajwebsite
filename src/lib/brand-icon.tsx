import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

async function playfairRegular() {
  return readFile(
    join(process.cwd(), "src/app/fonts/PlayfairDisplay-Regular.ttf"),
  );
}

export async function brandIconResponse(size: number) {
  const font = await playfairRegular();
  const fontSize = Math.round(size * 0.34);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B1F3A",
          color: "#F7F3EB",
          fontFamily: "Playfair Display",
          fontSize,
          fontWeight: 400,
          letterSpacing: `${Math.round(size * 0.015)}px`,
        }}
      >
        A&T
      </div>
    ),
    {
      width: size,
      height: size,
      fonts: [
        {
          name: "Playfair Display",
          data: font,
          weight: 400,
          style: "normal",
        },
      ],
    },
  );
}
