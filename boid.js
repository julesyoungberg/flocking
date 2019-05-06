class Boid {
  constructor(pos, { r, swt, awt, cwt, maxSpeed, maxForce }) {
    this.position = pos
    this.prevPosition = pos.copy()
    this.r = r
    this.velocity = createVector(random(-1, 1), random(-1, 1))
    this.acceleration = createVector()
    this.swt = swt
    this.awt = awt
    this.cwt = cwt
    this.maxSpeed = maxSpeed
    this.maxforce = maxForce
  }

  show = () => {
    const theta = this.velocity.heading() + PI/2
    fill(127)
    stroke(0)
    strokeWeight(1)
    push()
    translate(this.position.x, this.position.y)
    rotate(theta)
    beginShape()
    vertex(0, -this.r*2)
    vertex(-this.r, this.r*2)
    vertex(this.r, this.r*2)
    endShape(CLOSE)
    pop()
  }

  run = (others) => {
    this.flock(others, (dist, other) => {
      if (dist > 0 && dist < 25) {

        stroke(255, 0, 0)

      } else if (dist > 0 && dist < 50) {

        var m = map(dist, 25, 100, 100, 255)
        var n = map(dist, 50, 100, 25, 150)
        stroke(100-n, m - n, 100-n)

      } else {

        stroke(0)
        strokeWeight(0.1)

      }

      if (dist > 0 && dist < 100) line(
        this.position.x, this.position.y, other.position.x, other.position.y
      )
    })

    this.update()
    this.withinCircle()
    // this.borders()
    // this.show()
  }


  // PHYSICS FUNCTIONS
  update = () => {
    this.velocity.add(this.acceleration)
    this.limitVelocity()
    this.prevPosition = this.position.copy()
    this.position.add(this.velocity)
    this.acceleration.mult(0)
  }

  applyForce = force => {
    this.acceleration.add(force)
  }

  distance = other => {
    return p5.Vector.dist(this.position, other.position)
  }


  // BOID STEERING BEHAVIOURS
  limitVelocity = () => {
    if (this.maxSpeed) this.velocity.limit(this.maxSpeed)
    return this.velocity
  }

  limitForce = force => {
    if (this.maxForce) force.limit(this.maxForce)
    return force
  }

  steer = desired => {
    const steer = p5.Vector.sub(desired, this.velocity)
    return this.limitForce(steer)
  }

  seek = target => {
    const desired = p5.Vector.sub(target, this.position)
    desired.setMag(this.maxSpeed)

    return this.steer(desired)
  }

  align = (others, callback, neighborDist = 25) => {
    const sum = createVector()
    let count = 0

    others.forEach(other => {
      const d = this.distance(other)

      if (d > 0 && d < neighborDist) {
        sum.add(other.velocity)
        count++
      }

      if (callback) callback(d, other)
    })

    if (count > 0) {
      sum.div(count)
      sum.setMag(this.maxSpeed)
    }

    return this.steer(sum)
  }

  separate = (others, callback, neighborDist = 35) => {
    const sum = createVector()
    let count = 0

    others.forEach(other => {
      const d = this.distance(other)

      if (d > 0 && d < neighborDist) {
        const diff = p5.Vector.sub(this.position, other.position)
        diff.normalize()
        sum.add(diff)
        count++
      }

      if (callback) callback(d, other)
    })

    if (count > 0) {
      sum.div(count)
      sum.setMag(this.maxSpeed)
    }

    return this.steer(sum)
  }

  cohesion = (others, callback, neighborDist = 50) => {
    const sum = createVector()
    let count = 0

    others.forEach(other => {
      const d = this.distance(other)

      if (d > 0 && d < neighborDist) {
        sum.add(other.position)
        count++
      }

      if (callback) callback(d, other)
    })

    if (count > 0) {
      sum.div(count)
      return this.seek(sum)
    }

    return sum
  }

  flock = (others, callback) => {
    const sep = this.separate(others)
    const ali = this.align(others, callback)
    const coh = this.cohesion(others)

    sep.mult(this.swt)
    ali.mult(this.awt)
    coh.mult(this.cwt)

    this.applyForce(sep)
    this.applyForce(ali)
    this.applyForce(coh)
  }


  // WRAPPING AND CONSTRAINTS
  borders = () => {
    if (this.position.x < -this.r) this.position.x = width + this.r
    if (this.position.y < -this.r) this.position.y = height + this.r
    if (this.position.x > width + this.r) this.position.x = -this.r
    if (this.position.y > height + this.r) this.position.y = -this.r
  }

  withinCircle = () => {
    const circleRadius = (width > height ? height : width) / 2 - 300
    const circlePos = createVector(width / 2, height / 2)

    const predict = this.velocity.copy()
    predict.mult(25)

    const future = p5.Vector.add(this.position, predict)
    const dist = p5.Vector.dist(future, circlePos)

    let desired

    if (dist > circleRadius) {
      const toCenter = p5.Vector.sub(circlePos, this.position)
      toCenter.setMag(this.velocity.mag())

      desired = p5.Vector.add(this.velocity, toCenter)
      // desired.setMag(this.maxSpeed);
    }

    if (desired) this.applyForce(this.steer(desired))
  }

  withinRect = (d) => {
    let desired = null

    if (this.position.x < d) {
      desired = createVector(this.maxSpeed, this.velocity.y)
    } else if (this.position.x > width - d) {
      desired = createVector(-this.maxSpeed, this.velocity.y)
    }

    if (this.position.y < d) {
      desired = createVector(this.velocity.x, this.maxSpeed)
    } else if (this.position.y > height-d) {
      desired = createVector(this.velocity.x, -this.maxSpeed)
    }

    if (desired) {
      desired.normalize()
      desired.mult(this.maxSpeed)
      this.applyForce(this.steer(desired))
    }
  }
}
