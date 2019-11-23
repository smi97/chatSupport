export default class Ball {
    constructor(id, x, y, color) {
        this.id = id;
        this.alive = true;

        this.x = 0;
        this.y = 0;
        this.easingTargetX = 0;
        this.easingTargetY = 0;
        this.easing = 0.01;

        this.radius = 20;
        this.strokeStyle = "rgba(0; 0; 255; 0.5)";
        this.color = color ? color : "green";
        this.backgroundImage = undefined;

        const ballCanvas = document.createElement("canvas");
        ballCanvas.width =  window.innerWidth;
        ballCanvas.height =  window.innerHeight;
        ballCanvas.classList.add("id_" + id, "ballCanvas");

        this.canvas = ballCanvas;

        document.querySelector(".game__wrapper").appendChild(ballCanvas);
    }

    draw = () => {
        const ballCtx = this.canvas.getContext("2d");
        ballCtx.restore();
        ballCtx.save();
        ballCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (!this.alive) {
            return;
        }
        ballCtx.beginPath();
        ballCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ballCtx.clip();
        if (this.backgroundImage) {
            ballCtx.fillStyle = "white";
            ballCtx.fill();
            ballCtx.drawImage(
                this.backgroundImage,
                this.x - this.radius,
                this.y - this.radius,
                this.radius * 2,
                this.radius * 2
            );
        } else {
            ballCtx.fillStyle = this.color;
            ballCtx.fill();
        }
        ballCtx.strokeStyle = this.strokeStyle;
        ballCtx.lineWidth = 2;
        ballCtx.stroke();
    };
}
