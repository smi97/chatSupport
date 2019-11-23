import ModalWindow from "../modalWindow";
import router from "../../modules/router";
import User from "../../modules/user";
import Ball from "./ball/ball";

export default class MultiPlayer {
    constructor(parent) {
        this.parent = parent;
    }

    start = () => {
        document.addEventListener("keydown", this._modalWindowHandler);

        window.addEventListener("pushstate", this._onPageChange);
        this.foodCanvas = document.querySelector(".foodCanvas");
        this.score = document.querySelector(".gameScore__number");

        this.balls = new Map();
        this.food = new Map();

        this.mouseCoordinates = {
            x: 0,
            y: 0,
        };

        const user = User.getCurrentUser();
        if (user) {
            if (user.avatar_path) {
                const backgroundImage = new Image();
                backgroundImage.src = user.avatar_path;
                this.userBackgroundImage = backgroundImage;
            }
            this.currentUserID = user.id;
        }

        this.socket = new WebSocket("ws://95.163.212.121/api/v1/private/game");
        this.socket.onopen = () => {
            console.log("[open] Соединение установлено");
            console.log("Отправляем данные на сервер");
            this.socket.send(`{"type" : "start"}`);
        };

        this.socket.onmessage = this._messageHandler;

        this.socket.onclose = (event) => {
            if (event.wasClean) {
                console.log(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
            } else {
                console.log('[close] Соединение прервано');
            }
        };

        this.socket.onerror = (error) => {
            console.log(`[error] ${error.message}`);
        };


        this.modalWindow = new ModalWindow(document.body);

        //window.addEventListener("resize", this._onWindowResize);


        this.timeouts = [];

        document.addEventListener("mousemove", this._handleMouseMove);
    };

    _messageHandler = event => {
        //console.log(`[message] Данные получены с сервера: ${event.data}`);
        const data = JSON.parse(event.data);

        if(data.type === "start") {
            data.foods.forEach(element => {
                this.food.set(element.id, {
                    id: element.id,
                    x: element.x,
                    y: element.y,
                    status: 1,
                    color:
                        "#" +
                        (0x1000000 + Math.random() * 0xffffff)
                            .toString(16)
                            .substr(1, 6),
                });
            });

            this._drawFood();

            if (data && data.players) {
                data.players.forEach(player => {
                    const ball = new Ball(
                        player.id,
                        player.x,
                        player.y,
                        "yellow",
                    );

                    if(ball.id === this.currentUserID) {
                        ball.backgroundImage = this.userBackgroundImage;
                    }

                    this.balls.set(player.id, ball);
                });
            }

            requestAnimationFrame(this._redrawAllBalls);
        }
        if(data.type === "move") {
            if(!this.balls.get(data.player.id)) {
                const ball = new Ball(
                    data.player.id,
                    data.player.x,
                    data.player.y,
                    "yellow",
                );

                if(ball.id === this.currentUserID) {
                    ball.backgroundImage = this.userBackgroundImage;
                }

                this.balls.set(data.player.id, ball);
            }
            const ballToMove = this.balls.get(data.player.id);

            ballToMove.easingTargetX = data.player.x;
            ballToMove.easingTargetY = data.player.y;
            this._moveBall(ballToMove);

            if (data.eatenFood.length > 0) {
                data.eatenFood.forEach(id => {
                    this.food.get(id).status = 0;
                    this._drawFood();
                });
            }
        }
    };

    _onWindowResize = () => {
        this.balls.get(this.currentUserID).canvas.width = window.innerWidth;
        this.balls.get(this.currentUserID).canvas.height = window.innerHeight;
        this.foodCanvas.width = window.innerWidth;
        this.foodCanvas.height = window.innerHeight;
        this.enemies.forEach(enemy => {
            enemy.canvas.height = window.innerHeight;
            enemy.canvas.width = window.innerWidth;
        });
    };

    _handleMouseMove = event => {
        this._countAndSendSpeed(event.clientX, event.clientY);
        this._countAndSendDirection(event.clientX, event.clientY);

        this.mouseCoordinates.x = event.clientX;
        this.mouseCoordinates.y = event.clientY;
    };

    _countAndSendSpeed = (x, y) => {
        const dis = Math.sqrt( Math.pow(x - this.balls.get(this.currentUserID).x, 2) + Math.pow(y - this.balls.get(this.currentUserID).y,2) );
        const diagonal = Math.sqrt(Math.pow(window.innerHeight, 2) + Math.pow(window.innerWidth, 2));
        const speed = Math.floor(Math.sqrt(dis / diagonal * 100)) * 10;

        this.socket.send(`{"type":"speed", "speed":${speed}}`);
    };

    _countAndSendDirection = (x, y) => {
        const dis = Math.sqrt( Math.pow(x - this.balls.get(this.currentUserID).x, 2) + Math.pow(y - this.balls.get(this.currentUserID).y,2) );
        let angle = 180 - Math.round(Math.acos((event.clientY - this.balls.get(this.currentUserID).y) / dis) / Math.PI * 180);

        if ((event.clientX - this.balls.get(this.currentUserID).x > 0 && event.clientY - this.balls.get(this.currentUserID).y < 0) || (event.clientX - this.balls.get(this.currentUserID).x > 0 && event.clientY - this.balls.get(this.currentUserID).y > 0)) {
            angle = 180 + (180 - angle);
        }

        this.socket.send(`{"type":"direction", "direction":${360 - angle}}`);
    };

    _moveBall = ball => {
        if (
            ball.easingTargetX === ball.x + ball.radius &&
            ball.easingTargetY === ball.y + ball.radius
        ) {
            return;
        }

        ball.x += (ball.easingTargetX - ball.x) * ball.easing;
        ball.y += (ball.easingTargetY - ball.y) * ball.easing;

        if(ball.id === this.currentUserID) {
            if (ball.x > this.mouseCoordinates.x - ball.radius &&
                ball.x < this.mouseCoordinates.x + ball.radius &&
                ball.y > this.mouseCoordinates.y - ball.radius &&
                ball.y < this.mouseCoordinates.y + ball.radius ) {
                this.socket.send(`{"type":"speed", "speed":0}`);
            } else {
                this._countAndSendSpeed(this.mouseCoordinates.x, this.mouseCoordinates.y);
            }
        }

        this.timeouts.push(setTimeout(() => this._moveBall(ball), 100));
    };

    _drawFood = () => {
        const ctx = this.foodCanvas.getContext("2d");
        ctx.clearRect(0, 0, this.foodCanvas.width, this.foodCanvas.height);

        this.food.forEach(foodElement => {
            if (foodElement.status === 1) {
                ctx.beginPath();
                ctx.arc(foodElement.x, foodElement.y, 5, 0, Math.PI * 2, false);
                ctx.fillStyle = foodElement.color;
                ctx.fill();
                ctx.closePath();
                /*ctx.font = "30px Arial";
                ctx.fillText(foodElement.id, foodElement.x, foodElement.y);*/
            }
        });
    };

    _redrawAllBalls = () => {
        if (this.balls) {
            this.balls.forEach(ball => {
                ball.draw();

            });
        }
        requestAnimationFrame(this._redrawAllBalls);
    };

    _scoreIncrement = ball => {
        ball.radius++;
        ball.canvas.style.zIndex++;
        ball.easing /= 1.06;
        if (ball === this.ball) {
            this.score.innerText = parseInt(this.score.innerText) + 1;
        }
    };

    _end = () => {
        document.removeEventListener("mousedown", this._handleMouseMove);
        window.removeEventListener("resize", this._onWindowResize);
        if (this.timeouts) {
            this.timeouts.forEach(timer => {
                clearTimeout(timer);
            });
        }
        if (this.ball) {
            delete this.ball;
        }
        if (this.enemies) {
            this.enemies.forEach(enemy => {
                this.parent.removeChild(enemy.canvas);
            });
            delete this.enemies;
        }
        if (this.food) {
            delete this.food;
        }
    };

    _pause = () => {
        document.removeEventListener("mousedown", this._handleMouseMove);
    };

    _resume = () => {
        document.addEventListener("mousedown", this._handleMouseMove);
    };

    exit = () => {
        this._end();

        document.body.style.background = null;

        window.history.pushState(
            {},
            document.querySelector("title").innerText,
            "/"
        );
        router.renderPage();
    };

    _playAgain = () => {
        this.modalWindow.close();
        this._end();
        this.start();
    };

    _onPageChange = () => {
        document.removeEventListener("keydown", this._modalWindowHandler);
        window.removeEventListener("popstate", this._onPageChange);
    };

    _modalWindowHandler = event => {
        if (event.key === "Escape" || event.keyCode === 27) {
            document.removeEventListener("keydown", this._modalWindowHandler);
            this._pause();
            this.modalWindow.start("Покинуть игру?", this.exit, () => {
                this.modalWindow.close();
                document.addEventListener("keydown", this._modalWindowHandler);
                this._resume();
            });
        }
    };
}
