import { elements } from "./elements.js"
import { database } from "./database.js"

export const methods = {
  getElement: (element) => {
    return document.querySelector(element)
  },

  listeners: () => {
    const { submit, reset, ["form-hours"]: hours, config, ["form-close"]: closeModal } = elements

    submit.addEventListener("click", methods.handleSubmit)
    reset.addEventListener("click", methods.handleReset)
    config.addEventListener("click", methods.handleConfig)
    hours.addEventListener("keyup", methods.handleTimeInsert)
    closeModal.addEventListener("click", methods.handleCloseModal)
  },

  initCountdown: () => {
    const { reset } = elements
    const { date, hours } = database.countdown

    const dataCountdown = {
      eventDate: date,
      eventHour: hours,
      containerCounter: "#container-counter",
      containerRegisterClosed: "#container-register-closed",
      dayElement: "#days",
      hourElement: "#hours",
      minuteElement: "#minutes",
      secondElement: "#seconds",
    }

    const limitedInterval = setInterval(() => {
      methods.countdown(dataCountdown, limitedInterval)
    }, 1000)

    reset.addEventListener("click", () => {
      methods.resetInterval(limitedInterval)
    })
  },

  countdown: (props, limitedInterval) => {
    const containerRegisterClosed = methods.getElement(props.containerRegisterClosed)
    containerRegisterClosed.classList.add("hide")

    const formattedEventDate = new Date(`${props.eventDate} ${props.eventHour}`).getTime()
    const formattedCurrentDate = new Date().getTime()

    const gap = formattedEventDate - formattedCurrentDate

    if (gap < 1000) {
      methods.resetInterval(limitedInterval)

      const containerRegisterClosed = methods.getElement(props.containerRegisterClosed)
      containerRegisterClosed.classList.remove("hide")

      const containerCounter = methods.getElement(props.containerCounter)
      containerCounter.classList.add("hide")

      return
    }

    const second = 1000
    const minute = second * 60
    const hour = minute * 60
    const day = hour * 24

    const textDays = Math.floor(gap / day)
    const textHours = Math.floor((gap % day) / hour)
    const textMinutes = Math.floor((gap % hour) / minute)
    const textSeconds = Math.floor((gap % minute) / second)

    const propsCountdown = {
      ...props,
      textDays,
      textHours,
      textMinutes,
      textSeconds,
    }

    methods.printCountdown(propsCountdown)
  },

  printCountdown: (props) => {
    const daysElement = methods.getElement(props.dayElement)
    const hoursElement = methods.getElement(props.hourElement)
    const minutesElement = methods.getElement(props.minuteElement)
    const secondsElement = methods.getElement(props.secondElement)

    daysElement.innerText = props.textDays < 10 ? `0${props.textDays}` : `${props.textDays}`
    hoursElement.innerText = props.textHours < 10 ? `0${props.textHours}` : `${props.textHours}`
    minutesElement.innerText = props.textMinutes < 10 ? `0${props.textMinutes}` : `${props.textMinutes}`
    secondsElement.innerText = props.textSeconds < 10 ? `0${props.textSeconds}` : props.textSeconds

    const containerCounter = methods.getElement(props.containerCounter)
    containerCounter.classList.remove("hide")
  },

  handleSubmit: (e) => {
    e.preventDefault()
    const { submit, reset, error, date, ["form-hours"]: hours, modal } = elements

    if (!date.value || !hours.value) {
      error.classList.remove("hide")
      setTimeout(() => {
        error.classList.add("hide")
      }, 1500)

      return
    }

    const isValidHours = methods.validHours(hours.value)

    if (!isValidHours) {
      error.classList.remove("hide")
      setTimeout(() => {
        error.classList.add("hide")
      }, 1500)

      return
    }

    submit.setAttribute("disabled", "disabled")
    reset.removeAttribute("disabled")
    modal.classList.add("hide")

    database.countdown = { date: date.value, hours: hours.value }

    localStorage.setItem("countdown-discover", JSON.stringify(database.countdown))

    methods.initCountdown()
  },

  handleReset: (e) => {
    e.preventDefault()
    const { submit, reset } = elements

    localStorage.removeItem("countdown-discover")
    database.countdown = {}

    reset.setAttribute("disabled", "disabled")
    submit.removeAttribute("disabled")

    document.location.reload();
  },

  handleConfig: () => {
    const { modal } = elements
    modal.classList.remove("hide")
  },

  handleCloseModal: (e) => {
    e.preventDefault()
    const { modal } = elements
    modal.classList.add("hide")
  },

  handleTimeInsert: (e) => {
    e.target.value = e.target.value.replace(/\D/g, "").replace(/\B(?=(\d{2})+(?!\d))/g, ":")
  },

  resetInterval: (interval) => {
    clearInterval(interval)
  },

  validHours: (string) => {
    const regex = /(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)/

    const isValid = string.match(regex)

    return isValid
  },
}
