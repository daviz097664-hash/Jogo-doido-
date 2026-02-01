const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Proporção 16:9 para o modo deitado
function resize() {
    canvas.width = 1280; 
    canvas.height = 720;
}
resize();

let particulas = [];

function criarParticula(x, y) {
    return {
        x: x + (Math.random() * 120 - 60),
        y: y,
        tamanho: Math.random() * 5 + 2,
        velY: Math.random() * -1.2 - 0.3,
        vida: 1,
        oscilar: Math.random() * 10
    };
}

function desenharArvore(x, escala) {
    const soloY = 650;
    ctx.fillStyle = "#111811";
    ctx.beginPath();
    ctx.moveTo(x - (20 * escala), soloY);
    ctx.lineTo(x + (20 * escala), soloY);
    ctx.lineTo(x, soloY - (300 * escala)); // Altura baseada na escala
    ctx.fill();
    
    // Galhos extras para não ser um triângulo perfeito
    ctx.fillRect(x - (40 * escala), soloY - (150 * escala), 40 * escala, 10);
    ctx.fillRect(x, soloY - (220 * escala), 50 * escala, 10);
}

function desenharCenario() {
    const soloY = 650;

    // --- Fundo (Árvores em diferentes distâncias) ---
    desenharArvore(200, 0.8);
    desenharArvore(500, 1.2);
    desenharArvore(900, 0.9);
    desenharArvore(1150, 1.1);

    // --- Lama Horizontal Irregular ---
    ctx.fillStyle = "#1a120b";
    ctx.beginPath();
    ctx.moveTo(0, 720);
    ctx.lineTo(0, soloY);
    
    // Ondulações longas para tela deitada
    ctx.bezierCurveTo(300, soloY - 50, 600, soloY + 50, 900, soloY - 20);
    ctx.bezierCurveTo(1000, soloY - 40, 1100, soloY + 20, 1280, soloY);
    
    ctx.lineTo(1280, 720);
    ctx.fill();

    // --- Várias Poças ao longo do caminho ---
    const pocas = [300, 850];
    pocas.forEach(px => {
        let grad = ctx.createRadialGradient(px, soloY + 10, 5, px, soloY + 10, 100);
        grad.addColorStop(0, "#39ff14");
        grad.addColorStop(1, "transparent");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(px, soloY + 10, 150, 30, 0, 0, Math.PI * 2);
        ctx.fill();

        if (Math.random() > 0.9) particulas.push(criarParticula(px, soloY));
    });
}

function updateParticulas() {
    particulas.forEach((p, i) => {
        p.y += p.velY;
        p.x += Math.sin(p.y * 0.04) * 1.5;
        p.vida -= 0.006;
        ctx.fillStyle = `rgba(57, 255, 20, ${p.vida})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.tamanho, 0, Math.PI * 2);
        ctx.fill();
        if (p.vida <= 0) particulas.splice(i, 1);
    });
}

function loop() {
    ctx.fillStyle = "#080a08"; // Céu profundo
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    desenharCenario();
    updateParticulas();
    requestAnimationFrame(loop);
}

loop();
