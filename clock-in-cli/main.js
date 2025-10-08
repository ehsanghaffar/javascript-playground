#!/usr/bin/env node

// Clock In Cli
const readline = require("readline");

// Clear screen
readline.cursorTo(process.stdout, 0, 0);
readline.clearScreenDown(process.stdout);

// Choose 12h or 24h format
const is12h = process.argv.includes("--12h");

function getTime() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  let ampm = "";
  if (is12h) {
    ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
  }

  return `${hours.toString().padStart(2, "0")}:${minutes}:${seconds}${ampm ? " " + ampm : ""}`;
}

function renderClock() {
  readline.cursorTo(process.stdout, 0, 0);
  process.stdout.write("🕒  " + getTime() + "\n");
}


renderClock();
setInterval(renderClock, 1000);
