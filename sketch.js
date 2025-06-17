let vegetais = [];
let dinheiro = 0;
let lojaBotao;
let lojaAberta = false;

// Novo: Tipos de vegetais disponíveis
const TIPOS_VEGETAIS = [
  {
    nome: "Cenoura",
    precoVenda: 10,
    custoPlantio: 5,
    cor: [255, 140, 0], // Laranja
    forma: "ellipse",
    largura: 32,
    altura: 54,
    offsetY: 10 // Posição Y da parte principal
  },
  {
    nome: "Alface",
    precoVenda: 12,
    custoPlantio: 6,
    cor: [124, 252, 0], // Verde-grama
    forma: "folha", // Novo tipo de forma
    largura: 40,
    altura: 40,
    offsetY: 10
  },
  {
    nome: "Tomate",
    precoVenda: 15,
    custoPlantio: 8,
    cor: [255, 69, 0], // Vermelho-alaranjado
    forma: "circulo", // Outro tipo de forma
    largura: 35,
    altura: 35,
    offsetY: 15
  }
];

// Novo: Posições dos canteiros de plantio
const POSICOES_PLANTIO = [];
const NUM_MAX_CANTEIROS = 8; // Aumentamos o número máximo de canteiros

function setup() {
  createCanvas(800, 500);
  textAlign(CENTER, CENTER);

  // Inicializa as posições dos canteiros
  for (let i = 0; i < NUM_MAX_CANTEIROS; i++) {
    POSICOES_PLANTIO.push({
      x: 60 + (i % 4) * 180 + 70, // Ajusta para 4 por linha
      y: 320 + (floor(i / 4) * 80) // Duas linhas de plantio
    });
  }

  // Cria vegetais iniciais em algumas posições
  for (let i = 0; i < min(5, NUM_MAX_CANTEIROS); i++) { // Garante que não crie mais vegetais que canteiros
    vegetais.push(criarVegetal(POSICOES_PLANTIO[i].x, POSICOES_PLANTIO[i].y, TIPOS_VEGETAIS[0])); // Começa com cenouras
  }

  lojaBotao = createButton('Loja');
  lojaBotao.position(width - 100, 20);
  lojaBotao.mousePressed(toggleLoja);
}

function draw() {
  background(135, 206, 235); // Céu

  // Campo
  fill(34, 139, 34);
  rect(0, 350, width, 150);

  // Sol
  fill(255, 223, 0);
  ellipse(80, 80, 80, 80);

  // Plantação (dois retângulos marrons)
  fill(139, 69, 19);
  rect(60, 340, 680, 20, 8); // Primeira linha
  rect(60, 420, 680, 20, 8); // Segunda linha (novo)

  // Instruções
  fill(0);
  textSize(24);
  text("Clique nos vegetais para regar e fazê-los crescer!", width / 2, 50);

  // Exibe o dinheiro
  fill(0);
  textSize(20);
  textAlign(LEFT, TOP);
  text("Dinheiro: R$" + dinheiro, 20, 20);
  textAlign(CENTER, CENTER);

  // Desenha cada vegetal
  for (let i = 0; i < vegetais.length; i++) {
    let v = vegetais[i];
    let tipo = v.tipo; // Pega o tipo de vegetal

    // Barra de crescimento
    fill(200);
    rect(v.x - 22, v.y + 45, 44, 12, 5);
    fill(v.crescimento === v.maxCrescimento ? 'limegreen' : 'deepskyblue');
    rect(v.x - 22, v.y + 45, map(v.crescimento, 0, v.maxCrescimento, 0, 44), 12, 5);

    // Desenho do vegetal baseado no tipo
    if (v.crescimento < v.maxCrescimento) {
      // Pequeno broto (comum para todos)
      fill(34, 139, 34);
      ellipse(v.x, v.y + 15, 18, 36);
      fill(139, 69, 19);
      rect(v.x - 4, v.y + 25, 8, 20, 3);
    } else {
      // Vegetal crescido (desenho diferente para cada tipo)
      fill(tipo.cor[0], tipo.cor[1], tipo.cor[2]); // Usa a cor do tipo

      if (tipo.forma === "ellipse") {
        ellipse(v.x, v.y + tipo.offsetY, tipo.largura, tipo.altura);
        // Desenha as folhas (cenoura)
        fill(34, 139, 34);
        triangle(v.x, v.y - 22, v.x - 10, v.y - 2, v.x + 10, v.y - 2);
      } else if (tipo.forma === "folha") {
        // Desenho de uma alface simples
        ellipse(v.x, v.y + tipo.offsetY, tipo.largura * 1.2, tipo.altura * 1.1);
        ellipse(v.x - 10, v.y + tipo.offsetY + 5, tipo.largura * 0.8, tipo.altura * 0.8);
        ellipse(v.x + 10, v.y + tipo.offsetY + 5, tipo.largura * 0.8, tipo.altura * 0.8);
        fill(34, 139, 34);
        // Pequenas folhas saindo do topo
        ellipse(v.x, v.y - 10, 15, 25);
      } else if (tipo.forma === "circulo") {
        // Desenho de um tomate
        ellipse(v.x, v.y + tipo.offsetY, tipo.largura, tipo.altura);
        fill(34, 139, 34);
        rect(v.x - 2, v.y - 5, 4, 10); // Caule
        ellipse(v.x, v.y - 5, 8, 8); // Pequena folha no topo
      }

      // Botão de venda para vegetais crescidos
      if (!lojaAberta) {
        fill(50, 150, 50);
        rect(v.x - 25, v.y + 60, 50, 20, 5);
        fill(255);
        textSize(12);
        text("Vender", v.x, v.y + 70);
      }
    }

    // Efeito regando
    if (v.regando && v.crescimento < v.maxCrescimento) {
      fill(100, 149, 237, 150);
      ellipse(v.x, v.y, 32, 20);
      v.crescimento += 1;
      if (v.crescimento > v.maxCrescimento) v.crescimento = v.maxCrescimento;
    }
  }

  // Desenha a interface da loja se estiver aberta
  if (lojaAberta) {
    drawLoja();
  }
}

// Função auxiliar para criar um novo objeto vegetal
function criarVegetal(x, y, tipoVegetal) {
  return {
    x: x,
    y: y,
    crescimento: 0,
    maxCrescimento: 100,
    regando: false,
    tipo: tipoVegetal // Armazena o tipo do vegetal
  };
}

// Alterna o estado da loja (abre/fecha)
function toggleLoja() {
  lojaAberta = !lojaAberta;
}

// Desenha a interface da loja
function drawLoja() {
  fill(255, 255, 255, 220); // Fundo semi-transparente da loja
  rect(width / 2 - 200, height / 2 - 150, 400, 300, 15);

  fill(0);
  textSize(28);
  text("Loja de Sementes", width / 2, height / 2 - 120);

  textSize(20);
  text("Dinheiro: R$" + dinheiro, width / 2, height / 2 - 80);

  // Novo: Opções de compra de sementes
  let yOffset = -20;
  for (let i = 0; i < TIPOS_VEGETAIS.length; i++) {
    let tipo = TIPOS_VEGETAIS[i];
    let btnY = height / 2 + yOffset + (i * 50);

    fill(50, 150, 50);
    rect(width / 2 - 120, btnY, 240, 40, 5);
    fill(255);
    textSize(16);
    text(`Comprar Semente de ${tipo.nome} (R$${tipo.custoPlantio})`, width / 2, btnY + 25);
  }
}

function mousePressed() {
  // Lógica de clique na loja
  if (lojaAberta) {
    let yOffset = -20;
    for (let i = 0; i < TIPOS_VEGETAIS.length; i++) {
      let tipo = TIPOS_VEGETAIS[i];
      let btnY = height / 2 + yOffset + (i * 50);
      if (mouseX > width / 2 - 120 && mouseX < width / 2 + 120 &&
          mouseY > btnY && mouseY < btnY + 40) {
        comprarSemente(tipo); // Passa o tipo de vegetal a ser comprado
        return; // Sai da função para não interagir com vegetais abaixo da loja
      }
    }
    return;
  }

  // Lógica original de regar e vender
  for (let i = 0; i < vegetais.length; i++) {
    let v = vegetais[i];
    if (dist(mouseX, mouseY, v.x, v.y + 20) < 40 && v.crescimento < v.maxCrescimento) {
      v.regando = true;
    }
    // Lógica de venda
    if (v.crescimento === v.maxCrescimento && !lojaAberta) {
      if (mouseX > v.x - 25 && mouseX < v.x + 25 &&
          mouseY > v.y + 60 && mouseY < v.y + 80) {
        venderVegetal(i);
      }
    }
  }
}

function mouseReleased() {
  for (let v of vegetais) {
    v.regando = false;
  }
}

// Função para vender um vegetal
function venderVegetal(index) {
  let vegetalVendido = vegetais[index];
  if (vegetalVendido.crescimento === vegetalVendido.maxCrescimento) {
    dinheiro += vegetalVendido.tipo.precoVenda; // Usa o preço de venda do tipo
    vegetais.splice(index, 1); // Remove o vegetal vendido
    console.log(`Vegetal ${vegetalVendido.tipo.nome} vendido! Dinheiro: R$` + dinheiro);
  }
}

// Função para comprar uma semente e replantar
function comprarSemente(tipoParaComprar) {
  // Encontra um espaço vazio para plantar
  if (vegetais.length < NUM_MAX_CANTEIROS) { // Verifica o número total de canteiros
    if (dinheiro >= tipoParaComprar.custoPlantio) { // Verifica se tem dinheiro suficiente para o tipo específico
      dinheiro -= tipoParaComprar.custoPlantio;
      let novaPosicao = null;
      let posicoesOcupadas = vegetais.map(v => ({ x: v.x, y: v.y }));

      // Encontra a primeira posição de plantio disponível
      for (let i = 0; i < POSICOES_PLANTIO.length; i++) {
        let ocupada = false;
        for (let j = 0; j < posicoesOcupadas.length; j++) {
          if (posicoesOcupadas[j].x === POSICOES_PLANTIO[i].x &&
              posicoesOcupadas[j].y === POSICOES_PLANTIO[i].y) {
            ocupada = true;
            break;
          }
        }
        if (!ocupada) {
          novaPosicao = POSICOES_PLANTIO[i];
          break;
        }
      }

      if (novaPosicao) {
        vegetais.push(criarVegetal(novaPosicao.x, novaPosicao.y, tipoParaComprar));
        console.log(`Semente de ${tipoParaComprar.nome} comprada! Dinheiro: R$` + dinheiro);
      } else {
        alert("Erro: Nenhuma posição de plantio disponível encontrada.");
      }
    } else {
      alert("Você não tem dinheiro suficiente para comprar uma semente de " + tipoParaComprar.nome + "!");
    }
  } else {
    alert("Não há espaço disponível para plantar mais vegetais!");
  }
}


// Função para desenhar a interface da loja
function drawLoja() {
  // Apenas mude esta linha:
  fill(50, 50, 50, 220); // Fundo da loja: Cinza escuro (R, G, B, Alpha)
  rect(width / 2 - 200, height / 2 - 150, 400, 300, 15);

  fill(255); // Altera a cor do texto para branco para maior contraste
  textSize(28);
  text("Loja de Sementes", width / 2, height / 2 - 120);

  textSize(20);
  text("Dinheiro: R$" + dinheiro, width / 2, height / 2 - 80);

  let yOffset = -20;
  for (let i = 0; i < TIPOS_VEGETAIS.length; i++) {
    let tipo = TIPOS_VEGETAIS[i];
    let btnY = height / 2 + yOffset + (i * 50);

    fill(50, 150, 50); // Cor dos botões de compra permanece verde
    rect(width / 2 - 120, btnY, 240, 40, 5);
    fill(255); // Cor do texto dos botões para branco
    textSize(16);
    text(`Comprar Semente de ${tipo.nome} (R$${tipo.custoPlantio})`, width / 2, btnY + 25);
  }
}