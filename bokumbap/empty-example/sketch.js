class ParticleSystem {
  constructor(position) {
    this.origin = position.copy();
    this.particles = [];
  }

  addParticle(x, y) {
    if (x !== undefined && y !== undefined) {
      this.particles.push(new Particle(x, y));
    } else {
      this.particles.push(new Particle(this.origin.x, this.origin.y));
    }
  }

  run() {
    // Run every particle
    // ES6 for..of loop
    for (let particle of this.particles) {
      particle.run();
    }

    // Filter removes any elements of the array that do not pass the test
    this.particles = this.particles.filter(particle => !particle.isDead());
  }

  // A function to apply a force to all Particles
  applyForce(f) {
    for (let particle of this.particles) {
      particle.applyForce(f);
    }
  }

  applyRepeller(r) {
    for (let particle of this.particles) {
      let force = r.repel(particle);
      particle.applyForce(force);
    }
  }

}


class Particle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(random(-1, 1), random(-1, 0));
    this.acceleration = createVector(0, 0);
    this.lifespan = 255.0;
  }

  run() {
    this.update();
    this.display();
  }

  applyForce(f) {
    this.acceleration.add(f);
  }

  // Method to update position
  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.lifespan -= 2;

    this.velocity.limit(5);
  }

  // Method to display
  display() {
    stroke(255, this.lifespan);
    strokeWeight(2);
    fill(255, this.lifespan);
    ellipse(this.position.x, this.position.y, 12, 12);
  }

  // Is the particle still useful?
  isDead() {
    if (this.lifespan < 0.0) {
      return true;
    } else {
      return false;
    }
  }
}

class Repeller {
  constructor(x, y) {
    this.power = 150;
    this.position = createVector(x, y);
  }

  display() {
    stroke(255);
    strokeWeight(2);
    fill(127);
    ellipse(this.position.x, this.position.y, 32, 32);
  }

  repel(p) {
    let dir = p5.Vector.sub(this.position, p.position); // Calculate direction of force
    let d = dir.mag(); // Distance between objects
    dir.normalize(); // Normalize vector (distance doesn't matter here, we just want this vector for direction)
    d = constrain(d, 1, 100); // Keep distance within a reasonable range
    let force = -1 * this.power / (d * d); // Repelling force is inversely proportional to distance
    dir.mult(force); // Get force vector --> magnitude * direction
    return dir;
  }
};


let ps;
let repeller;

function setup() {
  createCanvas(640, 360);
  ps = new ParticleSystem(createVector(width / 2, 50));
  repeller = new Repeller(width / 2, height / 2);
}

function draw() {
  background(51);
  ps.addParticle(mouseX, mouseY);

  // Apply gravity force to all Particles
  let gravity = createVector(0, 0.02);
  ps.applyForce(gravity);

  ps.applyRepeller(repeller);

  repeller.display();
  ps.run();

}