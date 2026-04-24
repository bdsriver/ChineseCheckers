import van from "vanjs-core";
import { ApplicationState } from "../application/state.ts";

const { div, input, button } = van.tags;

export function loginPanel(application: ApplicationState) {
  const username = van.state("");
  const password = van.state("");

  return div(
    { class: "flex items-center flex-col gap-2" },
    input({
      class: "input",
      type: "text",
      placeholder: "Username",
      value: () => username.val,
      oninput: (e) => {
        username.val = e.target.value;
      },
    }),
    input({
      class: "input",
      type: "password",
      placeholder: "Password",
      value: () => password.val,
      oninput: (e) => {
        password.val = e.target.value;
      },
    }),
    div(
      { class: "flex gap-2" },
      button(
        {
          class: "btn",
          type: "submit",
          onclick: () => application.login(username.val, password.val),
        },
        "Log In",
      ),
      button(
        {
          class: "btn",
          type: "submit",
          onclick: () => application.signup(username.val, password.val),
        },
        "Sign Up",
      ),
    ),
  );
}
