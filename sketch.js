let flock
const canvasHeight = 600

const x = { 1: 10, 2: 150, 3: 290, "3.5": 355 }

const getY = n => canvasHeight + n

// config
const config = {
	swt: 25,
	awt: 4,
	cwt: 5,
	sepDist: 35,
	aliDist: 25,
	cohDist: 50,
	maxSpeed: 2,
	maxForce: 0.025,
	boidSize: 1,
	debug: false,
	paused: false,
	withinCircle: true,
	startInCircle: false,
	initialCount: 100,
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
	initialCount: { input: null, label: null },
	debug: { input: null },
	paused: { input: null },
	withinCircle: { input: null },
	startInCircle: { input: null },
}

function setup() {
	createCanvas(windowWidth, canvasHeight)
	colorMode(RGB, 255, 255, 255, 100)

	createFlock()

	smooth()


	// FLOCK CONTROL
	controls.swt.input = createInput(config.swt, 'number')
	controls.swt.input.position(x[1], getY(50))
	controls.swt.label = createElement('label', 'separation weight')
	controls.swt.label.position(x[1], getY(30))

	controls.awt.input = createInput(config.awt, 'number')
	controls.awt.input.position(x[2], getY(50))
	controls.awt.label = createElement('label', 'alignment weight')
	controls.awt.label.position(x[2], getY(30))

	controls.cwt.input = createInput(config.cwt, 'number')
	controls.cwt.input.position(x[3], getY(50))
	controls.cwt.label = createElement('label', 'cohesion weight')
	controls.cwt.label.position(x[3], getY(30))

	controls.sepDist.input = createInput(config.sepDist, 'number')
	controls.sepDist.input.position(x[1], getY(100))
	controls.sepDist.label = createElement('label', 'separation distance')
	controls.sepDist.label.position(x[1], getY(80))

	controls.aliDist.input = createInput(config.aliDist, 'number')
	controls.aliDist.input.position(x[2], getY(100))
	controls.aliDist.label = createElement('label', 'alignment distance')
	controls.aliDist.label.position(x[2], getY(80))

	controls.cohDist.input = createInput(config.cohDist, 'number')
	controls.cohDist.input.position(x[3], getY(100))
	controls.cohDist.label = createElement('label', 'cohesion distance')
	controls.cohDist.label.position(x[3], getY(80))

	// LIMITS CONTROL
	controls.maxSpeed.input = createInput(config.maxSpeed, 'number')
	controls.maxSpeed.input.position(x[1], getY(150))
	controls.maxSpeed.label = createElement('label', 'max speed')
	controls.maxSpeed.label.position(x[1], getY(130))

	controls.maxForce.input = createInput(config.maxForce, 'number')
	controls.maxForce.input.position(x[2], getY(150))
	controls.maxForce.label = createElement('label', 'max force')
	controls.maxForce.label.position(x[2], getY(130))

	controls.boidSize.input = createInput(config.boidSize, 'number')
	controls.boidSize.input.position(x[3], getY(150))
	controls.boidSize.label = createElement('label', 'boid size')
	controls.boidSize.label.position(x[3], getY(130))

	controls.initialCount.input = createInput(config.initialCount, 'number')
	controls.initialCount.input.position(x[3], getY(200))
	controls.initialCount.label = createElement('label', 'initial count')
	controls.initialCount.label.position(x[3], getY(180))

	// GENERAL APPLICATION CONTROLS
	controls.withinCircle.input = createCheckbox('in circle', config.withinCircle)
	controls.withinCircle.input.position(x[1], getY(200))
	controls.withinCircle.input.changed(handleChecked("withinCircle"))

	controls.startInCircle.input = createCheckbox(
		'start in center', config.startInCircle
	)
	controls.startInCircle.input.position(x[2], getY(200))
	controls.startInCircle.input.changed(handleChecked("startInCircle"))

	controls.debug.input = createCheckbox('debug', config.debug)
	controls.debug.input.position(x[1], getY(230))
	controls.debug.input.changed(handleChecked("debug"))

	controls.paused.input = createCheckbox('pause', config.paused)
	controls.paused.input.position(x[2], getY(230))
	controls.paused.input.changed(handleChecked("paused"))

	const updateButton = createButton('update')
	updateButton.position(x[3], getY(230))
	updateButton.mousePressed(updateConfig)

	const resetButton = createButton('restart')
	resetButton.position(x[`3.5`], getY(230))
	resetButton.mousePressed(() => {
		updateConfig()
		createFlock()
		background(255)
	})

	const myDiv = createDiv()
	myDiv.position(x[1], getY(250))
	myDiv.style("height", "25px")
	myDiv.style("visibility", "hidden")
}

function updateConfig() {
	Object.keys(controls).forEach(key => {
		// check for inputs with labels (not checkboxes)
		if (controls[key].label)
			config[key] = parseFloat(controls[key].input.value())
	})
}

function handleChecked(name) {
	return function() {
		if (this.checked()) config[name] = true
		else config[name] = false
	}
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
	let radius, center

	if (config.startInCircle) {
		radius = (width > height ? height : width) / 2 - 500
	  cent = createVector(width / 2, height / 2)
	}

	for (let i = 0; i < config.initialCount; i++) {
		if (config.startInCircle) {
			createBoid(
				random(cent.x - radius, cent.x + radius),
				random(cent.y - radius, cent.y + radius)
			)
		} else {
			createBoid()
		}
	}
}
