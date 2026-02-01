const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 450,
    backgroundColor: '#050a08',
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 2200 }, debug: false }
    },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);

function preload() {
    // Carregando a arte que geramos (ajuste o caminho se necessário)
    this.load.image('roberto', 'Assets/Sprites/Roberto/roberto_concept.png');
    this.load.image('chao', 'https://labs.phaser.io/assets/sprites/platform.png');
}

function create() {
    // 1. Chão com física
    this.platforms = this.physics.add.staticGroup();
    let ground = this.platforms.create(400, 435, 'chao').setScale(3).refreshBody();
    ground.setTint(0x1a331a);

    // 2. Roberto (O Herói)
    this.player = this.physics.add.sprite(100, 200, 'roberto').setScale(0.12);
    this.player.setCollideWorldBounds(true);
    this.player.setDragX(1800); // Para parar instantaneamente
    this.physics.add.collider(this.player, this.platforms);

    // 3. Variáveis de Mecânica Impecável
    this.speed = 320;
    this.jumpForce = -700;
    this.coyoteTime = 0; // Tolerância de queda
    this.jumpBuffer = 0; // Tolerância de clique
    
    // 4. Controles Touch
    this.setupControls();
}

function setupControls() {
    this.moveLeft = false;
    this.moveRight = false;

    // Botão Esquerda
    this.add.text(50, 350, '◀', { fontSize: '60px', fill: '#00ff64' })
        .setInteractive().on('pointerdown', () => this.moveLeft = true).on('pointerup', () => this.moveLeft = false);

    // Botão Direita
    this.add.text(180, 350, '▶', { fontSize: '60px', fill: '#00ff64' })
        .setInteractive().on('pointerdown', () => this.moveRight = true).on('pointerup', () => this.moveRight = false);

    // Botão Pulo
    this.add.circle(700, 370, 40, 0x00ff64, 0.3)
        .setInteractive().on('pointerdown', () => { this.jumpBuffer = 10; });
}

function update(time, delta) {
    // Lógica do Coyote Time
    if (this.player.body.touching.down) {
        this.coyoteTime = 10; // Frames de carência
    } else {
        this.coyoteTime--;
    }

    // Lógica de Pulo (Hollow Knight Feel)
    if (this.jumpBuffer > 0 && this.coyoteTime > 0) {
        this.player.setVelocityY(this.jumpForce);
        this.jumpBuffer = 0;
        this.coyoteTime = 0;
    }
    if (this.jumpBuffer > 0) this.jumpBuffer--;

    // Movimento Horizontal
    if (this.moveLeft) {
        this.player.setVelocityX(-this.speed);
        this.player.flipX = true;
    } else if (this.moveRight) {
        this.player.setVelocityX(this.speed);
        this.player.flipX = false;
    }
}
