// -- Global Variables --

// Grabs a reference to the canvas element
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// clock speed - frames per second
var canvasFPS = 120;
var intervalTimer = Math.floor(1000 / canvasFPS); // calculates amount of ms between each frame

// shape starting positions
var playerWidth = 12;
var playerHeight = 90;
var playerX = 0;
var playerY = (canvas.height / 2) - 45;

var botWidth = 12;
var botHeight = 90;
var botX = canvas.width - 12;
var botY = (canvas.height / 2) - 45;

var ballRadius = 10;
var ballX = canvas.width / 2;
var ballY = canvas.height / 2;
var ballSpeed = 1.0;
var ballXAngle = findAngle();
var ballYAngle = findAngle();

// left paddle
player = {
			width : playerWidth,
			height : playerHeight,
			x : playerX,
			y : playerY,

			score : 0,
		 };

// right paddle
bot = {
			width : botWidth,
			height : botHeight,
			x : botX,
			y : botY,

			msSpeed : 2.0,

			score : 0,
	  };
		 
// ball
ball = {
			radius : ballRadius,
			x : ballX,
			y : ballY,

			msSpeed : ballSpeed,

			xAngle : ballXAngle,
			yAngle : ballYAngle,
	   };

document.addEventListener("mousemove", mouseHandler, false);

// -- Static Functions --

function findAngle()
{
	let num = Math.random();
	
	if (num < 0.5){ return -1; }
	else { return 1; }
}

function mouseHandler(e)
{
	var mouseY = e.clientY;
	
	if ( mouseY > canvas.offsetTop && mouseY < canvas.height + canvas.offsetTop )
	{
		player.y = (mouseY - canvas.offsetTop) - player.height / 2;
	}
}

// used to check collision for both paddles
function canvasCollision(paddle)
{
	if (paddle.y < 0)
	{
		paddle.y = 0;
	}
	else if (paddle.y + paddle.height > canvas.height)
	{
		paddle.y = canvas.height - paddle.height;
	}
}

// checks collision for ball with walls and paddles
function ballCollision()
{

	// side walls - win condition
	var isOver = false;
	if (ball.x < player.width / 2){ bot.score += 1; isOver = true; }
	else if (ball.x > canvas.width - playerWidth + 1){ player.score += 1; isOver = true; }

	if (isOver)
	{
		// reseting shape objects
		player.x = playerX; player.y = playerY;
		bot.x = botX; bot.y = botY;

		ball.x = ballX; ball.y = ballY; 
		ball.msSpeed = ballSpeed; 
		ball.xAngle = findAngle(); ball.yAngle = findAngle();

		console.log("Player: ", player.score);
		console.log("Bot: ", bot.score);
	}

	// ceiling and floor
	if (ball.y - ball.radius < 0){ ball.yAngle = 1; }
	else if (ball.y + ball.radius > canvas.height){ ball.yAngle = -1; }

	// left paddle
	if (ball.x - ball.radius < player.width)
	{
		if (ball.y > player.y && ball.y < player.y + player.height)
		{
			ball.xAngle *= -1;
			ball.msSpeed += 0.1;
		}
	}

	// right paddle
	if (ball.x + ball.radius > canvas.width - bot.width)
	{
		if (ball.y > bot.y && ball.y < bot.y + bot.height)
		{
			ball.xAngle *= -1;
			ball.msSpeed += 0.1;
		}
	}
}

// moves the bot according to the ball position
function botMovement()
{
	if (ball.xAngle == 1) // makes sure the ball is travelling towards the bot
	{
		if (bot.y + (bot.height / 2) < ball.y){ bot.y += 1 * bot.msSpeed }
		else if (bot.y + (bot.height / 2) > ball.y){ bot.y -= 1 * bot.msSpeed }
	}	
}

function ballMovement()
{
	// x movement
	if (ball.xAngle == 1){ ball.x += 1 * ball.msSpeed; }
	else if (ball.xAngle == -1){ ball.x += 1 * -ball.msSpeed; }

	// y movement
	if (ball.yAngle == 1){ ball.y += 1 * ball.msSpeed; }
	else if (ball.yAngle == -1){ ball.y += 1 * -ball.msSpeed; }
}

// -- Main Game Loop --

// called every frame to update movement and check for inputs
function update()
{
	// detects collision with canvas for both paddles
	canvasCollision(player);
	canvasCollision(bot);
	ballCollision();

	botMovement();
	ballMovement();
}

// called every frame to clear and draw the new frame
function draw()
{	
	// -- Clear contents --
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	// -- Drawing objects --
	
	// left paddle
	ctx.beginPath();
	ctx.rect(player.x, player.y, player.width, player.height);
	ctx.fillStyle = "#FF0000";
	ctx.fill();
	ctx.closePath();

	// right paddle
	ctx.beginPath();
	ctx.rect(bot.x, bot.y, bot.width, bot.height);
	ctx.fillStyle = "#FFBB00";
	ctx.fill();
	ctx.closePath();

	// ball
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2, false);
	ctx.fillStyle = "#00BBFF";
	ctx.fill();
	ctx.closePath();

	// -- Drawing Text --

	// score
	ctx.font = "40px Courier";
	ctx.fillStyle = "#000000";
	ctx.fillText(player.score + " " + bot.score, canvas.width / 2 - 33, canvas.height / 2 + 20);

	// line inbetween Text
	ctx.beginPath();
	ctx.rect(canvas.width / 2 + 2, canvas.height / 2 - 40, 1.2, 95)
	ctx.fillStyle = "#000000";
	ctx.fill();
	ctx.closePath();
	
}

// main function
function main()
{
	// runs the main loop at the specified tick speed
	setInterval(update, intervalTimer);
	setInterval(draw, intervalTimer);
}