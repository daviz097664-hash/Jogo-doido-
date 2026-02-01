const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 450,
    backgroundColor: '#050a08',
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 2200 }, debug: false }
    },
    scene: { create: create, update: update }
};

const game = new Phaser.Game(config);

function create() {
    // --- CRIANDO O CHÃO POR CÓDIGO ---
    let graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0x1a331a, 1);
    graphics.fillRect(0, 0, 800, 50);
    graphics.generateTexture('chao', 800, 50);

    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 425, 'chao');

    // --- CRIANDO O ROBERTO POR CÓDIGO ---
    let robGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    // Corpo
    robGraphics.fillStyle(0x63412c, 1);
    robGraphics.fillRect(0, 0, 40, 40);
    // Olhos
    robGraphics.fillStyle(0x00ff64, 1);
    robGraphics.fillRect(8, 10, 8, 8);
    robGraphics.fillRect(24, 10, 8, 8);
    // Foice (Linha simples para não travar)
    robGraphics.lineStyle(5, 0x00ff64, 1);
    robGraphics.lineBetween(40, 20, 60, 0);
    
    robGraphics.generateTexture('roberto', 70, 40);

    this.player = this.physics.add.sprite(100, 300, 'roberto');
    this.player.setCollideWorldBounds(true);
    this.player.setDragX(1800);
    
    this.physics.add.collider(this.player, this.platforms);

    // --- CONTROLES ---
    this.moveLeft = false;
    this.moveRight = false;

    // Botões visíveis para teste
    let btnL = this.add.circle(100, 350, 40, 0x00ff64, 0.3).setInteractive();
    let btnR = this.add.circle(250, 350, 40, 0x00ff64, 0.3).setInteractive();
    let btnJ = this.add.circle(700, 350, 50, 0x00ff64, 0.5).setInteractive();

    btnL.on('pointerdown', () => this.moveLeft = true).on('pointerup', () => this.moveLeft = false);
    btnR.on('pointerdown', () => this.moveRight = true).on('pointerup', () => this.moveRight = false);
    btnJ.on('pointerdown', () => { if(this.player.body.touching.down) this.player.setVelocityY(-800); });
}

function update() {
    if (this.moveLeft) {
        this.player.setVelocityX(-350);
        this.player.flipX = true;
    } else if (this.moveRight) {
        this.player.setVelocityX(350);
        this.player.flipX = false;
    }
}
