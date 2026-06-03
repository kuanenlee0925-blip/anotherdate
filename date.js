const state = {
  answer: "",
  day: "",
  time: "",
  idea: "",
};

const steps = [...document.querySelectorAll("[data-step]")];
const dots = [...document.querySelectorAll("[data-dot]")];
const noNudge = document.querySelector("#noNudge");
const yesButton = document.querySelector("#yesButton");
const noButton = document.querySelector("#noButton");
const dateTime = document.querySelector("#dateTime");
const timeNext = document.querySelector("#timeNext");
const dateIdea = document.querySelector("#dateIdea");
const customIdea = document.querySelector("#customIdea");
const customIdeaLabel = document.querySelector(".custom-idea");
const ideaNext = document.querySelector("#ideaNext");
const rsvpSummary = document.querySelector("#rsvpSummary");
const sendSummary = document.querySelector("#sendSummary");
const confirmButton = document.querySelector("#confirmButton");
const saveNote = document.querySelector("#saveNote");

function showStep(stepName) {
  steps.forEach((step) => {
    step.classList.toggle("active", step.dataset.step === stepName);
  });

  dots.forEach((dot) => {
    dot.classList.toggle("active", dot.dataset.dot === stepName);
  });
}

function formatTime(value) {
  if (!value) return "";
  const [hour, minute] = value.split(":").map(Number);
  const date = new Date();
  date.setHours(hour, minute);
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function selectedIdea() {
  if (dateIdea.value === "Better idea") {
    return customIdea.value.trim() || "Better idea";
  }

  return dateIdea.value;
}

function renderRsvp() {
  state.time = dateTime.value;
  state.idea = selectedIdea();

  localStorage.setItem("another-date-rsvp", JSON.stringify(state));

  const summaryMarkup = [
    ["Answer", state.answer],
    ["Day", state.day],
    ["Time", formatTime(state.time)],
    ["Date idea", state.idea],
  ]
    .map(
      ([label, value]) => `
        <div class="summary-row">
          <span>${label}</span>
          <strong>${value}</strong>
        </div>
      `
    )
    .join("");

  rsvpSummary.innerHTML = summaryMarkup;
  sendSummary.innerHTML = summaryMarkup;
}

function requireChoice(value, element) {
  if (value) return true;
  element.focus();
  return false;
}

yesButton.addEventListener("click", () => {
  state.answer = "Yes";
  showStep("day");
});

noButton.addEventListener("click", () => {
  noNudge.hidden = false;
  yesButton.focus();
});

document.querySelectorAll("[data-day]").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll("[data-day]")
      .forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    state.day = button.dataset.day;
    showStep("time");
  });
});

document.querySelectorAll("[data-time]").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll("[data-time]")
      .forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    dateTime.value = button.dataset.time;
  });
});

dateTime.addEventListener("input", () => {
  document
    .querySelectorAll("[data-time]")
    .forEach((item) => item.classList.toggle("selected", item.dataset.time === dateTime.value));
});

timeNext.addEventListener("click", () => {
  if (!requireChoice(dateTime.value, dateTime)) return;
  showStep("idea");
});

dateIdea.addEventListener("change", () => {
  const showCustom = dateIdea.value === "Better idea";
  customIdea.hidden = !showCustom;
  customIdeaLabel.hidden = !showCustom;
  if (showCustom) customIdea.focus();
});

ideaNext.addEventListener("click", () => {
  if (!requireChoice(dateIdea.value, dateIdea)) return;
  if (dateIdea.value === "Better idea" && !requireChoice(customIdea.value.trim(), customIdea)) {
    return;
  }

  renderRsvp();
  showStep("rsvp");
});

confirmButton.addEventListener("click", () => {
  saveNote.textContent = "";
  showStep("send");
});
