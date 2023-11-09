/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

declare global {
  interface Window {
    RC: any;
  }
}

type Event = {
  summary: string;
  start: string;
  end: string;
  // TODO: Change this to be a number
  duration_seconds: string;
  duration_string: string;
  description: string;
  location: string;
};

document.addEventListener("DOMContentLoaded", () => {
  $TITLE = document.getElementById("cal-title");
  $CAL = document.getElementById("cal");
  init();
});

// Get the calendar events from the RCTV API
const init = () => {
  const { RC } = window;
  RC.onLoad(async () => {
    console.log("on load done");
    const now = new Date();
    const next = new Date();
    next.setDate(next.getDate() + 1);
    setTitle(now);
    const [todayYear, todayMonth, todayDay] = [
      now.getFullYear(),
      ("0" + (now.getMonth() + 1)).slice(-2),
      ("0" + now.getDate()).slice(-2),
    ];
    const [tomorrowYear, tomorrowMonth, tomorrowDay] = [
      next.getFullYear(),
      ("0" + (next.getMonth() + 1)).slice(-2),
      ("0" + next.getDate()).slice(-2),
    ];
    const today = `${todayYear}${todayMonth}${todayDay}`;
    const tomorrow = `${tomorrowYear}${tomorrowMonth}${tomorrowDay}`;

    const { events } = await RC.getEvents({
      start: today,
      end: tomorrow,
    });

    const sorted = sortEvents(events);
    sorted.map(appendEvent);
  });
};

const setTitle = (date: Date) => {
  if (!$TITLE) return;
  $TITLE.innerText = `Recurse Calendar - ${date.toDateString()}`;
};

//
const appendEvent = (e: Event) => {
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

const formatTime = (e: Event) => {
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
  } // Start time is in the AM but end time in the PstartM
  else if (endHour >= 12) {
    return `${startHour}${startMinutesStr}am - ${endHour}${endMinutesStr}pm`;
  } // Both are in the AM
  else {
    return `${startHour}${startMinutesStr} - ${endHour}${endMinutesStr}am`;
  }
};

const sortEvents = (unsortedEvents: Array<Event>) => {
  const sortedEvents = unsortedEvents.sort((left, right) => {
    let ldt = Date.parse(left.start);
    let rdt = Date.parse(right.start);
    if (ldt < rdt) return -1;
    if (ldt == rdt) return 0;
    if (ldt > rdt) return 1;
    return 0;
  });

  return sortedEvents;
  // sort the events by date
  // maybe do the whole conflicting events things
  // based on the start time (round down), determine the index for the correct
  // div to insert
};

// const makeCalendarSkeleton = () => {
//   if (!$CAL) return;

//   const parent: HTMLDivElement = document.createElement("div");
//   parent.classList.add("cal-column");

//   // There should be 48 (30 minute) slots in a day
//   for (let i = 0; i < 48; i++) {
//     console.log("hi");
//     const slot = makeSlot();
//     parent.appendChild(slot);
//   }

//   document.body.appendChild(parent);
// };

// const makeSlot = (): HTMLDivElement => {
//   const slot = document.createElement("div");
//   const inner = document.createElement("div");
//   slot.classList.add("cal-slot");
//   inner.classList.add("cal-inner");

//   slot.appendChild(inner);

//   return slot;
// };

// const makeContent = (e: Event) => {
//   const event = document.createElement("div");
//   const content = document.createElement("div");
//   const time = document.createElement("div");
//   const title = document.createElement("div");

//   event.classList.add("cal-event");
//   content.classList.add("cal-content");
//   time.classList.add("cal-content-time");
//   title.classList.add("cal-content-title");

//   content.appendChild(time);
//   content.appendChild(title);

//   event.appendChild(content);

//   return event;
// };
