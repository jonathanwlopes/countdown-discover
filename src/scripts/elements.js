const listElements = ["#form", "#error", "#submit", "#reset", "#date", "#form-hours", "#modal", "#config", "#form-close"]

const elements = listElements.reduce((acc, element) => {
  const prop = element.replace(/^./, "")
  const value = element

  const selectedElements = {
    ...acc,
    [prop]: document.querySelector(value),
  }

  return selectedElements
}, {})

export { elements }
