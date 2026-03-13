// ==========================================
// utils.js - General utility functions
// ==========================================

// Vector2D class for handling positions, velocities, and forces
class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    sub(v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    mult(n) {
        return new Vector2(this.x * n, this.y * n);
    }

    div(n) {
        return new Vector2(this.x / n, this.y / n);
    }

    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    magSq() {
        return this.x * this.x + this.y * this.y;
    }

    normalize() {
        let m = this.mag();
        if (m !== 0) {
            return this.div(m);
        }
        return new Vector2(0, 0);
    }

    limit(max) {
        if (this.magSq() > max * max) {
            return this.normalize().mult(max);
        }
        return this;
    }

    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    copy() {
        return new Vector2(this.x, this.y);
    }
}

Math.dist2 = function(v, w) { return (v.x - w.x)*(v.x - w.x) + (v.y - w.y)*(v.y - w.y); }
Math.distToSegmentSquared = function(p, v, w) {
  let l2 = Math.dist2(v, w);
  if (l2 === 0) return Math.dist2(p, v);
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.dist2(p, { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) });
};
Math.distToSegment = function(p, v, w) { return Math.sqrt(Math.distToSegmentSquared(p, v, w)); };

// Helper to convert degrees to radians
function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

// Random range helper
function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

// Clamp helper
function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}
