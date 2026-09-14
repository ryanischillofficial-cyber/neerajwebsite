import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} · ${site.highlight} | ${site.supportLine}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const font = await readFile(
    join(process.cwd(), "src/app/fonts/PlayfairDisplay-Regular.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#F7F3EB",
          color: "#0B1F3A",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 96,
              height: 88,
              background: "#0B1F3A",
              color: "#F7F3EB",
              fontFamily: "Playfair Display",
              fontSize: 28,
              letterSpacing: 2,
            }}
          >
            A&T
          </div>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 920 }}>
            <div
              style={{
                fontFamily: "Playfair Display",
                fontSize: 34,
                letterSpacing: 3,
                textTransform: "uppercase",
                lineHeight: 1.25,
              }}
            >
              NZ Accounting and Tax Services
            </div>
            <div
              style={{
                marginTop: 14,
                fontSize: 20,
                letterSpacing: 6,
                textTransform: "uppercase",
                color: "#8F7133",
              }}
            >
              {site.highlight}
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: 52,
            fontSize: 26,
            color: "#5C584F",
            lineHeight: 1.45,
            width: 1040,
          }}
        >
          {site.supportLine}
        </div>
        <div
          style={{
            marginTop: 24,
            fontFamily: "Playfair Display",
            fontSize: 32,
            color: "#0B1F3A",
          }}
        >
          {site.name}
        </div>
      </div>
    ),
    {
      ...size,
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
