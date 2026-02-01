const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let particulas = [];

function ajustarTela() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', ajustarTela);
ajustarTela();

function criarParticula(x, y) {
    return {
        x: x + (Math.random() * 100 - 50),
        y: y,
        tamanho: Math.random() * 5 + 2,
        velY: Math.random() * -1.5 - 0.5,
        vida: 1,
        oscilar: Math.random() * 10
    };
}

function desenharArvore(x, escala) {
    // Agora a árvore nasce sempre baseada no chão (soloY)
    const soloY = canvas.height * 0.85; 
    const alturaArvore = (canvas.height * 0.4) * escala;

    ctx.fillStyle = "#111811";
    ctx.beginPath();
    ctx.moveTo(x - 20, soloY);
    ctx.lineTo(x + 20, soloY);
    ctx.lineTo(x, soloY - alturaArvore);
    ctx.fill();
    
    // Galhos tortos
    ctx.fillRect(x - 30, soloY - (alturaArvore * 0.5), 30, 5);
    ctx.fillRect(x, soloY - (alturaArvore * 0.7), 40, 5);
}

function desenharCenario() {
    const soloY = canvas.height * 0.85; // O chão fica a 85% da altura da tela

    // 1. Árvores (espalhadas proporcionalmente)
    desenharArvore(canvas.width * 0.2, 0.8);
    desenharArvore(canvas.width * 0.5, 1.2);
    desenharArvore(canvas.width * 0.8, 0.9);

    // 2. Lama Orgânica
    ctx.fillStyle = "#20150d";
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(0, soloY);
    ctx.bezierCurveTo(canvas.width * 0.3, soloY - 40, canvas.width * 0.7, soloY + 40, canvas.width, soloY);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.fill();

    // 3. Poça de Radiação
    const px = canvas.width / 2;
    const py = soloY + 10;
    let grad = ctx.createRadialGradient(px, py, 5, px, py, canvas.width * 0.2);
    grad.addColorStop(0, "#39ff14");
    grad.addColorStop(1, "transparent");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(px, py, canvas.width * 0.3, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    if (Math.random() > 0.9) particulas.push(criarParticula(px, py));
}

function updateParticulas() {
    particulas.forEach((p, i) => {
        p.y += p.velY;
        p.x += Math.sin(p.y * 0.05) * 1;
        p.vida -= 0.01;
        ctx.fillStyle = `rgba(57, 255, 20, ${p.vida})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.tamanho, 0, Math.PI * 2);
        ctx.fill();
        if (p.vida <= 0) particulas.splice(i, 1);
    });
}

function loop() {
    ctx.fillStyle = "#0d110d"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    desenharCenario();
    updateParticulas();
    requestAnimationFrame(loop);
}

loop();
