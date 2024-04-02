import { Bodies, Body, Engine, Events, Render, Runner, World } from "matter-js";
import { FRUITS_BASE, FRUITS_HLW } from "./fruits.js";
import { Openbox } from './reward.js';
import { Gamestart } from './reward.js';

import "./dark.css";

let THEME = "halloween"; // { base, halloween }
let FRUITS = THEME === "halloween" ? FRUITS_HLW : FRUITS_BASE;

const engine = Engine.create();
let renderWidth = Math.min(window.innerWidth, 620);
let renderHeight = Math.min(window.innerHeight, 850);
const render = Render.create({
  engine,
  element: document.body,
  options: {
    wireframes: false,
    background: "#fcba03",
    width: renderWidth,
    height: renderHeight,
  }
});

const world = engine.world;

const leftWall = Bodies.rectangle(15, renderHeight / 2, 30, renderHeight, {  //왼쪽,윗쪽,너비,높이
  isStatic: true,  
  render: { fillStyle: "#E6B143" }
});

const rightWall = Bodies.rectangle(renderWidth - 15, renderHeight / 2, 30, renderHeight, {
  isStatic: true,
  render: { fillStyle: "#E6B143" }
});

const ground = Bodies.rectangle(renderWidth / 2, renderHeight - 30, renderWidth, 60, {
  isStatic: true,
  render: { fillStyle: "#E6B143" }
});

const topLine = Bodies.rectangle(renderWidth / 2, 90, renderWidth, 2, {
  name: "topLine",
  isStatic: true,
  isSensor: true,  //물건이 걸리지 않고 감지만 함
  render: { fillStyle: "#E6B143" }
});

World.add(world, [leftWall, rightWall, ground, topLine]);

Render.run(render);
Runner.run(engine);

let currentBody = null;
let currentFruit = null;
let disableAction = false;
let interval = null;
let score = 0; // 점수를 저장하는 변수 추가




function addFruit() {
  const index = Math.floor(Math.random() * 6); //정수
  const fruit = FRUITS[index];

  const body = Bodies.circle(renderWidth / 2, 50, fruit.radius, {
    index: index,
    isSleeping: true, //반투명 고정
    render: {
      sprite: { texture: `${fruit.name}.png` }
    },
    restitution: 0.3,   //탄성
  });

  currentBody = body;
  currentFruit = fruit;

  World.add(world, body);
}
// Touch event handling
window.addEventListener('touchstart', (event) => {
  handleTouch(event.touches[0]);
});

window.addEventListener('touchmove', (event) => {
  event.preventDefault(); // Prevent default touch behavior
  handleTouch(event.touches[0]);
});

function handleTouch(touch) {
  const x = touch.clientX;
  const renderWidth = Math.min(window.innerWidth, 620);

  if (x < renderWidth / 2) {
    moveLeft();
  } else {
    moveRight();
  }
}

// Movement functions
function moveLeft() {
  if (disableAction || interval) return;

  interval = setInterval(() => {
    if (currentBody.position.x - currentFruit.radius > 30)
      Body.setPosition(currentBody, {
        x: currentBody.position.x - 1,
        y: currentBody.position.y,
      });
  }, 1); // 1ms 간격으로 호출
  playmoveSound();
}

function moveRight() {
  if (disableAction || interval) return;

  interval = setInterval(() => {
    if (currentBody.position.x + currentFruit.radius < renderWidth - 30)
      Body.setPosition(currentBody, {
        x: currentBody.position.x + 1,
        y: currentBody.position.y,
      });
  }, 1); // 1ms 간격으로 호출
  playmoveSoundL();
}

// Touch event handling
window.addEventListener('touchend', () => {
  clearInterval(interval); // 터치 이벤트가 끝나면 clearInterval 함수 호출하여 움직임을 멈추도록 설정
  interval = null;
});


// Keyboard event handling
window.onkeydown = (event) => {
  if (disableAction) return;

  switch (event.code) {
    case "KeyA":
      moveLeft();
      break;

    case "KeyD":
      moveRight();
      break;

    case "KeyS":
      currentBody.isSleeping = false;
      disableAction = true;

      setTimeout(() => {
        addFruit();
        disableAction = false;
      }, 1000);

      playfallSound();
      break;
  }
};

window.onkeyup = (event) => {
  switch (event.code) {
    case "KeyA":
    case "KeyD":
      clearInterval(interval); // 키보드 이벤트 발생 시 움직임을 멈추도록 clearInterval 함수 호출
      interval = null;
  }
}


// Sound functions
function playmoveSound() {
  const moveSound = document.getElementById('moveSound');
  moveSound.play();
}

function playmoveSoundL() {
  const moveSound = document.getElementById('moveSound');
  moveSound.play();
}

function playfallSound() {
  const fallsound = document.getElementById('fallSound');
  fallsound.play();
}

function playGameOverSound() {
  const gameOverSound = document.getElementById('gameOverSound');
  gameOverSound.play();
}

function playFruitCollisionSound() {
  const fruitCollisionSound = document.getElementById('fruitCollisionSound');
  fruitCollisionSound.play();
}

function playVictorySound() {
  const playVictorySound = document.getElementById('VictorySound');
  playVictorySound.play();
}

// 탑 라인 이하 영역을 터치했을 때 과일이 떨어지도록 처리하는 함수
function dropFruit() {
  if (currentBody) {
    currentBody.isSleeping = false; // 과일이 움직이도록 설정
    disableAction = true; // 다른 동작을 비활성화하여 중복 실행을 방지

    setTimeout(() => {
      addFruit(); // 새로운 과일 추가
      disableAction = false; // 동작 활성화
    }, 1000); // 1초 후에 새로운 과일 추가
    playfallSound();
  }
}

// 탑 라인 이하 영역 터치 이벤트 처리
window.addEventListener('touchstart', (event) => {
  const x = event.touches[0].clientX;
  const y = event.touches[0].clientY;
  const renderHeight = Math.min(window.innerHeight, 850);

  if (y > renderHeight - 30) {
    dropFruit(); 
  }
});



Events.on(engine, "collisionStart", (event) => {
  let fruitCollisionDetected = false;
  event.pairs.forEach((collision) => {
    if (collision.bodyA.index === collision.bodyB.index) {
      const index = collision.bodyA.index;

      World.remove(world, [collision.bodyA, collision.bodyB]);

      const newFruit = FRUITS[index + 1];

      const newBody = Bodies.circle(
        collision.collision.supports[0].x,
        collision.collision.supports[0].y,
        newFruit.radius,
        {
          render: {
            sprite: { texture: `${newFruit.name}.png` }
          },
          index: index + 1,
        }
      );

      World.add(world, newBody);

      playFruitCollisionSound();
      fruitCollisionDetected = true;

        // 충돌 발생 시 점수 증가 (2 ** 과일의 인덱스)
        score += Math.pow(2, index);
      updateScore(); // 점수 업데이트 함수 호출

      // 승리 조건 확인
      checkWinCondition();
    }

    if (
      !disableAction &&
      (collision.bodyA.name === "topLine" || collision.bodyB.name === "topLine")
    ) {
      playGameOverSound();
      alert("Game over");
      gameStart();
      gameOver();  

      //gamestart 함수 호출
    }
  });
});

function updateScore() {
  // 점수 업데이트 로직s
  const scoreElement = document.getElementById("score");
  scoreElement.textContent = "Score: " + score;
}

function checkWinCondition() {
  if (score >= 10000) {
    alert("Congratulations! You win!");
    playVictorySound();
    gamereward(); //
    
  }
}
function gamereward() {
  
  let treasureId = document.getElementById("tid").value;
  Openbox(treasureId);
  
}

function gameStart() {
  
  let treasureId = document.getElementById("tid").value;
  Gamestart(treasureId);
  
}


function gameOver() {
  clearInterval(interval);
  World.clear(world);
  score = 0; // 점수를 저장하는 변수 초기화
   
  const leftWall = Bodies.rectangle(15, renderHeight / 2, 30, renderHeight, {  //왼쪽,오른쪽,너비,높이
    isStatic: true,
    render: { fillStyle: "#E6B143" }
  });
  
  const rightWall = Bodies.rectangle(renderWidth - 15, renderHeight / 2, 30, renderHeight, {
    isStatic: true,
    render: { fillStyle: "#E6B143" }
  });
  
  const ground = Bodies.rectangle(renderWidth / 2, renderHeight - 30, renderWidth, 60, {
    isStatic: true,
    render: { fillStyle: "#E6B143" }
  });
  
  const topLine = Bodies.rectangle(renderWidth / 2, 90, renderWidth, 2, {
    name: "topLine",
    isStatic: true,
    isSensor: true,
    render: { fillStyle: "#E6B143" }
  });

  World.add(world, [leftWall, rightWall, ground, topLine]);
 
  addFruit();
}









// Initialize game
addFruit();

// Resize event handler for responsive behavior
window.onresize = () => {
  renderWidth = Math.min(window.innerWidth, 620);
  renderHeight = Math.min(window.innerHeight, 850);
  Render.setSize(render, renderWidth, renderHeight);
};

    // 리플레쉬 버튼 요소 가져오기
    const refreshButton = document.getElementById('refreshButton');

    // 리플레쉬 버튼에 클릭 이벤트 리스너 추가
    refreshButton.addEventListener('click', () => {
        // 새로고침 함수 호출
        refreshPage();
    });

    // 새로고침 함수 정의
    function refreshPage() {
        // 현재 페이지 새로고침
        window.location.reload();
    }
