// index.ts
document.addEventListener("DOMContentLoaded", () => {
  $TITLE = document.getElementById("cal-title");
  $CAL = document.getElementById("cal");
  init();
});
var init = () => {
  const { RC } = window;
  RC.onLoad(async () => {
    console.log("on load done");
    const now = new Date;
    const next = new Date;
    next.setDate(next.getDate() + 1);
    setTitle(now);
    const [todayYear, todayMonth, todayDay] = [
      now.getFullYear(),
      ("0" + (now.getMonth() + 1)).slice(-2),
      ("0" + now.getDate()).slice(-2)
    ];
    const [tomorrowYear, tomorrowMonth, tomorrowDay] = [
      next.getFullYear(),
      ("0" + (next.getMonth() + 1)).slice(-2),
      ("0" + next.getDate()).slice(-2)
    ];
    const today = `${todayYear}${todayMonth}${todayDay}`;
    const tomorrow = `${tomorrowYear}${tomorrowMonth}${tomorrowDay}`;
    const { events } = await RC.getEvents({
      start: today,
      end: tomorrow
    });
    const sorted = sortEvents(events);
    sorted.map(appendEvent);
  });
};
var setTitle = (date) => {
  if (!$TITLE)
    return;
  $TITLE.innerText = `Recurse Calendar - ${date.toDateString()}`;
};
var appendEvent = (e) => {
  const event = document.createElement("div");
  const start = document.createElement("div");
  const title = document.createElement("div");
  event.classList.add("cal-event");
  start.classList.add("cal-event-time");
  title.classList.add("cal-event-title");
  start.innerText = formatTime(e);
  title.innerText = e.summary;
  event.appendChild(start);
  event.appendChild(title);
  $CAL.appendChild(event);
};
var formatTime = (e) => {
  const start = new Date(e.start);
  const end = new Date(e.end);
  const startHour = start.getHours() + 1;
  const endHour = end.getHours() + 1;
  const startMinutes = start.getMinutes();
  const endMinutes = end.getMinutes();
  const startMinutesStr = startMinutes ? `:${startMinutes}` : "";
  const endMinutesStr = endMinutes ? `:${endMinutes}` : "";
  if (startHour >= 12) {
    return `${startHour}${startMinutesStr} - ${endHour}${endMinutes}pm`;
  } else if (endHour >= 12) {
    return `${startHour}${startMinutesStr}am - ${endHour}${endMinutesStr}pm`;
  } else {
    return `${startHour}${startMinutesStr} - ${endHour}${endMinutesStr}am`;
  }
};
var sortEvents = (unsortedEvents) => {
  const sortedEvents = unsortedEvents.sort((left, right) => {
    let ldt = Date.parse(left.start);
    let rdt = Date.parse(right.start);
    if (ldt < rdt)
      return -1;
    if (ldt == rdt)
      return 0;
    if (ldt > rdt)
      return 1;
    return 0;
  });
  return sortedEvents;
};
