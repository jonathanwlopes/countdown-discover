import { database } from "./database.js"
import { elements } from "./elements.js"
import { methods } from "./methods.js"

methods.listeners()

const isLocalStorage = localStorage.getItem("countdown-discover")

if (isLocalStorage) {
  const { modal, submit, reset } = elements
  modal.classList.add("hide")
  submit.setAttribute("disabled", "disabled")
  reset.removeAttribute("disabled")

  const data = JSON.parse(isLocalStorage)
  database.countdown = data

   methods.initCountdown(data.countdown)
}
