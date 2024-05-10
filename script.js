let nav = 0;
let clicked = null;
let lastSelectedDay = null;
let todayElement;
let currMonth;
let dataBase = localStorage.getItem('data')
  ? JSON.parse(localStorage.getItem('data'))
  : [];

const container = document.querySelector('.container');
const calendar = document.querySelector('.calendar');
const targetTable = document.querySelector('.target-table');
const activatedDay = document.querySelector('.activated-day');
const timeCurrentPannel = document.querySelector('.time-current');
const timeLeftPannel = document.querySelector('.time-left');

const actionCells = {
  learnTotalCell: document.getElementById('learn-total'),
  learnPointTimerCell: document.getElementById('learn-point-timer'),
  learnPointsCell: document.getElementById('learn-points'),
  learnPointsTargetCell: document.getElementById('learn-points-target'),
  learnPointsLeftCell: document.getElementById('learn-points-left'),
  learnPercentCell: document.getElementById('learn-percent'),
  workTotalCell: document.getElementById('work-total'),
  workPointTimerCell: document.getElementById('work-point-timer'),
  workPointsCell: document.getElementById('work-points'),
  workPointsTargetCell: document.getElementById('work-points-target'),
  workPointsLeftCell: document.getElementById('work-points-left'),
  workPercentCell: document.getElementById('work-percent'),
  physicalTotalCell: document.getElementById('physical-total'),
  physicalPointTimerCell: document.getElementById('physical-point-timer'),
  physicalPointsCell: document.getElementById('physical-points'),
  physicalPointsTargetCell: document.getElementById('physical-points-target'),
  physicalPointsLeftCell: document.getElementById('physical-points-left'),
  physicalPercentCell: document.getElementById('physical-percent'),
  learnTimeLine: document.querySelector('.learn-time-line'),
  workTimeLine: document.querySelector('.work-time-line'),
  physicalTimeLine: document.querySelector('.physical-time-line'),
};

const pointTimeLine = document.querySelector('.point-time-line');
const pointTimerCell = document.getElementById('point-timer');
const pointTimerLogoCell = document.getElementById('point-timer-logo');
const pointTimerLogoCell2 = document.getElementById('point-timer-logo-2');
const targetTimeLine = document.querySelector('.target-time-line');
const targetTimerCell = document.getElementById('target-timer-cell');
const usefulTimeLine = document.querySelector('.useful-time-line');
const alltargetsTimerCell = document.getElementById('all-targets-timer-cell');

const learnStartButton = document.getElementById('learn-start-button');
const learnStopButton = document.getElementById('learn-stop-button');
const workStartButton = document.getElementById('work-start-button');
const workStopButton = document.getElementById('work-stop-button');
const physicalStartButton = document.getElementById('physical-start-button');
const physicalStopButton = document.getElementById('physical-stop-button');
const backButton = document.getElementById('back-button');
const nextButton = document.getElementById('next-button');
const dayTitle = document.getElementById('day-title');

let todayInfo = {
  date: 0,
  dayTimer: 86400,
  learnPointsTimer: 600,
  workPointsTimer: 600,
  physicalPointsTimer: 600,
  learnPoints: 0,
  workPoints: 0,
  physicalPoints: 0,
  learnPointsTarget: 20,
  workPointsTarget: 20,
  physicalPointsTarget: 5,
  learnTime: 0,
  workTime: 0,
  physicalTime: 0,
};

let clearDayInfo = {
  date: 0,
  dayTimer: 0,
  learnPointsTimer: 0,
  workPointsTimer: 0,
  physicalPointsTimer: 0,
  learnPoints: 0,
  workPoints: 0,
  physicalPoints: 0,
  learnPointsTarget: 0.1,
  workPointsTarget: 0.1,
  physicalPointsTarget: 0.1,
  learnTime: 0,
  workTime: 0,
  physicalTime: 0,
};

if (!dataBase.find((el) => el.date === clearDayInfo.date)) {
  dataBase.push(clearDayInfo);
}

let timer;

const weekdays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const managePointCard = function (daySquare, date, act) {
  const pointNameLetter = act.charAt(0).toUpperCase();
  const x = document.getElementById(`${pointNameLetter}-${date}`);
  const activityForDay = dataBase.filter((e) => e.date === date);
  if (!x) {
    const actEl = document.createElement('div');
    actEl.classList.add('activity');
    actEl.id = `${pointNameLetter}-${date}`;
    actEl.innerText = `${pointNameLetter}: ${
      activityForDay[0][`${act}Points`]
    }`;
    daySquare.appendChild(actEl);
    actEl.classList.add(act);
  } else {
    x.innerText = `${pointNameLetter}: ${activityForDay[0][`${act}Points`]}`;
  }
};

const load = function () {
  const dt = new Date();

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const day = dt.getDate();
  const month = dt.getMonth();
  const monthName = dt.toLocaleDateString('en-uk', { month: 'long' });
  selectedMonth = monthName;
  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dateString = firstDayOfMonth.toLocaleDateString('en-uk', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

  document.querySelector('.month-title').innerText = ` ${monthName} ${year}`;

  calendar.innerHTML = '';

  // Create days of the month
  for (let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement('div');
    daySquare.classList.add('day');

    const dayString = `${month + 1}/${i - paddingDays}/${year}`;

    daySquare.dataset.day = dayString;

    if (i > paddingDays) {
      const dayNumber = document.createElement('div');
      dayNumber.classList.add('day-number');
      daySquare.appendChild(dayNumber);
      dayNumber.innerText = i - paddingDays;
      const activityForDay = dataBase.filter((e) => e.date === dayString);

      if (i - paddingDays === day && nav === 0) {
        daySquare.id = 'current-day';
        todayInfo.date = dayString;
        dayTitle.innerText = `${monthName} ${day}`;
        todayElement = daySquare;
        currMonth = monthName;
      }
      if (activityForDay.length > 0) {
        daySquare.classList.add('withActivity');
        if (activityForDay[0].learnPoints) {
          managePointCard(daySquare, dayString, 'learn');
        }
        if (activityForDay[0].workPoints) {
          managePointCard(daySquare, dayString, 'work');
        }
        if (activityForDay[0].physicalPoints) {
          managePointCard(daySquare, dayString, 'physical');
        }
      }
    } else {
      daySquare.classList.add('padding');
    }
    calendar.appendChild(daySquare);
  }
  if (!dataBase.find((el) => el.date === todayInfo.date)) {
    dataBase.unshift(todayInfo);
  }
};

const timeFormater = function (timeInSeconds) {
  // prettier-ignore
  const timeForDisplay = `${String(Math.trunc(timeInSeconds / 60)).padStart(    
    2, 0)}:${String(timeInSeconds % 60).padStart(2, 0)}`;
  return timeForDisplay;
};

const refreshDisplay = function (act, dayInd = 0) {
  actionCells[`${act}TotalCell`].innerText = timeFormater(
    dataBase[dayInd][`${act}Time`]
  );
  actionCells[`${act}PointTimerCell`].innerText = timeFormater(
    dataBase[dayInd][`${act}PointsTimer`]
  );
  actionCells[`${act}PointsCell`].innerText = dataBase[dayInd][`${act}Points`];
  actionCells[`${act}PointsTargetCell`].innerText = Math.trunc(
    dataBase[dayInd][`${act}PointsTarget`]
  );
  actionCells[`${act}PointsLeftCell`].innerText = Math.trunc(
    dataBase[dayInd][`${act}PointsTarget`] - dataBase[dayInd][`${act}Points`]
  );
  actionCells[`${act}PercentCell`].innerText = Math.trunc(
    (dataBase[dayInd][`${act}Points`] /
      dataBase[dayInd][`${act}PointsTarget`]) *
      100
  );
  actionCells[`${act}TimeLine`].style.flex =
    dataBase[dayInd][`${act}PointsTarget`] * 600 -
    dataBase[dayInd][`${act}Time`];
};

const refreshPointLine = function (act) {
  pointTimeLine.style.flex = 1 - (600 - dataBase[0][`${act}PointsTimer`]) / 600;
  pointTimerLogoCell.innerText = act.charAt(0).toUpperCase();
  pointTimerLogoCell2.innerText = act.charAt(0).toUpperCase();
  pointTimerCell.innerText = timeFormater(dataBase[0][`${act}PointsTimer`]);
  targetTimeLine.style.flex =
    (dataBase[0][`${act}PointsTarget`] * 600 - dataBase[0][`${act}Time`]) /
    (dataBase[0][`${act}PointsTarget`] * 600);
  targetTimerCell.innerText = timeFormater(
    (dataBase[0][`${act}PointsTarget`] - 1) * 600 -
      dataBase[0][`${act}Points`] * 600 +
      dataBase[0][`${act}PointsTimer`]
  );
  targetTimeLine.classList.remove('learn');
  targetTimeLine.classList.remove('work');
  targetTimeLine.classList.remove('physical');
  targetTimeLine.classList.add(act);
  usefulTimeLine.style.flex =
    dataBase[0].learnTime + dataBase[0].workTime + dataBase[0].physicalTime;
  alltargetsTimerCell.innerText = timeFormater(
    dataBase[0].learnPointsTarget * 600 +
      dataBase[0].workPointsTarget * 600 +
      dataBase[0].physicalPointsTarget * 600 -
      dataBase[0].learnTime -
      dataBase[0].workTime -
      dataBase[0].physicalTime
  );
};

const refreshDisplayAll = function (dayInd = 0) {
  refreshDisplay('learn', dayInd);
  refreshDisplay('work', dayInd);
  refreshDisplay('physical', dayInd);
};

const refreshPage = function () {
  load();
  refreshDisplayAll();
  refreshPointLine('learn');
};

refreshPage();

const hideButtons = function (type) {
  if (type === 'start') {
    learnStartButton.classList.add('hidden');
    workStartButton.classList.add('hidden');
    physicalStartButton.classList.add('hidden');
  }
  if (type === 'stop') {
    learnStopButton.classList.add('hidden');
    workStopButton.classList.add('hidden');
    physicalStopButton.classList.add('hidden');
  }
};

const setTime = function () {
  const time = new Date();
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  dataBase[0].dayTimer = 86400 - (hours * 60 + minutes) * 60 - seconds;

  if (dataBase[0].dayTimer < 0) {
    clearInterval(timer);
    hideButtons('stop');
    learnStartButton.classList.remove('hidden');
    workStartButton.classList.remove('hidden');
    physicalStartButton.classList.remove('hidden');
    localStorage.setItem('data', JSON.stringify(dataBase));
    refreshPage();
  }

  timeCurrentPannel.innerText = `${hours < 10 ? `0${hours}` : hours}:${
    minutes < 10 ? `0${minutes}` : minutes
  }:${seconds < 10 ? `0${seconds}` : seconds}`;

  timeLeftPannel.innerText = `${23 - hours} h ${60 - minutes} min`;
};

setInterval(setTime, 1000);

const timeRecorder = function (act) {
  const currDayElement = document.getElementById('current-day');
  const currDate = currDayElement.dataset.day;
  const tick = function () {
    dataBase[0][`${act}Time`] += 1;
    dataBase[0][`${act}PointsTimer`] -= 1;

    refreshPointLine(act);
    refreshDisplay(act);

    if (dataBase[0][`${act}PointsTimer`] === 0) {
      dataBase[0][`${act}PointsTimer`] = 600;
      dataBase[0][`${act}Points`] += 1;
      localStorage.setItem('data', JSON.stringify(dataBase));
      managePointCard(currDayElement, currDate, act);
    }
  };
  tick();
  timer = setInterval(tick, 1000);
  return timer;
};

const selectDay = function (dayElement = 0) {
  let xDate, dayInd;
  if (dayElement) {
    if (lastSelectedDay) lastSelectedDay.classList.remove('selected');
    xDate = dayElement.dataset.day;
    dayInd = dataBase.findIndex((e) => e.date === xDate);
    dayTitle.innerText = `${selectedMonth} ${xDate.split('/')[1]}`;
  } else {
    dayInd = -1;
    dayTitle.innerText = `${selectedMonth}`;
  }
  if (dayInd >= 0) {
    if (dayElement.id === 'current-day') {
      refreshDisplayAll();
      learnStartButton.classList.remove('hidden');
      workStartButton.classList.remove('hidden');
      physicalStartButton.classList.remove('hidden');
      targetTable.classList.remove('hidden');
    } else {
      clearInterval(timer);
      dayElement.classList.add('selected');
      refreshDisplayAll(dayInd);
      hideButtons('start');
      hideButtons('stop');
      targetTable.classList.add('hidden');
      lastSelectedDay = dayElement;
    }
  } else {
    console.log('!!!');
    const clearDayInd = dataBase.findIndex((e) => e.date === 0);
    clearInterval(timer);
    if (dayElement) dayElement.classList.add('selected');
    refreshDisplayAll(clearDayInd);
    hideButtons('start');
    hideButtons('stop');
    targetTable.classList.add('hidden');
    lastSelectedDay = dayElement;
  }
};

calendar.addEventListener('click', (e) => {
  e.preventDefault();
  let clickedDay = null;
  if (e.target.classList.contains('activity'))
    clickedDay = e.target.closest('.day');

  if (
    e.target.classList.contains('day') &&
    !e.target.classList.contains('padding')
  )
    clickedDay = e.target;

  if (clickedDay) selectDay(clickedDay);
});

const canWakeLock = () => 'wakeLock' in navigator;
let wakelock;
async function lockWakeState() {
  if (!canWakeLock()) return;
  try {
    wakelock = await navigator.wakeLock.request();
    wakelock.addEventListener('release', () => {
      console.log('Screen Wake State Locked:', !wakelock.released);
    });
    console.log('Screen Wake State Locked:', !wakelock.released);
  } catch (e) {
    console.error('Failed to lock wake state with reason:', e.message);
  }
}

lockWakeState();

const initButtons = function () {
  learnStartButton.addEventListener('click', (e) => {
    console.log(e);
    e.preventDefault();
    clearInterval(timer);
    timer = timeRecorder('learn');
    learnStartButton.classList.add('hidden');
    learnStopButton.classList.remove('hidden');
    if (workStartButton.classList.contains('hidden')) {
      workStartButton.classList.remove('hidden');
      workStopButton.classList.add('hidden');
    }
    if (physicalStartButton.classList.contains('hidden')) {
      physicalStartButton.classList.remove('hidden');
      physicalStopButton.classList.add('hidden');
    }
  });

  learnStopButton.addEventListener('click', (e) => {
    e.preventDefault();
    clearInterval(timer);
    localStorage.setItem('data', JSON.stringify(dataBase));
    learnStartButton.classList.remove('hidden');
    learnStopButton.classList.add('hidden');
  });

  workStartButton.addEventListener('click', (e) => {
    e.preventDefault();
    clearInterval(timer);
    timer = timeRecorder('work');
    workStartButton.classList.add('hidden');
    workStopButton.classList.remove('hidden');
    if (learnStartButton.classList.contains('hidden')) {
      learnStartButton.classList.remove('hidden');
      learnStopButton.classList.add('hidden');
    }
    if (physicalStartButton.classList.contains('hidden')) {
      physicalStartButton.classList.remove('hidden');
      physicalStopButton.classList.add('hidden');
    }
  });

  workStopButton.addEventListener('click', (e) => {
    e.preventDefault();
    clearInterval(timer);
    localStorage.setItem('data', JSON.stringify(dataBase));
    workStartButton.classList.remove('hidden');
    workStopButton.classList.add('hidden');
  });

  physicalStartButton.addEventListener('click', (e) => {
    e.preventDefault();
    clearInterval(timer);
    timer = timeRecorder('physical');
    physicalStartButton.classList.add('hidden');
    physicalStopButton.classList.remove('hidden');
    if (workStartButton.classList.contains('hidden')) {
      workStartButton.classList.remove('hidden');
      workStopButton.classList.add('hidden');
    }
    if (learnStartButton.classList.contains('hidden')) {
      learnStartButton.classList.remove('hidden');
      learnStopButton.classList.add('hidden');
    }
  });

  physicalStopButton.addEventListener('click', (e) => {
    e.preventDefault();
    clearInterval(timer);
    localStorage.setItem('data', JSON.stringify(dataBase));
    physicalStartButton.classList.remove('hidden');
    physicalStopButton.classList.add('hidden');
  });

  nextButton.addEventListener('click', () => {
    nav++;
    load();
    selectDay();
  });

  backButton.addEventListener('click', () => {
    nav--;
    load();
    selectDay();
  });
};

initButtons();

/* const clearLS = function () {
  localStorage.setItem('data', JSON.stringify([]));
};

clearLS(); */

/* dataBase.splice();
localStorage.setItem('data', JSON.stringify([dataBase])); */
