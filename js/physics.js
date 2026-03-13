// ==========================================
// physics.js - Core AABB collision and resolution
// ==========================================

// Rectangular entity representing physical bodies
class PhysicsBody {
    constructor(x, y, width, height, mass, isStatic = false) {
        this.position = new Vector2(x, y);
        this.width = width;
        this.height = height;
        this.velocity = new Vector2(0, 0);
        this.acceleration = new Vector2(0, 0);
        this.mass = mass;
        this.isStatic = isStatic; // true = won't move (walls, shelves)
        this.restitution = 0.5;   // Bounciness (0 = no bounce, 1 = perfect bounce)
        this.friction = 0.95;     // Velocity damping over time (drag)
        this.angle = 0;           // Rotation in radians
    }

    applyForce(force) {
        if (!this.isStatic) {
            // F = m * a -> a = F / m
            let f = force.div(this.mass);
            this.acceleration = this.acceleration.add(f);
        }
    }

    update(dt) {
        if (!this.isStatic) {
            // Update velocity via acceleration
            this.velocity = this.velocity.add(this.acceleration);
            // Apply friction/drag to simulate inertia
            this.velocity = this.velocity.mult(this.friction);
            // Update position via velocity
            this.position = this.position.add(this.velocity);
            
            // Reset acceleration for next frame
            this.acceleration = new Vector2(0, 0);
        }
    }

    // Abstract bounding box (AABB) getter
    getBounds() {
        return {
            x: this.position.x - this.width / 2,
            y: this.position.y - this.height / 2,
            width: this.width,
            height: this.height,
            left: this.position.x - this.width / 2,
            right: this.position.x + this.width / 2,
            top: this.position.y - this.height / 2,
            bottom: this.position.y + this.height / 2
        };
    }
}

// Simple AABB Collision Detection
function checkAABBCollision(body1, body2) {
    const b1 = body1.getBounds();
    const b2 = body2.getBounds();

    return (
        b1.left < b2.right &&
        b1.right > b2.left &&
        b1.top < b2.bottom &&
        b1.bottom > b2.top
    );
}

// Simple AABB Resolution
// Resolves overlaps and applies bounce (restitution)
function resolveCollision(body1, body2) {
    // Determine the vector between centers
    const dx = body2.position.x - body1.position.x;
    const dy = body2.position.y - body1.position.y;
    
    // Determine the overlaps on both axes
    const b1 = body1.getBounds();
    const b2 = body2.getBounds();
    
    const overlapX = (b1.width / 2 + b2.width / 2) - Math.abs(dx);
    const overlapY = (b1.height / 2 + b2.height / 2) - Math.abs(dy);

    if (overlapX > 0 && overlapY > 0) {
        // Resolve on the axis of least overlap
        if (overlapX < overlapY) {
            // X-axis collision
            const dir = Math.sign(dx);
            if (!body1.isStatic) body1.position.x -= overlapX * dir * (body2.isStatic ? 1 : 0.5);
            if (!body2.isStatic) body2.position.x += overlapX * dir * (body1.isStatic ? 1 : 0.5);
            
            // Calculate bounce (restitution)
            const bounciness = Math.max(body1.restitution, body2.restitution);
            if (!body1.isStatic) body1.velocity.x *= -bounciness;
            if (!body2.isStatic) body2.velocity.x *= -bounciness;

            return { axis: 'x', magnitude: Math.abs(body1.velocity.x) + Math.abs(body2.velocity.x) };

        } else {
            // Y-axis collision
            const dir = Math.sign(dy);
            if (!body1.isStatic) body1.position.y -= overlapY * dir * (body2.isStatic ? 1 : 0.5);
            if (!body2.isStatic) body2.position.y += overlapY * dir * (body1.isStatic ? 1 : 0.5);
            
            // Calculate bounce (restitution)
            const bounciness = Math.max(body1.restitution, body2.restitution);
            if (!body1.isStatic) body1.velocity.y *= -bounciness;
            if (!body2.isStatic) body2.velocity.y *= -bounciness;

            return { axis: 'y', magnitude: Math.abs(body1.velocity.y) + Math.abs(body2.velocity.y) };
        }
    }
    return null;
}
