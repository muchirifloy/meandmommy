import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Me & Mommy baby care essentials";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#eef8ff",
          color: "#172033",
          padding: 72,
          fontSize: 48,
          fontWeight: 800,
        }}
      >
        <div style={{ color: "#55aee2", fontSize: 64 }}>Me & Mommy</div>
        <div style={{ marginTop: 24 }}>Breastmilk storage and bottle care essentials</div>
        <div style={{ marginTop: 20, fontSize: 28, fontWeight: 500 }}>
          Breastmilk storage bags and sterilising tablets for modern parents.
        </div>
      </div>
    ),
    size,
  );
}
