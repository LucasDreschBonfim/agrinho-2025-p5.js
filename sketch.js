let vegetais = [];

function setup() {
  createCanvas(800, 500);
  textAlign(CENTER, CENTER);
  // Cria 5 vegetais em posições diferentes
  for (let i = 0; i < 5; i++) {
    vegetais.push({
      x: 120 + i * 140,
      y: 320,
      crescimento: 0,    // de 0 até 100
      maxCrescimento: 100,
      regando: false
    });
  }
}

function draw() {
  background(135, 206, 235); // Céu

  // Campo
  fill(34, 139, 34);
  rect(0, 350, width, 150);

  // Sol
  fill(255, 223, 0);
  ellipse(80, 80, 80, 80);

  // Plantação
  fill(139, 69, 19);
  rect(60, 340, 680, 20, 8);

  // Instruções
  fill(0);
  textSize(24);
  text("Clique nos vegetais para regar e fazê-los crescer!", width / 2, 50);

  let todosCrescidos = true;

  // Desenha cada vegetal
  for (let i = 0; i < vegetais.length; i++) {
    let v = vegetais[i];

    // Barra de crescimento
    fill(200);
    rect(v.x - 22, v.y + 45, 44, 12, 5);
    fill(v.crescimento === v.maxCrescimento ? 'limegreen' : 'deepskyblue');
    rect(v.x - 22, v.y + 45, map(v.crescimento, 0, v.maxCrescimento, 0, 44), 12, 5);

    // Vegetal pequeno ou crescido
    if (v.crescimento < v.maxCrescimento) {
      // Pequeno broto
      fill(34, 139, 34);
      ellipse(v.x, v.y + 15, 18, 36);
      fill(139, 69, 19);
      rect(v.x - 4, v.y + 25, 8, 20, 3);
    } else {
      // Vegetal crescido (exemplo: cenoura)
      fill(255, 140, 0);
      ellipse(v.x, v.y + 10, 32, 54);
      fill(34, 139, 34);
      triangle(v.x, v.y - 22, v.x - 10, v.y - 2, v.x + 10, v.y - 2);
    }

    // Efeito regando
    if (v.regando && v.crescimento < v.maxCrescimento) {
      fill(100, 149, 237, 150);
      ellipse(v.x, v.y, 32, 20);
      v.crescimento += 1;
      if (v.crescimento > v.maxCrescimento) v.crescimento = v.maxCrescimento;
    }
    if (v.crescimento < v.maxCrescimento) todosCrescidos = false;
  }

  // Vitória
  if (todosCrescidos) {
    fill(0, 180, 0);
    textSize(32);
    text("Parabéns! Todos os vegetais cresceram!", width/2, 120);
  }
}

function mousePressed() {
  // Verifica se clicou em algum vegetal
  for (let v of vegetais) {
    if (dist(mouseX, mouseY, v.x, v.y+20) < 40 && v.crescimento < v.maxCrescimento) {
      v.regando = true;
    }
  }
}

function mouseReleased() {
  for (let v of vegetais) {
    v.regando = false;
  }
}

