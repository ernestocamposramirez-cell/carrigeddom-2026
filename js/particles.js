// ==========================================
// particles.js - Simple visual debris
// ==========================================

class Particle {
    constructor(x, y, color, life, speedX, speedY, size) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.life = life;
        this.maxLife = life;
        this.vx = speedX;
        this.vy = speedY;
        this.size = size;
        this.friction = 0.92;
    }

    update(dt) {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.life--;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.life / this.maxLife);
        ctx.fillStyle = this.color;
        
        ctx.translate(this.x, this.y);
        // Spin slowly based on velocity
        ctx.rotate((this.vx + this.vy) * 0.1); 
        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
        
        ctx.restore();
    }
}

// Global particle array handled by the game loop
let globalParticles = [];

function spawnDebris(x, y) {
    for (let i = 0; i < 5; i++) {
        let colors = ['#8B4513', '#ffcc00', '#00ccff', '#ff0033', '#ccc'];
        let c = colors[Math.floor(Math.random() * colors.length)];
        globalParticles.push(new Particle(
            x, y, c, 
            randomRange(30, 60), 
            randomRange(-5, 5), randomRange(-5, 5), 
            randomRange(4, 10)
        ));
    }
}

function spawnSparks(x, y, isBlood = false) {
    for (let i = 0; i < 8; i++) {
        let color = isBlood ? '#aa0000' : '#ffff00';
        globalParticles.push(new Particle(
            x, y, color, 
            randomRange(10, 30), 
            randomRange(-8, 8), randomRange(-8, 8), 
            randomRange(2, 5)
        ));
    }
}

function spawnSmoke(x, y) {
    globalParticles.push(new Particle(
        x + randomRange(-5, 5), 
        y + randomRange(-5, 5), 
        'rgba(200, 200, 200, 0.5)', 
        randomRange(15, 40), 
        0, 0, 
        randomRange(10, 20)
    ));
}
