import van, { type State } from "vanjs-core";

export interface AppState {
  loggedIn: State<boolean>;
}

/** Initializes VanJS states that app uses globally */
export function initAppState(): AppState {
  return {
    loggedIn: van.state(false),
  };
}
