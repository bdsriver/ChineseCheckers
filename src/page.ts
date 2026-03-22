import van from "vanjs-core";
import { configPanel } from "./page/configPanel";

const { div } = van.tags;

export function page() {
  const loggedIn = van.state(false);

  return div(
    { class: "w-full h-full relative text-red-100" },
    configPanel(loggedIn),
  );
}
