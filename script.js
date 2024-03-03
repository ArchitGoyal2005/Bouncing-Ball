"use strict";

//blocks part

const container = document.querySelector(".blocks");
const containerPos = container.getBoundingClientRect();

const blocks = [];
const nCol = Math.ceil(containerPos.width / 100);
const nRow = Math.ceil(containerPos.height / 50);
let blTyp;

for (let i = 0; i < nRow; i++) {
  blocks.push([]);
}
blocks.forEach(function (el) {
  for (let i = 0; i < nCol; i++) {
    blTyp = Math.floor(Math.random() * 4);
    el.push(blTyp);
    container.insertAdjacentHTML(
      "beforeend",
      `
    <div class="block block--${blTyp}" data-touch="${blTyp}"></div>
    `
    );
  }
});

container.style.gridTemplateColumns = `repeat(${nCol},1fr)`;
container.style.gridTemplateRows = `repeat(${nRow},1fr)`;

const bs = document.querySelectorAll(".block");

//variables
const body = document.querySelector(".body");
const ball = document.querySelector(".ball");
const newGame = document.querySelector(".btn--new");
const newGameContainer = document.querySelector(".newgame");
const bar = document.querySelector(".bar");

let xball, yball, angle, sxball, syball, xBar, yBar, ballPos;
let barPos = bar.getBoundingClientRect();
const [barInX, barInY] = [barPos.left, barPos.top];

//functions

//initialising func
function init() {
  //ball
  xball = 0;
  yball = 0;
  sxball = 8;
  syball = 8;
  ballPos = ball.getBoundingClientRect();

  //bar
  barPos = bar.getBoundingClientRect();
  xBar = barInX;
  yBar = barInY;

  //angle
  angle = Math.floor(Math.random() * 120 + 60);
  const radian = (angle) => ((angle % 360) * Math.PI) / 180;
  angle = radian(angle);

  bar.style.top = `${yBar}px`;
  bar.style.left = `${xBar}px`;
}

init();

//speed increase
const sInc = (s) => {
  if (Math.abs(s) <= 13) {
    if (s > 0) return s + 1;
    return s - 1;
  }
  return s;
};

//animate ball
const animate = function () {
  xball += sxball * Math.cos(angle);
  yball += syball * Math.sin(angle);
  ball.style.top = `${yball}px`;
  ball.style.left = `${xball}px`;

  reflects();

  if (ballPos.bottom + 12 >= window.innerHeight) {
    ends();

    return;
  }

  const a = [...bs];

  if (touches(ball, container)) {
    const el = a.find((el) => touches(ball, el));
    const elclass = el.dataset.touch;
    if (elclass > 0) {
      ballPos = ball.getBoundingClientRect();
      let elPos = el.getBoundingClientRect();
      el.dataset.touch--;
      el.classList.remove(`block--${elclass}`);
      el.classList.add(`block--${elclass - 1}`);
      if (ballPos.bottom >= elPos.top || ballPos.top <= elPos.bottom) refInY();
      else refInX();
    }

    // return;
  }

  requestAnimationFrame(animate);
};
let verticalT, horizT;
const touches = function (ball, el) {
  const bPos = ball.getBoundingClientRect();
  const elPos = el.getBoundingClientRect();
  verticalT = bPos.bottom > elPos.top && bPos.top < elPos.bottom;
  horizT = bPos.left < elPos.right && bPos.right > elPos.left;

  // if (vertical) refInY(syball);
  // if (horiz) refInX(sxball);
  return verticalT && horizT;
};

const refInY = function () {
  syball = sInc(syball);
  syball *= -1;
};

const refInX = function () {
  sxball = sInc(sxball);
  sxball *= -1;
};

//ball reflects
const reflects = function () {
  ballPos = ball.getBoundingClientRect();
  barPos = bar.getBoundingClientRect();

  if (ballPos.right - 12.5 <= 0) {
    refInX();
  } else if (ballPos.right + 12.5 >= window.innerWidth) {
    refInX();
  } else if (ballPos.bottom - 12.5 <= 0) {
    refInY();
  } else if (touches(ball, bar)) {
    if (ballPos.right + 12.5 === bar.left || ballPos.left - 12.5 === bar.right)
      refInX();
    else refInY();
  }
};

//game ends
const ends = function () {
  init();
  newGameContainer.classList.remove("hidden");
  ball.classList.add("hidden");
  container.style.visibility = "hidden";
};

//event listeners

//new game buttom
newGame.addEventListener("click", function () {
  moveBar();
  newGameContainer.classList.add("hidden");
  ball.classList.remove("hidden");
  container.style.visibility = "visible";
  animate();
});

//moving bar with key press
const moveBar = function () {
  const barchange = () => {
    bar.style.left = `${xBar}px`;
    barPos = bar.getBoundingClientRect();
  };

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") {
      if (barPos.right <= window.innerWidth - 14) {
        xBar += 14;
        barchange();
      }
    }
    if (e.key === "ArrowLeft") {
      if (barPos.left >= 14) {
        xBar -= 14;
        barchange();
      }
    }
  });
};

//bar maybe required will see after testing

// if (
//   (ballPos.right + 12.5 >= barPos.left + 5 &&
//     ballPos.right + 12.5 <= barPos.left + 15) ||
//   (ballPos.left + 12.5 >= barPos.right - 15 &&
//     ballPos.left + 12.5 <= barPos.right + 5)
// ) {
//   console.log("aplha");
//   sxball = sInc(sxball);
//   // sxball *= -1;
// }

//blocks
