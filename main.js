const config = {
    type: Phaser.AUTO,
    width: 800, height: 450,
    backgroundColor: '#050a08',
    physics: { default: 'arcade', arcade: { gravity: { y: 2200 } } },
    scene: { create: create, update: update }
};

const game = new Phaser.Game(config);

function create() {
    // 1. CHÃO (Retângulo Verde Musgo)
    this.platforms = this.physics.add.staticGroup();
    let groundGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    groundGraphics.fillStyle(0x1a331a, 1);
    groundGraphics.fillRect(0, 0, 800, 50);
    groundGraphics.generateTexture('groundTex', 800, 50);
    this.platforms.create(400, 425, 'groundTex');

    // 2. ROBERTO (Desenhado por código)
    // Criando a textura do Roberto (Corpo Marrom)
    let robGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    robGraphics.fillStyle(0x63412c, 1); // Marrom
    robGraphics.fillRect(0, 10, 40, 40); // Corpo
    robGraphics.fillStyle(0x00ff64, 1); // Olhos Tóxicos
    robGraphics.fillRect(5, 15, 8, 8); 
    robGraphics.fillRect(25, 15, 8, 8);
    // Foice Verde Neon
    robGraphics.lineStyle(4, 0x00ff64, 1);
    robGraphics.strokeCurveComplex(new Phaser.Curves.CubicBezier(new Phaser.Math.Vector2(40, 10), new Phaser.Math.Vector2(60, -20), new Phaser.Math.Vector2(80, 20), new Phaser.Math.Vector2(40, 40)));
    robGraphics.generateTexture('robertoTex', 80, 60);

    this.player = this.physics.add.sprite(100, 300, 'robertoTex');
    this.player.setCollideWorldBounds(true);
    this.player.setDragX(1800);
    this.physics.add.collider(this.player, this.platforms);

    // 3. CONTROLES TÁTEIS (Círculos desenhados)
    this.setupMobileControls();
}

function setupMobileControls() {
    this.moveLeft = false; this.moveRight = false;
    
    // Botão Esquerda
    let btnL = this.add.circle(80, 370, 40, 0x00ff64, 0.2).setInteractive();
    this.add.text(65, 355, '<', { fontSize: '30px' });
    btnL.on('pointerdown', () => this.moveLeft = true).on('pointerup', () => this.moveLeft = false);

    // Botão Direita
    let btnR = this.add.circle(200, 370, 40, 0x00ff64, 0.2).setInteractive();
    this.add.text(185, 355, '>', { fontSize: '30px' });
    btnR.on('pointerdown', () => this.moveRight = true).on('pointerup', () => this.moveRight = false);

    // Botão Pulo (Hollow Knight Feel)
    let btnJ = this.add.circle(700, 370, 50, 0x00ff64, 0.4).setInteractive();
    this.add.text(670, 355, 'JUMP', { fontSize: '20px' });
    btnJ.on('pointerdown', () => { if(this.player.body.touching.down) this.player.setVelocityY(-750); });

    // Botão Ataque (Com Screen Shake)
    let btnA = this.add.circle(580, 370, 50, 0xff0000, 0.4).setInteractive();
    this.add.text(555, 355, 'ATK', { fontSize: '20px' });
    btnA.on('pointerdown', () => {
        this.cameras.main.shake(100, 0.01);
        let dir = this.player.flipX ? -300 : 300;
        this.player.setVelocityX(dir);
    });
}

function update() {
    if (this.moveLeft) {
        this.player.setVelocityX(-320);
        this.player.flipX = true;
    } else if (this.moveRight) {
        this.player.setVelocityX(320);
        this.player.flipX = false;
    }
}
