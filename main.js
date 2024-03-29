import { Bodies, Body, Engine, Events, Render, Runner, World } from "matter-js";
import { FRUITS_BASE, FRUITS_HLW } from "./fruits.js";
import "./dark.css";

let THEME = "halloween"; // { base, halloween }
let FRUITS = FRUITS_BASE;

switch (THEME) {
  case "halloween":
    FRUITS = FRUITS_HLW;
    break;
  default:
    FRUITS = FRUITS_BASE;
}

const engine = Engine.create();
const render = Render.create({
  engine,
  element: document.body,
  options: {
    wireframes: false,
    background: "#fcba03",
    width: 620,
    height: 850,
  }
});

const world = engine.world;

const leftWall = Bodies.rectangle(15, 395, 30, 790, {
  isStatic: true,
  render: { fillStyle: "#E6B143" }
});

const rightWall = Bodies.rectangle(605, 395, 30, 790, {
  isStatic: true,
  render: { fillStyle: "#E6B143" }
});

const ground = Bodies.rectangle(310, 820, 620, 60, {
  isStatic: true,
  render: { fillStyle: "#E6B143" }
});

const topLine = Bodies.rectangle(310, 150, 620, 2, {
  name: "topLine",
  isStatic: true,
  isSensor: true,
  render: { fillStyle: "#E6B143" }
})

World.add(world, [leftWall, rightWall, ground, topLine]);

Render.run(render);
Runner.run(engine);

let currentBody = null;
let currentFruit = null;
let disableAction = false;
let interval = null;

function addFruit() {
  const index = Math.floor(Math.random() * 7);
  const fruit = FRUITS[index];

  const body = Bodies.circle(300, 50, fruit.radius, {
    index: index,
    isSleeping: true,
    render: {
      sprite: { texture: `${fruit.name}.png` }
    },
    restitution: 0.2,
  });

  currentBody = body;
  currentFruit = fruit;

  World.add(world, body);
}



  window.onkeydown = (event) => {
    if (disableAction) {
      return;
    }
  
    switch (event.code) {
      case "KeyA":
        if (interval)
          return;
  
        interval = setInterval(() => {
          if (currentBody.position.x - currentFruit.radius > 30)
            Body.setPosition(currentBody, {
              x: currentBody.position.x - 1,
              y: currentBody.position.y,
            });
        }, 5);
        playmoveSound();
        break;
  
      case "KeyD":
        if (interval)
          return;
  
        interval = setInterval(() => {
          if (currentBody.position.x + currentFruit.radius < 590)
            Body.setPosition(currentBody, {
              x: currentBody.position.x + 1,
              y: currentBody.position.y,
            });
        }, 5);
        playmoveSoundL();
        break;
  
      case "KeyS":
        currentBody.isSleeping = false;
        disableAction = true;
  
        setTimeout(() => {
          addFruit();
          disableAction = false;
        }, 1000);
  
        // 사운드 재생
        playfallSound();
        break;
    }
  };

window.onkeyup = (event) => {
  switch (event.code) {
    case "KeyA":
    case "KeyD":
      clearInterval(interval);
      interval = null;
  }
}


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


Events.on(engine, "collisionStart", (event) => {
  event.pairs.forEach((collision) => {
    if (collision.bodyA.index === collision.bodyB.index) {
      const index = collision.bodyA.index;

      if (index === FRUITS.length - 1) {
        return;
      }

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

      World.add(world,newBody);

      // 합쳐질 때 사운드 재생
      playFruitCollisionSound();
    }
  
    if (
      !disableAction &&
      (collision.bodyA.name === "topLine" || collision.bodyB.name === "topLine")) {

      playGameOverSound();
      alert("Game over");
      gameOver(); // 게임 오버 시 게임을 초기화
      
    }
  });
});

function gameOver() {
  clearInterval(interval); // 이동 인터벌 클리어
  World.clear(world); // 월드 초기화
  addFruit(); // 새로운 게임을 시작하기 위해 과일 추가
}



addFruit();