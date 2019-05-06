let flock, center
let running = true

// config
let swt = 25
let awt = 4.0
let cwt = 5.0
let maxSpeed = 2
let maxForce = 0.025

function setup() {
	createCanvas(windowWidth, 600)

	center = createVector(width/2, height/2)
	colorMode(RGB, 255, 255, 255, 100)

	flock = new Flock()

	var r = (width > height ? height : width) / 2 - 500
  var cent = createVector(width / 2, height / 2)

	for (var i = 0; i < 100; i++) {
		// to start in circle
		// const position = createVector(
		//   random(cent.x - r, cent.x + r), random(cent.y - r, cent.y + r)
		// )
		createBoid()
	}

	smooth()
}

function draw() {
	if (running) {
		flock.run()
	}
}

function mouseDragged() {
	createBoid(mouseX, mouseY)
}

function keyPressed() {
	if (key == 'P') {
		running = !running
	}
}

function createBoid(x, y) {
	const position = createVector(x || random(0, width), y || random(0, height))
	flock.add(new Boid(position, {
		r: 1.0,
		swt,
		awt,
		cwt,
		maxSpeed,
		maxForce,
	}))
}
