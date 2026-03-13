// ==========================================
// environment.js - Static obstacles (walls, shelves)
// ==========================================

class Wall extends PhysicsBody {
    constructor(x, y, width, height) {
        // Paredes con respuesta física sólida
        super(x, y, width, height, 0, true); // mass 0, isStatic true
        this.restitution = 0.4;
    }

    draw(ctx) {
        ctx.fillStyle = '#2c3e50'; 
        // Dibujamos usando la posición central absoluta
        ctx.fillRect(this.position.x - this.width/2, this.position.y - this.height/2, this.width, this.height);
    }
}

class Shelf extends PhysicsBody {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {number} groupID  - ID del grupo de estantería (1-5)
     */
    constructor(x, y, width = 100, height = 350, groupID = 1) {
        super(x, y, width, height, 0, true);
        this.restitution = 0.2;
        this.shakeTimer  = 0;

        // --- Sistema de identidad y daño ---
        this.groupID    = groupID;  // Determina qué spritesheet usar (1 a 5)
        this.health     = 100;      // Puntos de vida (0–100)
        this.stateIndex = 1;        // 1 = intacta, 2 = dañada, 3 = destruida
    }

    /** Recalcula stateIndex a partir de la salud actual */
    _updateState() {
        if      (this.health > 66) this.stateIndex = 1;
        else if (this.health > 33) this.stateIndex = 2;
        else                       this.stateIndex = 3;
    }

    /**
     * Llamado desde game.handleCollisions cuando el jugador impacta.
     * @param {number} magnitude - Intensidad del choque (suma de velocidades en el eje de colisión)
     */
    hit(magnitude) {
        if (magnitude > 3) {
            this.shakeTimer = 10;

            // Efectos de partículas y audio
            if (typeof spawnDebris === 'function') spawnDebris(this.position.x, this.position.y);
            if (window.audioManager) audioManager.playSound('crash');

            // Restar salud proporcional a la fuerza del impacto
            // Un golpe grande (mag ~10) resta ~40 HP; se necesitan 2-3 golpes para destruir
            this.health = Math.max(0, this.health - Math.floor(magnitude * 4));
            this._updateState();

            // Puntos de caos
            if (window.game) game.addChaos(Math.floor(magnitude * 15));
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);

        if (this.shakeTimer > 0) {
            ctx.translate((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6);
            this.shakeTimer--;
        }

        ctx.imageSmoothingEnabled = false;

        // --- Intentar dibujar con sprite ---
        const spriteKey = `${this.groupID}-${this.stateIndex}`;
        const sprites   = window.game && window.game.shelfSprites;
        const img       = sprites && sprites[spriteKey];

        if (img && img.complete && img.width > 0) {
            ctx.drawImage(img, -this.width / 2, -this.height / 2, this.width, this.height);
        } else {
            // --- Fallback procedural (mientras el sprite no esté listo) ---
            // Color del cuerpo varía según daño
            const bodyColors  = ['#5d4037', '#795548', '#4e342e'];
            const borderColors = ['#3e2723', '#4e342e', '#212121'];
            ctx.fillStyle = bodyColors[this.stateIndex - 1];
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

            // Borde superior
            ctx.fillStyle = borderColors[this.stateIndex - 1];
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, 10);

            if (this.stateIndex === 1) {
                // Intacta: productos ordenados
                ctx.fillStyle = '#fbc02d';
                ctx.fillRect(-this.width / 2 + 10, -this.height / 2 + 25, this.width - 20, 40);
                ctx.fillStyle = '#0288d1';
                ctx.fillRect(-this.width / 4, -30, this.width / 2, 60);
                ctx.fillStyle = '#d32f2f';
                ctx.fillRect(-this.width / 2 + 10, this.height / 2 - 60, this.width - 20, 35);
                ctx.fillStyle = 'rgba(255,255,255,0.2)';
                ctx.fillRect(-this.width / 2 + 15, -this.height / 2 + 30, 8, 8);
            } else if (this.stateIndex === 2) {
                // Dañada: productos torcidos y huecos
                ctx.fillStyle = '#f9a825';
                ctx.fillRect(-this.width / 2 + 18, -this.height / 2 + 30, this.width - 40, 35);
                ctx.fillStyle = '#01579b';
                ctx.fillRect(-this.width / 4 + 5, -20, this.width / 2 - 10, 40);
                ctx.fillStyle = '#b71c1c';
                ctx.fillRect(-this.width / 2 + 20, this.height / 2 - 50, this.width - 50, 25);
                // Grieta visual
                ctx.strokeStyle = '#212121';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(0, -this.height / 2);
                ctx.lineTo(-5, 0);
                ctx.lineTo(3, this.height / 2);
                ctx.stroke();
            } else {
                // Destruida: estructura colapsada
                ctx.fillStyle = '#37474f';
                ctx.fillRect(-this.width / 2 + 5, this.height / 2 - 30, this.width - 10, 20);
                ctx.fillStyle = '#d32f2f';
                ctx.fillRect(-this.width / 2 + 8, -this.height / 2 + 60, 12, 12);
                ctx.fillStyle = '#fbc02d';
                ctx.fillRect(this.width / 2 - 20, 10, 14, 14);
                // Cruz de escombros
                ctx.strokeStyle = '#212121';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(-this.width / 2, -this.height / 4);
                ctx.lineTo(this.width / 2, this.height / 4);
                ctx.moveTo(this.width / 2, -this.height / 4);
                ctx.lineTo(-this.width / 2, this.height / 4);
                ctx.stroke();
            }
        }

        ctx.restore();
    }
}
