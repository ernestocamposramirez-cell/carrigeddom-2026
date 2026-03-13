// ==========================================
// powerups.js - Item box pickups
// ==========================================

const POWERUP_TYPES = [
    { type: 'NITRO', color: '#00ffff', text: 'N' },
    { type: 'CHAINSAWS', color: '#ff0000', text: 'C' },
    
    
];

class Pickup {
    constructor(x, y, data) {
        this.position = new Vector2(x, y);
        this.width = 120;
        this.height = 120;
        this.type = data.type;
        this.color = data.color;
        this.text = data.text;
        this.active = true;
        
        // Bobbing animation state
        this.bobTime = randomRange(0, Math.PI * 2);
    }

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

    update(dt) {
        this.bobTime += 0.1;
    }

    draw(ctx) {
        if (!this.active) return;
        
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        
        // Bob up and down
        let yOffset = Math.sin(this.bobTime) * 5;
        ctx.translate(0, yOffset);

        // Intentar usar sprite si existe en el objeto global game
        const sprite = window.game && window.game.pickupSprites && window.game.pickupSprites[this.type];
        
        if (sprite && sprite.complete && sprite.width > 0) {
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(sprite, -this.width/2, -this.height/2, this.width, this.height);
        } else {
            // Box fallback
            ctx.fillStyle = this.color;
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
            ctx.strokeRect(-this.width/2, -this.height/2, this.width, this.height);
            
            // Letter
            ctx.fillStyle = '#000';
            ctx.font = '16px "Press Start 2P"';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.text, 0, 0);
        }
        
        ctx.restore();
    }
}
