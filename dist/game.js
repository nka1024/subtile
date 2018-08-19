/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2018 Digitsensitive
 * @description  Asteroid: Const
 * @license      Digitsensitive
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONST = {
    SHIP_SIZE: 20,
    SCORE: 0,
    HIGHSCORE: 0,
    LIVES: 3,
    ASTEROID_COUNT: 3,
    ASTEROID: {
        LARGE: {
            MAXSIZE: 100,
            MINSIZE: 50,
            MAXSPEED: 3,
            MINSPEED: 1
        },
        MEDIUM: {
            MAXSIZE: 50,
            MINSIZE: 30,
            MAXSPEED: 4,
            MINSPEED: 1
        },
        SMALL: {
            MAXSIZE: 30,
            MINSIZE: 10,
            MAXSPEED: 4,
            MINSPEED: 2
        }
    }
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2018 Digitsensitive
 * @description  Asteroid: Game
 * @license      Digitsensitive
 */
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../../phaser.d.ts"/>
__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"phaser\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const bootScene_1 = __webpack_require__(2);
const mainMenuScene_1 = __webpack_require__(3);
const gameScene_1 = __webpack_require__(4);
const config = {
    title: "Asteroid",
    url: "https://github.com/digitsensitive/phaser3-typescript",
    version: "1.0",
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    parent: "game",
    scene: [bootScene_1.BootScene, mainMenuScene_1.MainMenuScene, gameScene_1.GameScene],
    input: {
        keyboard: true,
        mouse: false,
        touch: false,
        gamepad: false
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    backgroundColor: "#000000",
    pixelArt: false,
    antialias: true
};
class Game extends Phaser.Game {
    constructor(config) {
        super(config);
    }
}
exports.Game = Game;
window.onload = () => {
    var game = new Game(config);
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2018 Digitsensitive
 * @description  Asteroid: Boot Scene
 * @license      Digitsensitive
 */
Object.defineProperty(exports, "__esModule", { value: true });
class BootScene extends Phaser.Scene {
    constructor() {
        super({
            key: "BootScene"
        });
    }
    update() {
        this.scene.start("MainMenuScene");
    }
}
exports.BootScene = BootScene;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2018 Digitsensitive
 * @description  Asteroid: Main Menu Scene
 * @license      Digitsensitive
 */
Object.defineProperty(exports, "__esModule", { value: true });
const const_1 = __webpack_require__(0);
class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: "MainMenuScene"
        });
        this.bitmapTexts = [];
    }
    init() {
        this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        // reset score, highscore and player lives
        if (const_1.CONST.SCORE > const_1.CONST.HIGHSCORE) {
            const_1.CONST.HIGHSCORE = const_1.CONST.SCORE;
        }
        const_1.CONST.SCORE = 0;
        const_1.CONST.LIVES = 3;
    }
    preload() {
        this.load.bitmapFont("asteroidFont", "./assets/games/asteroid/asteroidFont.png", "./assets/games/asteroid/asteroidFont.fnt");
    }
    create() {
        this.bitmapTexts.push(this.add.bitmapText(this.sys.canvas.width / 2 - 150, this.sys.canvas.height / 2 + 40, "asteroidFont", "PRESS S TO PLAY", 45));
        this.bitmapTexts.push(this.add.bitmapText(this.sys.canvas.width / 2 - 150, this.sys.canvas.height / 2 - 60, "asteroidFont", "A S T E R O I D", 80));
        this.bitmapTexts.push(this.add.bitmapText(this.sys.canvas.width / 2 - 150, this.sys.canvas.height / 2 + 80, "asteroidFont", "HIGHSCORE: " + const_1.CONST.HIGHSCORE, 45));
    }
    update() {
        if (this.startKey.isDown) {
            this.scene.start("GameScene");
        }
    }
}
exports.MainMenuScene = MainMenuScene;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2018 Digitsensitive
 * @description  Asteroid: Game Scene
 * @license      Digitsensitive
 */
Object.defineProperty(exports, "__esModule", { value: true });
const asteroid_1 = __webpack_require__(5);
const ship_1 = __webpack_require__(6);
const const_1 = __webpack_require__(0);
class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: "GameScene"
        });
    }
    create() {
        this.player = new ship_1.Ship({ scene: this, opt: {} });
        this.asteroids = [];
        this.numberOfAsteroids = const_1.CONST.ASTEROID_COUNT;
        this.spawnAsteroids(this.numberOfAsteroids, 3);
        this.score = const_1.CONST.SCORE;
        this.bitmapTexts = [];
        this.bitmapTexts.push(this.add.bitmapText(this.sys.canvas.width / 2, 40, "asteroidFont", "" + this.score, 80));
        this.gotHit = false;
    }
    update() {
        this.player.update();
        // check collision between asteroids and bullets
        for (let i = 0; i < this.asteroids.length; i++) {
            for (let bullet of this.player.getBullets()) {
                if (Phaser.Geom.Intersects.RectangleToRectangle(bullet.getBody(), this.asteroids[i].getBody())) {
                    bullet.setActive(false);
                    this.asteroids[i].setActive(false);
                    this.updateScore(this.asteroids[i].getSize());
                }
            }
            this.asteroids[i].update();
            if (!this.asteroids[i].active) {
                this.spawnAsteroids(3, this.asteroids[i].getSize() - 1, this.asteroids[i].x, this.asteroids[i].y);
                this.asteroids[i].destroy();
                this.asteroids.splice(i, 1);
            }
        }
        // check collision between asteroids and ship
        for (let i = 0; i < this.asteroids.length; i++) {
            if (Phaser.Geom.Intersects.RectangleToRectangle(this.asteroids[i].getBody(), this.player.getBody())) {
                this.player.setActive(false);
                this.gotHit = true;
            }
        }
        // if player got hit
        if (this.gotHit) {
            const_1.CONST.LIVES--;
            if (const_1.CONST.LIVES > 0) {
                this.scene.start("GameScene");
            }
            else {
                this.scene.start("MainMenuScene");
            }
        }
        if (this.asteroids.length === 0) {
            this.scene.start("MainMenuScene");
        }
    }
    spawnAsteroids(aAmount, aSize, aX, aY) {
        if (aSize > 0) {
            for (let i = 0; i < aAmount; i++) {
                this.asteroids.push(new asteroid_1.Asteroid({
                    scene: this,
                    x: aX === undefined
                        ? this.getRandomSpawnPostion(this.sys.canvas.width)
                        : aX,
                    y: aY === undefined
                        ? this.getRandomSpawnPostion(this.sys.canvas.height)
                        : aY,
                    size: aSize
                }));
            }
        }
    }
    updateScore(aSizeOfAsteroid) {
        switch (aSizeOfAsteroid) {
            case 3:
                this.score += 20;
                break;
            case 2:
                this.score += 50;
                break;
            case 1:
                this.score += 100;
                break;
        }
        const_1.CONST.SCORE = this.score;
        this.bitmapTexts[0].text = "" + this.score;
    }
    getRandomSpawnPostion(aScreenSize) {
        let rndPos = Phaser.Math.RND.between(0, aScreenSize);
        while (rndPos > aScreenSize / 3 && rndPos < aScreenSize * 2 / 3) {
            rndPos = Phaser.Math.RND.between(0, aScreenSize);
        }
        return rndPos;
    }
}
exports.GameScene = GameScene;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2018 Digitsensitive
 * @description  Asteroid: Asteroid
 * @license      Digitsensitive
 */
Object.defineProperty(exports, "__esModule", { value: true });
const const_1 = __webpack_require__(0);
class Asteroid extends Phaser.GameObjects.Graphics {
    getRadius() {
        return this.radius;
    }
    getBody() {
        return this.body;
    }
    constructor(params) {
        super(params.scene, params);
        // variables
        this.currentScene = params.scene;
        this.numberOfSides = 12;
        this.asteroidRadius = 0;
        this.sizeOfAsteroid = params.size;
        // init ship
        this.initAsteroid(params.x, params.y, this.sizeOfAsteroid);
        // physics
        this.currentScene.physics.world.enable(this);
        this.body.allowGravity = false;
        this.body.setCircle(this.asteroidRadius);
        this.body.setOffset(-this.asteroidRadius, -this.asteroidRadius);
        this.currentScene.add.existing(this);
    }
    initAsteroid(aX, aY, aSizeOfAsteroid) {
        let points = [];
        for (let i = 0; i < this.numberOfSides; i++) {
            switch (aSizeOfAsteroid) {
                case 3: {
                    this.radius = Phaser.Math.RND.between(const_1.CONST.ASTEROID.LARGE.MAXSIZE, const_1.CONST.ASTEROID.LARGE.MINSIZE);
                    this.velocity = this.getRandomVelocity(const_1.CONST.ASTEROID.LARGE.MINSPEED, const_1.CONST.ASTEROID.LARGE.MAXSPEED);
                    break;
                }
                case 2: {
                    this.radius = Phaser.Math.RND.between(const_1.CONST.ASTEROID.MEDIUM.MAXSIZE, const_1.CONST.ASTEROID.MEDIUM.MINSIZE);
                    this.velocity = this.getRandomVelocity(const_1.CONST.ASTEROID.MEDIUM.MINSPEED, const_1.CONST.ASTEROID.MEDIUM.MAXSPEED);
                    break;
                }
                case 1: {
                    this.radius = Phaser.Math.RND.between(const_1.CONST.ASTEROID.SMALL.MAXSIZE, const_1.CONST.ASTEROID.SMALL.MINSIZE);
                    this.velocity = this.getRandomVelocity(const_1.CONST.ASTEROID.SMALL.MINSPEED, const_1.CONST.ASTEROID.SMALL.MAXSPEED);
                    break;
                }
            }
            if (this.radius > this.asteroidRadius) {
                this.asteroidRadius = this.radius;
            }
            let x = this.radius * Math.cos(2 * Math.PI * i / this.numberOfSides);
            let y = this.radius * Math.sin(2 * Math.PI * i / this.numberOfSides);
            points.push(new Phaser.Math.Vector2(x, y));
        }
        this.lineStyle(1, 0xffffff);
        for (let p = 0; p < points.length; p++) {
            this.beginPath();
            this.moveTo(points[p].x, points[p].y);
            if (p + 1 < points.length) {
                this.lineTo(points[p + 1].x, points[p + 1].y);
            }
            else {
                this.lineTo(points[0].x, points[0].y);
            }
            this.strokePath();
        }
        this.x = aX;
        this.y = aY;
    }
    update() {
        this.applyForces();
        this.checkIfOffScreen();
    }
    applyForces() {
        // apple velocity to position
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        // rotate
        this.rotation += 0.005;
    }
    getSize() {
        return this.sizeOfAsteroid;
    }
    checkIfOffScreen() {
        // horizontal check
        if (this.x > this.currentScene.sys.canvas.width + const_1.CONST.SHIP_SIZE) {
            this.x = -const_1.CONST.SHIP_SIZE;
        }
        else if (this.x < -const_1.CONST.SHIP_SIZE) {
            this.x = this.currentScene.sys.canvas.width + const_1.CONST.SHIP_SIZE;
        }
        // vertical check
        if (this.y > this.currentScene.sys.canvas.height + const_1.CONST.SHIP_SIZE) {
            this.y = -const_1.CONST.SHIP_SIZE;
        }
        else if (this.y < -const_1.CONST.SHIP_SIZE) {
            this.y = this.currentScene.sys.canvas.height + const_1.CONST.SHIP_SIZE;
        }
    }
    getRandomVelocity(aMin, aMax) {
        return new Phaser.Math.Vector2(Phaser.Math.RND.between(this.getRndNumber(aMin, aMax), this.getRndNumber(aMin, aMax)), Phaser.Math.RND.between(this.getRndNumber(aMin, aMax), this.getRndNumber(aMin, aMax)));
    }
    getRndNumber(aMin, aMax) {
        let num = Math.floor(Math.random() * aMax) + aMin;
        num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
        return num;
    }
}
exports.Asteroid = Asteroid;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2018 Digitsensitive
 * @description  Asteroid: Ship
 * @license      Digitsensitive
 */
Object.defineProperty(exports, "__esModule", { value: true });
const bullet_1 = __webpack_require__(7);
const const_1 = __webpack_require__(0);
class Ship extends Phaser.GameObjects.Graphics {
    getBullets() {
        return this.bullets;
    }
    getBody() {
        return this.body;
    }
    constructor(params) {
        super(params.scene, params.opt);
        // variables
        this.currentScene = params.scene;
        this.bullets = [];
        this.isShooting = false;
        // init ship
        this.initShip();
        // input
        this.cursors = this.currentScene.input.keyboard.createCursorKeys();
        this.shootKey = this.currentScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        // physics
        this.currentScene.physics.world.enable(this);
        this.body.allowGravity = false;
        this.body.setSize(const_1.CONST.SHIP_SIZE * 2, const_1.CONST.SHIP_SIZE * 2);
        this.body.setOffset(-const_1.CONST.SHIP_SIZE, -const_1.CONST.SHIP_SIZE);
        this.currentScene.add.existing(this);
    }
    initShip() {
        // define ship properties
        this.x = this.currentScene.sys.canvas.width / 2;
        this.y = this.currentScene.sys.canvas.height / 2;
        this.velocity = new Phaser.Math.Vector2(0, 0);
        // define ship graphics and draw it
        this.lineStyle(1, 0xffffff);
        this.strokeTriangle(-const_1.CONST.SHIP_SIZE, const_1.CONST.SHIP_SIZE, const_1.CONST.SHIP_SIZE, const_1.CONST.SHIP_SIZE, 0, -const_1.CONST.SHIP_SIZE);
    }
    update() {
        if (this.active) {
            this.handleInput();
        }
        else {
        }
        this.applyForces();
        this.checkIfOffScreen();
        this.updateBullets();
    }
    handleInput() {
        if (this.cursors.up.isDown) {
            this.boost();
        }
        if (this.cursors.right.isDown) {
            this.rotation += 0.05;
        }
        else if (this.cursors.left.isDown) {
            this.rotation -= 0.05;
        }
        if (this.shootKey.isDown && !this.isShooting) {
            this.shoot();
            this.recoil();
            this.isShooting = true;
        }
        if (this.shootKey.isUp) {
            this.isShooting = false;
        }
    }
    boost() {
        // create the force in the correct direction
        let force = new Phaser.Math.Vector2(Math.cos(this.rotation - Math.PI / 2), Math.sin(this.rotation - Math.PI / 2));
        // reduce the force and apply it to the velocity
        force.scale(0.12);
        this.velocity.add(force);
    }
    applyForces() {
        // apple velocity to position
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        // reduce the velocity
        this.velocity.scale(0.98);
    }
    checkIfOffScreen() {
        // horizontal check
        if (this.x > this.currentScene.sys.canvas.width + const_1.CONST.SHIP_SIZE) {
            this.x = -const_1.CONST.SHIP_SIZE;
        }
        else if (this.x < -const_1.CONST.SHIP_SIZE) {
            this.x = this.currentScene.sys.canvas.width + const_1.CONST.SHIP_SIZE;
        }
        // vertical check
        if (this.y > this.currentScene.sys.canvas.height + const_1.CONST.SHIP_SIZE) {
            this.y = -const_1.CONST.SHIP_SIZE;
        }
        else if (this.y < -const_1.CONST.SHIP_SIZE) {
            this.y = this.currentScene.sys.canvas.height + const_1.CONST.SHIP_SIZE;
        }
    }
    shoot() {
        this.bullets.push(new bullet_1.Bullet(this.currentScene, {
            x: this.x,
            y: this.y,
            rotation: this.rotation
        }));
    }
    recoil() {
        // create the force in the correct direction
        let force = new Phaser.Math.Vector2(-Math.cos(this.rotation - Math.PI / 2), -Math.sin(this.rotation - Math.PI / 2));
        // reduce the force and apply it to the velocity
        force.scale(0.2);
        this.velocity.add(force);
    }
    updateBullets() {
        for (let i = 0; i < this.bullets.length; i++) {
            if (this.bullets[i].active) {
                this.bullets[i].update();
            }
            else {
                this.bullets[i].destroy();
                this.bullets.splice(i, 1);
            }
        }
    }
}
exports.Ship = Ship;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2018 Digitsensitive
 * @description  Asteroid: Bullet
 * @license      Digitsensitive
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Bullet extends Phaser.GameObjects.Graphics {
    getBody() {
        return this.body;
    }
    constructor(scene, params) {
        super(scene, params);
        // variables
        this.colors = [];
        this.colors.push(0x3ae0c4);
        this.colors.push(0x39e066);
        this.colors.push(0xe08639);
        let rndColor = Phaser.Math.RND.between(0, 2);
        this.selectedColor = this.colors[rndColor];
        this.currentScene = scene;
        this.lifeSpan = 100;
        this.isOffScreen = false;
        // init bullet
        this.x = params.x;
        this.y = params.y;
        this.velocity = new Phaser.Math.Vector2(15 * Math.cos(params.rotation - Math.PI / 2), 15 * Math.sin(params.rotation - Math.PI / 2));
        // define bullet graphics and draw it
        this.fillStyle(this.selectedColor, 1);
        this.fillCircle(0, 0, 3);
        // physics
        this.currentScene.physics.world.enable(this);
        this.body.allowGravity = false;
        this.body.setCircle(3);
        this.body.setOffset(-3, -3);
        this.currentScene.add.existing(this);
    }
    update() {
        // apple velocity to position
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        if (this.lifeSpan < 0 || this.isOffScreen) {
            this.setActive(false);
        }
        else {
            this.lifeSpan--;
        }
        this.checkIfOffScreen();
    }
    checkIfOffScreen() {
        if (this.x > this.currentScene.sys.canvas.width + 1 ||
            this.y > this.currentScene.sys.canvas.height + 1) {
            this.isOffScreen = true;
        }
    }
}
exports.Bullet = Bullet;


/***/ })
/******/ ]);
//# sourceMappingURL=game.js.map