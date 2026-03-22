import van from "vanjs-core";

const { svg, path } = van.tags("http://www.w3.org/2000/svg");

export const ICONS = {
  USER: svg(
    {
      xmlns: "http://www.w3.org/2000/svg",
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
      xmlns: "http://www.w3.org/2000/svg",
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
      xmlns: "http://www.w3.org/2000/svg",
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
} as const;
