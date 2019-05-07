class Flock {
  constructor() {
    this.boids = []
  }

  run = ({ debug, ...boidConfig }) => {
    this.boids.forEach(boid => {
      boid.configure(boidConfig)
      boid.run(this.boids, debug)
    })
  }

  add = boid => this.boids.push(boid)
}
