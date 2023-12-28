import { ImageResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // ?title=<title>
    const hasTitle = searchParams.has("title");
    const title = hasTitle
      ? searchParams.get("title")?.slice(0, 100)
      : "My Outstatic Site";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            flexWrap: "nowrap",
            padding: "0 100px",
          }}
        >
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              textAlign: "center",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              flexWrap: "nowrap",
              position: "absolute",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              viewBox="0 0 1200 630"
              width="1200"
              height="630"
            >
              <defs>
                <linearGradient
                  gradientTransform="rotate(-150, 0.5, 0.5)"
                  x1="50%"
                  y1="0%"
                  x2="50%"
                  y2="100%"
                  id="gggrain-gradient2"
                >
                  <stop
                    stop-color="hsla(0, 0%, 19%, 1.00)"
                    stop-opacity="1"
                    offset="-0%"
                  ></stop>
                  <stop
                    stop-color="rgba(255,255,255,0)"
                    stop-opacity="0"
                    offset="100%"
                  ></stop>
                </linearGradient>
                <linearGradient
                  gradientTransform="rotate(150, 0.5, 0.5)"
                  x1="50%"
                  y1="0%"
                  x2="50%"
                  y2="100%"
                  id="gggrain-gradient3"
                >
                  <stop stop-color="hsl(0, 0%, 45%)" stop-opacity="1"></stop>
                  <stop
                    stop-color="rgba(255,255,255,0)"
                    stop-opacity="0"
                    offset="100%"
                  ></stop>
                </linearGradient>
                <filter
                  id="gggrain-filter"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                  filterUnits="objectBoundingBox"
                  primitiveUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.55"
                    numOctaves="2"
                    seed="2"
                    stitchTiles="stitch"
                    x="0%"
                    y="0%"
                    width="100%"
                    height="100%"
                    result="turbulence"
                  ></feTurbulence>
                  <feColorMatrix
                    type="saturate"
                    values="0"
                    x="0%"
                    y="0%"
                    width="100%"
                    height="100%"
                    in="turbulence"
                    result="colormatrix"
                  ></feColorMatrix>
                  <feComponentTransfer
                    x="0%"
                    y="0%"
                    width="100%"
                    height="100%"
                    in="colormatrix"
                    result="componentTransfer"
                  >
                    <feFuncR type="linear" slope="3"></feFuncR>
                    <feFuncG type="linear" slope="3"></feFuncG>
                    <feFuncB type="linear" slope="3"></feFuncB>
                  </feComponentTransfer>
                  <feColorMatrix
                    x="0%"
                    y="0%"
                    width="100%"
                    height="100%"
                    in="componentTransfer"
                    result="colormatrix2"
                    type="matrix"
                    values="1 0 0 0 0
        0 1 0 0 0
        0 0 1 0 0
        0 0 0 19 -11"
                  ></feColorMatrix>
                </filter>
              </defs>
              <g>
                <rect width="100%" height="100%" fill="hsl(0, 0%, 100%)"></rect>
                <rect
                  width="100%"
                  height="100%"
                  fill="url(#gggrain-gradient3)"
                ></rect>
                <rect
                  width="100%"
                  height="100%"
                  fill="url(#gggrain-gradient2)"
                ></rect>
                <rect
                  width="100%"
                  height="100%"
                  fill="transparent"
                  filter="url(#gggrain-filter)"
                  opacity="1"
                  style={{ mixBlendMode: "soft-light" }}
                ></rect>
              </g>
            </svg>
          </div>
          <h2 tw="flex flex-col text-[120px] font-black tracking-tight text-gray-900 text-left">
            {title}
          </h2>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
