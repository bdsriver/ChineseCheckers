import van from "vanjs-core";

const { div, input, button } = van.tags;

export function loginPanel() {
  const username = van.state("");
  const password = van.state("");

  return div(
    { class: "flex flex-col gap-2" },
    input({
      class: "input",
      type: "text",
      value: () => username.val,
      oninput: (e) => {
        username.val = e.target.value;
      },
    }),
    input({
      class: "input",
      type: "password",
      value: () => password.val,
      oninput: (e) => {
        password.val = e.target.value;
      },
    }),
    button(
      {
        class: "btn",
        type: "submit",
        onclick: () => console.log(username, password),
      },
      "Log In",
    ),
  );
}
