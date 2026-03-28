import van from "vanjs-core";

const { svg, path } = van.tags("http://www.w3.org/2000/svg");

const playerTriangleFills = [
  path({ fill: "currentColor", d: "M9 17L15 17L12 22L9 17" }),
  path({ fill: "currentColor", d: "M6 12L3 17L9 17L6 12" }),
  path({ fill: "currentColor", d: "M6 12L3 7L9 7L6 12" }),
  path({ fill: "currentColor", d: "M12 2L15 7L9 7L12 2" }),
  path({ fill: "currentColor", d: "M18 12L15 7L21 7L18 12" }),
  path({ fill: "currentColor", d: "M18 12L15 17L21 17L18 12" }),
];

/** Source https://tabler.io/icons (outline style, size 32, stroke 2) */
/** HTML to JS conversion done with https://vanjs.org/convert */
export const ICONS = {
  USER: svg(
    {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    },
    path({ stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
    path({ d: "M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" }),
    path({ d: "M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" }),
  ),
  USER_GROUP: svg(
    {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    },
    path({ stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
    path({ d: "M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" }),
    path({ d: "M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1" }),
    path({ d: "M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" }),
    path({ d: "M17 10h2a2 2 0 0 1 2 2v1" }),
    path({ d: "M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" }),
    path({ d: "M3 13v-1a2 2 0 0 1 2 -2h2" }),
  ),
  TROPHY: svg(
    {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    },
    path({ stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
    path({ d: "M8 21l8 0" }),
    path({ d: "M12 17l0 4" }),
    path({ d: "M7 4l10 0" }),
    path({ d: "M17 4v8a5 5 0 0 1 -10 0v-8" }),
    path({ d: "M3 9a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" }),
    path({ d: "M17 9a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" }),
  ),
  PLAYER_POSITION_INDICATORS: playerTriangleFills.map((fill) =>
    svg(
      {
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "1",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
      },
      path({ d: "M12 2l3 5h6l-3 5l3 5h-6l-3 5l-3 -5h-6l3 -5l-3 -5h6l3 -5" }),
      fill,
    ),
  ),
} as const;
