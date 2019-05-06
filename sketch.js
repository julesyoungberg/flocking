let flock, center
let paused = false
let debug = false

// config
let swt = 25.0
let awt = 4.0
let cwt = 5.0
let maxSpeed = 2
let maxForce = 0.025
let boidSize = 1.0

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


	// WEIGHT CONTROL
	const swtControl = createInput(swt, 'number')
	swtControl.position(10, 650)
	const swtLabel = createElement('label', 'separation weight')
	swtLabel.position(10, 630)

	const awtControl = createInput(awt, 'number')
	awtControl.position(150, 650)
	const awtLabel = createElement('label', 'alignment weight')
	awtLabel.position(150, 630)

	const cwtControl = createInput(cwt, 'number')
	cwtControl.position(290, 650)
	const cwtLabel = createElement('label', 'cohesion weight')
	cwtLabel.position(290, 630)

	// LIMITS CONTROL
	const msControl = createInput(maxSpeed, 'number')
	msControl.position(10, 700)
	const msLabel = createElement('label', 'max speed')
	msLabel.position(10, 680)

	const mfControl = createInput(maxForce, 'number')
	mfControl.position(150, 700)
	const mfLabel = createElement('label', 'max force')
	mfLabel.position(150, 680)

	const sizeControl = createInput(boidSize, 'number')
	sizeControl.position(290, 700)
	const sizeLabel = createElement('label', 'boid size')
	sizeLabel.position(290, 680)

	// GENERAL APPLICATION CONTROLS
	const debugControl = createCheckbox('debug', debug)
	debugControl.position(10, 730)
	debugControl.changed(toggleDebugging)

	const pauseControl = createCheckbox('pause', paused)
	pauseControl.position(150, 730)
	pauseControl.changed(togglePaused)
}

function toggleDebugging() {
	if (this.checked()) debug = true
	else debug = false
}

function togglePaused() {
	if (this.checked()) paused = true
	else paused = false
}

function draw() {
	if (!paused) flock.run()
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
