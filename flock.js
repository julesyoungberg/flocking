class Flock {
  constructor() {
    this.boids = []
  }

  run = ({ debug, withinCircle, ...boidConfig }) => {
    this.boids.forEach(boid => {
      boid.configure(boidConfig)
      boid.run(this.boids, { debug, withinCircle })
    })
  }

  add = boid => this.boids.push(boid)
}
