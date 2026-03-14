import van from "vanjs-core";
import type { AppState } from "../state";
import { multiPanel } from "./gameSelection/multiPanel";
import { rankedPanel } from "./gameSelection/rankedPanel";
import { singlePanel } from "./gameSelection/singlePanel";

const { div, button, hr } = van.tags;

type Tab = "single" | "multi" | "ranked";

export function gameTypeSelection(appState: AppState) {
  const activeTab = van.state<Tab>("single");
  const activeTabStyle = { style: "border-transparent" };
  const passiveTabStyle = { style: "bg-taupe-500 cursor-pointer" };
  const tabStyle = (tab: Tab) => ({ style: `flex-1 border-b-2 ${activeTab.val === tab ? activeTabStyle.style : passiveTabStyle.style}`})

  return div(
    {
      className:
        "flex items-center justify-center flex-col flex-1 m-3 h-2/3 border-2 border-black bg-taupe-300",
    },
    div(
      {
        className:
          "flex-1 flex w-full items-stretch justify-evenly text-center",
      },
      button(
        {
          className: () => tabStyle("single").style,
          onclick: () => {
            activeTab.val = "single";
          },
        },
        "Single Player",
      ),
      hr({ className: "border h-full" }),
      button(
        {
          className: () => tabStyle("multi").style,
          onclick: () => {
            activeTab.val = "multi";
          },
        },
        "Multiplayer",
      ),
      hr({ className: "border h-full" }),
      button(
        {
          className: () => tabStyle("ranked").style,
          onclick: () => {
            activeTab.val = "ranked";
          },
        },
        "Ranked",
      ),
    ),
    div({ className: "flex-10 p-2" }, () =>
      activeTab.val === "single"
        ? singlePanel()
        : activeTab.val === "multi"
          ? multiPanel()
          : rankedPanel(),
    ),
  );
}
