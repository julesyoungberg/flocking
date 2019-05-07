let flock

// config
const config = {
	swt: 25,
	awt: 5,
	cwt: 3,
	sepDist: 35,
	aliDist: 25,
	cohDist: 50,
	maxSpeed: 2,
	maxForce: 0.025,
	boidSize: 2,
	debug: false,
	paused: false,
}

const controls = {
	swt: { input: null, label: null },
	awt: { input: null, label: null },
	cwt: { input: null, label: null },
	sepDist: { input: null, label: null },
	aliDist: { input: null, label: null },
	cohDist: { input: null, label: null },
	maxSpeed: { input: null, label: null },
	maxForce: { input: null, label: null },
	boidSize: { input: null, label: null },
	debug: { input: null },
	paused: { input: null },
}

function setup() {
	createCanvas(windowWidth, 600)
	colorMode(RGB, 255, 255, 255, 100)

	createFlock()

	smooth()


	// FLOCK CONTROL
	controls.swt.input = createInput(config.swt, 'number')
	controls.swt.input.position(10, 650)
	controls.swt.label = createElement('label', 'separation weight')
	controls.swt.label.position(10, 630)

	controls.awt.input = createInput(config.awt, 'number')
	controls.awt.input.position(150, 650)
	controls.awt.label = createElement('label', 'alignment weight')
	controls.awt.label.position(150, 630)

	controls.cwt.input = createInput(config.cwt, 'number')
	controls.cwt.input.position(290, 650)
	controls.cwt.label = createElement('label', 'cohesion weight')
	controls.cwt.label.position(290, 630)

	controls.sepDist.input = createInput(config.sepDist, 'number')
	controls.sepDist.input.position(10, 700)
	controls.sepDist.label = createElement('label', 'separation distance')
	controls.sepDist.label.position(10, 680)

	controls.aliDist.input = createInput(config.aliDist, 'number')
	controls.aliDist.input.position(150, 700)
	controls.aliDist.label = createElement('label', 'alignment distance')
	controls.aliDist.label.position(150, 680)

	controls.cohDist.input = createInput(config.cohDist, 'number')
	controls.cohDist.input.position(290, 700)
	controls.cohDist.label = createElement('label', 'cohesion distance')
	controls.cohDist.label.position(290, 680)

	// LIMITS CONTROL
	controls.maxSpeed.input = createInput(config.maxSpeed, 'number')
	controls.maxSpeed.input.position(10, 750)
	controls.maxSpeed.label = createElement('label', 'max speed')
	controls.maxSpeed.label.position(10, 730)

	controls.maxForce.input = createInput(config.maxForce, 'number')
	controls.maxForce.input.position(150, 750)
	controls.maxForce.label = createElement('label', 'max force')
	controls.maxForce.label.position(150, 730)

	controls.boidSize.input = createInput(config.boidSize, 'number')
	controls.boidSize.input.position(290, 750)
	controls.boidSize.label = createElement('label', 'boid size')
	controls.boidSize.label.position(290, 730)

	// GENERAL APPLICATION CONTROLS
	controls.debug.input = createCheckbox('debug', config.debug)
	controls.debug.input.position(10, 780)
	controls.debug.input.changed(function() {
		if (this.checked()) config.debug = true
		else config.debug = false
	})

	controls.paused.input = createCheckbox('pause', config.paused)
	controls.paused.input.position(150, 780)
	controls.paused.input.changed(function() {
		if (this.checked()) config.paused = true
		else config.paused = false
	})

	const updateButton = createButton('update')
	updateButton.position(290, 780)
	updateButton.mousePressed(() => {
		Object.keys(controls).forEach(key => {
			// check for inputs with labels (not checkboxes)
			if (controls[key].label)
				config[key] = parseFloat(controls[key].input.value())
		})
	})

	const resetButton = createButton('reset')
	resetButton.position(355, 780)
	resetButton.mousePressed(() => {
		createFlock()
		background(255)
	})
}

function draw() {
	if (config.debug) background(255)
	if (!config.paused) flock.run(config)
}

function mouseDragged() {
	createBoid(mouseX, mouseY)
}

function keyPressed() {
	if (key == 'P') config.paused = !config.paused
}

function createBoid(x, y) {
	const position = createVector(x || random(0, width), y || random(0, height))
	flock.add(new Boid(position, config))
}

function createFlock() {
	flock = new Flock()
	// var r = (width > height ? height : width) / 2 - 500
  // var cent = createVector(width / 2, height / 2)
	for (var i = 0; i < 100; i++) {
		// to start in circle
		// const position = createVector(
		//   random(cent.x - r, cent.x + r), random(cent.y - r, cent.y + r)
		// )
		createBoid()
	}
}
