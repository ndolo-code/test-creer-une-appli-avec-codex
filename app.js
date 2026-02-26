const phaseLabel = document.getElementById('phaseLabel');
const timerDisplay = document.getElementById('timerDisplay');
const startPauseBtn = document.getElementById('startPauseBtn');
const resetBtn = document.getElementById('resetBtn');
const skipBtn = document.getElementById('skipBtn');
const completedCountElement = document.getElementById('completedCount');
const currentPhaseElement = document.getElementById('currentPhase');

const workMinutesInput = document.getElementById('workMinutes');
const breakMinutesInput = document.getElementById('breakMinutes');
const longBreakMinutesInput = document.getElementById('longBreakMinutes');
const cyclesBeforeLongBreakInput = document.getElementById('cyclesBeforeLongBreak');

let timerId = null;
let isRunning = false;
let isWorkPhase = true;
let completedWorkSessions = 0;
let secondsLeft = 25 * 60;

function getSettings() {
  return {
    work: Number(workMinutesInput.value) * 60,
    shortBreak: Number(breakMinutesInput.value) * 60,
    longBreak: Number(longBreakMinutesInput.value) * 60,
    cyclesBeforeLongBreak: Number(cyclesBeforeLongBreakInput.value),
  };
}

function formatSeconds(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function render() {
  timerDisplay.textContent = formatSeconds(secondsLeft);
  completedCountElement.textContent = String(completedWorkSessions);
  const phaseText = isWorkPhase ? 'Travail' : 'Pause';
  currentPhaseElement.textContent = phaseText;
  phaseLabel.textContent = isWorkPhase ? 'Session de travail' : 'Temps de pause';
  startPauseBtn.textContent = isRunning ? 'Pause' : 'Démarrer';
  document.title = `${formatSeconds(secondsLeft)} • ${phaseText}`;
}

function switchPhase() {
  const settings = getSettings();

  if (isWorkPhase) {
    completedWorkSessions += 1;
    const needsLongBreak = completedWorkSessions % settings.cyclesBeforeLongBreak === 0;
    secondsLeft = needsLongBreak ? settings.longBreak : settings.shortBreak;
  } else {
    secondsLeft = settings.work;
  }

  isWorkPhase = !isWorkPhase;
  render();
}

function tick() {
  if (secondsLeft > 0) {
    secondsLeft -= 1;
    render();
    return;
  }

  switchPhase();
}

function toggleTimer() {
  if (isRunning) {
    clearInterval(timerId);
    timerId = null;
    isRunning = false;
    render();
    return;
  }

  isRunning = true;
  timerId = setInterval(tick, 1000);
  render();
}

function resetTimer() {
  const settings = getSettings();
  clearInterval(timerId);
  timerId = null;
  isRunning = false;
  isWorkPhase = true;
  secondsLeft = settings.work;
  render();
}

startPauseBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);
skipBtn.addEventListener('click', switchPhase);

[workMinutesInput, breakMinutesInput, longBreakMinutesInput, cyclesBeforeLongBreakInput].forEach((input) => {
  input.addEventListener('change', () => {
    if (!isRunning && isWorkPhase) {
      secondsLeft = getSettings().work;
      render();
    }
  });
});

render();
