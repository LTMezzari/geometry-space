/*
	***********  Colisão entre retangulos  ************

	var rect1 = {x: 5, y: 5, width: 50, height: 50}
	var rect2 = {x: 20, y: 10, width: 10, height: 10}

	if (rect1.x < rect2.x + rect2.width &&
	   rect1.x + rect1.width > rect2.x &&
	   rect1.y < rect2.y + rect2.height &&
	   rect1.height + rect1.y > rect2.y) {
		// collision detected!
	}

	***********  Colisão entre Circulos  ************

	var circle1 = {radius: 20, x: 5, y: 5};
	var circle2 = {radius: 12, x: 10, y: 5};

	var dx = circle1.x - circle2.x;
	var dy = circle1.y - circle2.y;
	var distance = Math.sqrt(dx * dx + dy * dy);

	if (distance < circle1.radius + circle2.radius) {
		// collision detected!
	}
*/

var Jogo = { //Objeto que controlará o jogo
	score:0, //Pontuação
	level:0, //Level
	isBossLevel:false, //Rodada de boss
	isEndGame:false, //se o jogo acabou
	isPaused:false, //se o jogo está pausado
	isTitleScreen:true, //se o jogo está na tela inicial
	startLives:0, //vidas iniciais do jogador no level
	startEnemies:0, //Quantidade de inimigos no level
	play:function(){ //Função que controla o jogo
		if(!this.isEndGame && !this.isPaused && !this.isTitleScreen)personagem.mover(); //move o personagem
		bullets.forEach(function(item, i){ // testa se os tiros atingiram os inimigos ou as paredes
			bullets[i].hitTarget(blocks);
			if(bullets[i].position[1] < -1 || bullets[i].position[1] > Configuracao.height ||
				 bullets[i].position[0] < -1 || bullets[i].position[0] > Configuracao.width ) bullets.shift(); //Hit the walls
		});
		blocks.forEach(function(item, i){ // testa se o personagem colidiu com algum inimigo
			if(blocks[i].detectColision(personagem)){
				if(!Jogo.isBossLevel)blocks.splice(i, 1);
			}
		});
		if(this.level % 10 == 0 && blocks.length == 0 && this.level != 0 && !this.isBossLevel){ // Se o level for divisivel por 10, então será o round do boss
			this.startBossLevel();
		}else if(blocks.length == 0){//Ve se passou de level
			this.startNextLevel();
		}
		if(personagem.lives < 0)this.endGame(); //Ve se o personagem morreu
		if(this.isBossLevel && !this.isEndGame && !this.isPaused  && !this.isTitleScreen)boss.move(); //Move o boss, se for o level dele
	},
	startGame:function(){ //Inicia o jogo a partir da tela de inicio
		this.isTitleScreen = false;
		document.getElementById("titleScreen").style.visibility = "hidden"; // Esconde a tela inicial
		document.getElementById("btnRestart").style.visibility = "visible"; // Mostra o botão Reiniciar
		document.getElementById("btnPause").style.visibility = "visible"; //Mostra o botão Pausar
		document.getElementById("hud").style.visibility = "visible"; //Mostra o hud
	},
	pauseGame:function(){//Pausa o jogo
		if(this.isEndGame || this.isTitleScreen)return this.isPaused = false;//Se o jogador não morreu, nem está na tela inicial, o jogo pausa
		Jogo.isPaused = !Jogo.isPaused; //Troca o valor da variavel Jogo.isPaused para seu inverso
		document.getElementById("pause").style.visibility = Jogo.isPaused ? "visible" : "hidden";//mostra ou esconde a div "pause"
		document.getElementById("btnPause").innerHTML = Jogo.isPaused ? "Continuar" : "Pausar";//mostra ou esconde o botão pausar
		document.getElementById("btnPause").style.right = Jogo.isPaused ? "47%" : "10px";//coloca o botao pausar no centro da tela, ou no canto superior direito
		document.getElementById("btnPause").style.top = Jogo.isPaused ? "50%" : "50px";//coloca o botao pausar no centro da tela, ou no canto superior direito
		document.getElementById("btnRestart").style.right = Jogo.isPaused ? "46.8%" : "10px";//coloca o botao reiniciar no centro da tela, ou no canto superior direito
		document.getElementById("btnRestart").style.top = Jogo.isPaused ? "57%" : "10px";//coloca o botao reiniciar no centro da tela, ou no canto superior direito
		document.getElementById("btnTitleScreen").style.visibility = Jogo.isPaused ? "visible" : "hidden"; // Troca a visibilidade do botão titleScreen
	},
	startNextLevel:function(){ // Inicia um level normal		
		var rows = Math.random() * Configuracao.width/3; //Escolhe a quantidade de inimigos na tela
		for(var i = 0; i < rows; i++){//Coloca os inimigos na array blocks
			blocks.push(new Block());
		}
		this.level++;//Aumenta o level
		if(this.level != 1){//testa a pontuação do jogador, e determina que ele começa zerado
			this.score += this.isBossLevel ? 2000 : 1000; // Se for level do Boss, o jogador ganha 2000 pontos, se não, 100
			if(personagem.lives == this.startLives){//Se o jogador passar de level sem perder vida, ganha bonus em pontuação e vida
				this.score += 500;
				personagem.lives++;
			}
			this.score += 10 * this.startEnemies;//da 10 pontos por inimigo no level
		}
		personagem.lives += this.isBossLevel ? 5 : 1;//da 1 vida se for round normal, se for round de boss, 5
		boss = ""; //Zera a variavel boss
		this.isBossLevel = false; //bota a variavel isBossLevel para false
		this.startLives = personagem.lives; //atribui o valor inicial de vidas do personagem para futuro calculos de bonus
		this.startEnemies = blocks.length; //atribui a quantidade de inimigos no round para o calculo da pontuação
	},
	startBossLevel:function(){ // Inicia o Round de boss
		this.isBossLevel = true; // isBossLevel recebe true
		blocks.push(boss = new Boss());//adiciona um novo boss à array blocks
	},
	restartGame:function(){//Reinicia o Jogo
		if(this.isPaused)this.pauseGame();//Se o jogo estiver pausado ele reencaminha para a função pauseGame para poder prosseguir
		this.isEndGame = false;//isEnd game recebe false
		document.getElementById("endGame").style.visibility = "hidden";//Esconde a div "endGame"
		document.getElementById("btnTitleScreen").style.visibility = "hidden";//esconde o botão para a tela inicial
		document.getElementById("btnPause").style.visibility = "visible";//Mostra o botão pausar
		document.getElementById("btnRestart").style.right = "10px";//coloca a posição do botao no campo superior direito
		document.getElementById("btnRestart").style.top = "10px";//coloca a posição do botao no campo superior direito
		document.getElementById("canvas").focus(); // Coloca o foco no canvas
		while(blocks.length != 0)blocks.pop(); //Zera a variavel blocks
		while(bullets.length != 0)bullets.pop(); //zera a variavel bullets
		boss = ""; //Zera a variavel Boss
		personagem.die(); //Reseta (Mata) o personagem
		this.score = 0; //zera a pontuação
		this.level = 0; // zera o level
		this.isBossLevel = false; //coloca o valor false para a variavel isBossLevel
		
	},
	endGame:function(){//Mostra a div "endGame" na tela, troca o valor da variavel isEndGame para true e coloca os botões restart e titleScreen na tela, e esconde o botao pausar
		this.isEndGame = true;
		document.getElementById("endGame").style.visibility = "visible";
		document.getElementById("scoreEndGame").innerHTML = "Você Perdeu </br> Pontuação: "+this.score+" pontos.";
		document.getElementById("btnRestart").style.right = "47%";
		document.getElementById("btnRestart").style.top = "57%";
		document.getElementById("btnTitleScreen").style.visibility = "visible";
		document.getElementById("btnPause").style.visibility = "hidden";
	},
	returnToTitleScreen:function(){//retorna para a tela inicial, esconde o hud, esconde os botões pausar, reiniciar, e titleScreen
		if(this.isPaused)this.pauseGame();//Se o jogo estiver pausado ele reencaminha para a função pauseGame para poder prosseguir
		this.restartGame();//"Zera" o jogo
		this.isTitleScreen = true;
		document.getElementById("titleScreen").style.visibility = "visible";
		document.getElementById("btnRestart").style.visibility = "hidden";
		document.getElementById("btnPause").style.visibility = "hidden";
		document.getElementById("hud").style.visibility = "hidden";
	}
};

var Keys = { //KeyCode das teclas
	38:1, // Up
	40:2,// Down
	37:4, // Left
	39:8, // Right

	16:16,// Spacebar = 36
	
	65:4,//A
	87:1,//W
	68:8,//D
	83:2 //S
};

var KeyMap = 0;//Mapeamento dos comandos, permite mais de uma ação ao mesmo tempo(atirar, mover e mirar)

//Declaração das variaveis
var context;

var blocks = [];
var bullets = [];
var personagem;
var boss = "";

var Configuracao = { //Declara as configurações do jogo
	maxWidth:0,//quantidade máxima em largura da tela (px)
	maxHeight:0,//quantidade máxima em altura da tela (px)
	largura:15,//largura dos blocos
	width:0,//quantidade de blocos que cabem na largura
	height:0//quantidade de blocos que cabem na altura
};

function init(){//Inicia o "jogo"
	var objCanvas = document.getElementById("canvas");//cria um objeto do canvas
	if(objCanvas){
		context = objCanvas.getContext("2d");//pega o contexto e define os valores da Configuracao
		Configuracao.maxWidth = objCanvas.width;
		Configuracao.maxHeight = objCanvas.height;
		Configuracao.width = Configuracao.maxWidth / Configuracao.largura;
		Configuracao.height = Configuracao.maxHeight / Configuracao.largura;
		personagem = new Personagem(); //cria um novo personagem
		context.clearRect(0,0,Configuracao.maxWidth,Configuracao.maxHeight);//limpa a tela
		requestAnimationFrame(loop);//inicia o loop do jogo 
	}else{
		 console.log("Contexto não definido");
	}
};

function Block(){//Define a classe Block
	this.velocidade = 0.125;
	this.lives = parseInt(Math.random() * 7);
	this.position = [(parseInt(Math.random() * Configuracao.width)),(parseInt(Math.random() * Configuracao.height))];
	this.invencible = false;
	this.realocate = function(){//Realoca a posição do bloco
		this.position = [(parseInt(Math.random() * Configuracao.width)),(parseInt(Math.random() * Configuracao.height))];
	};
	this.direction = [parseInt(Math.random()*2),parseInt(Math.random()*2)];//Up = 1, Down = 2, Left = 4, Right = 8
	this.detectColision = function(block){//testa se este objeto colidio com o parametro "block"
		if(
			this.position[0] * Configuracao.largura < block.position[0] * Configuracao.largura + Configuracao.largura &&
			this.position[0] * Configuracao.largura + Configuracao.largura > block.position[0] * Configuracao.largura &&
			this.position[1] * Configuracao.largura < block.position[1] * Configuracao.largura + Configuracao.largura &&
			this.position[1] * Configuracao.largura + Configuracao.largura > block.position[1] * Configuracao.largura &&
			!block.invencible
		){
			block.invencible = true;
			block.lives--;
			(function(block){setTimeout(function(){block.invencible = false;},2000)})(block);
			return true;
		}
	};
	this.move = function(){//função que move o objeto de acordo com suas direções (x, y)
		switch(this.direction[1]){
			case 1:
				if(this.position[1] > 0)this.position[1] -= this.velocidade;else this.direction[1]=2;
				break;
			case 2:
				if(this.position[1] < Configuracao.height -1)this.position[1] += this.velocidade;else this.direction[1]=1;
				break;
		}
		switch(this.direction[0]){
			case 1:
				if(this.position[0] > 0)this.position[0] -= this.velocidade;else this.direction[0]=2;
				break;
			case 2:
				if(this.position[0] < Configuracao.width -1)this.position[0] += this.velocidade;else this.direction[0]=1;
				break;
		}
	};
	this.changeDirection = function(){//Calcula se o objeto irá o não trocar de direção
		var change = [Math.random(),Math.random()];
		if(change[0] > 0.5)this.direction[0] = parseInt(Math.random()*2);
		if(change[1] > 0.5)this.direction[1] = parseInt(Math.random()*2);
	};
};

function Personagem(){//Define a classe Personagem
	this.lives = 3;
	this.position = [0,Configuracao.height -1];
	this.mover = function(){//Move o personagem de acordo com as teclas pressionadas
		if(KeyMap & 1){
			if(this.position[1] > 0)this.position[1] -= 0.25;
			if(!(KeyMap & 16))this.direction = 1;//Segurando SHIFT, trava a mira
		}else if(KeyMap & 2){
			if(this.position[1] < Configuracao.height -1)this.position[1] += 0.25;
			if(!(KeyMap & 16))this.direction = 2;//Segurando SHIFT, trava a mira
		}
		
		if(KeyMap & 4){
			if(this.position[0] > 0)this.position[0] -= 0.25;
			if(!(KeyMap & 16))this.direction = 3;//Segurando SHIFT, trava a mira			
		}else if(KeyMap & 8){
			if(this.position[0] < Configuracao.width -1)this.position[0] += 0.25;
			if(!(KeyMap & 16))this.direction = 4;//Segurando SHIFT, trava a mira
		}

	};
	this.die = function(){//Reinicia o personagem
		this.position = [0,Configuracao.height -1];
		this.lives = 3;
	};
};

Personagem.prototype = new Block();//Define a herança das classes

function Bullet(position, direction){//Define a classe Bullet, esta recebe uma direção em ira se mover, e sua posição inicial
	this.position = [position[0]+0.5, position[1]+0.5];
	this.largura = 2.5;
	this.direction = direction;
	this.velocidade = 0.3;
	this.mover = function(){//move o objeto de acordo com sua direção
		switch(this.direction){
			case 2: //Baixo
				this.position[1] += this.velocidade;
				break;
			case 3: //Left
				this.position[0] -= this.velocidade;
				break;
			case 4: //Right
				this.position[0] += this.velocidade;
				break; 
			default: //Cima
				this.position[1] -= this.velocidade;
				break;
		}
	};
	this.hitTarget = function(targets){ //Testa se o objeto acertou o seu "target", essa é uma array
		for(var i = 0; i < targets.length; i++){
			if(
				(this.position[0] * Configuracao.largura >= targets[i].position[0] * Configuracao.largura &&
				this.position[0] * Configuracao.largura <= targets[i].position[0] * Configuracao.largura + Configuracao.largura)
				&&
				((this.position[1] * Configuracao.largura >= targets[i].position[1] * Configuracao.largura &&
				this.position[1] * Configuracao.largura <= targets[i].position[1] * Configuracao.largura + Configuracao.largura))
			){
				if(!targets[i].invencible){
					targets[i].invencible = true;
					targets[i].lives--;
					targets[i].changeDirection();
					if(targets[i].lives < 0) return targets.splice(i, 1);
				}
				(function(i){setTimeout(function(){if(i < targets.length)targets[i].invencible = false;},2000);})(i);
			}
		}
	};
};

function Boss(){//Define a classe Boss
	this.lives = Jogo.level > 50 ? 50 : Jogo.level;//Define as vidas do boss, máximo 50
	this.position = [0,0];
	this.direction = parseInt(Math.random()*3)+1;
	this.isShotting = false;//variavel que testa se o objeto esta atirando ou não
	this.bullets = [];//define a array bullets do boss
	this.move = function(){//Move de acordo com sua direção, ira circular a tela
		switch(this.direction){
			case 1: //Up
				if(this.position[1] > 0)
					this.position[1] -= this.velocidade;
				else if(this.position[1] == 0 && this.position[0] == 0)this.direction = 4;
				else if(this.position[1] == 0 && this.position[0] == Configuracao.width -1)this.direction = 3;
				break;
			case 2: //Down
				if(this.position[1] < Configuracao.height -1)
					this.position[1] += this.velocidade;
				else if(this.position[1] == Configuracao.height-1 && this.position[0] == 0)this.direction = 4;
				else if(this.position[1] == Configuracao.height-1 && this.position[0] == Configuracao.width-1)this.direction= 3;
				break;
			case 3: //Left
				if(this.position[0] > 0)
					this.position[0] -= this.velocidade;
				else if(this.position[0] == 0 && this.position[1] == 0)this.direction = 2;
				else if(this.position[0] == 0 && this.position[1] == Configuracao.height -1)this.direction = 1;
				break;
			default: //Right
				if(this.position[0] < Configuracao.width -1)
					this.position[0] += this.velocidade;
				else if(this.position[0] == Configuracao.width-1 && this.position[1] == 0)this.direction = 2;
				else if(this.position[0] == Configuracao.width-1 && this.position[1] == Configuracao.height-1)this.direction= 1;
				break;
		}
		if(!this.isShotting)this.shot();//se a variavel isShotting for falsa, o objeto atira

		this.bullets.forEach(function(item, i){//testa se os tiros acertaram o alvo (jogador) ou as paredes
			boss.bullets[i].hitTarget([personagem]);
			if(boss.bullets[i].position[1] < -1 || boss.bullets[i].position[1] > Configuracao.height ||
				 boss.bullets[i].position[0] < -1 || boss.bullets[i].position[0] > Configuracao.width ) boss.bullets.shift(); //Hit the walls
		});
	};
	this.shot = function(){//função que faz o objeto atirar de acordo com a sua posição em uma determinada direção 
		this.isShotting = true;

		if(this.position[0] == 0){
			this.bullets.push(new Bullet(this.position, 4));
		}else if(this.position[0] == Configuracao.width -1){
			this.bullets.push(new Bullet(this.position, 3));
		}else if(this.position[1] == 0){
			this.bullets.push(new Bullet(this.position, 2));
		}else this.bullets.push(new Bullet(this.position, 1));

		setTimeout(function(){boss.isShotting = false},500);//Define o intervalo entre cada tiro
	};
}

Boss.prototype = new Block();//Define a herança do Boss com a classe Block

function loop(){//Define o loop do jogo
	preencher();
	Jogo.play();//Função que controla o jogo
	requestAnimationFrame(loop);
};

function preencher(){//pinta os objetos na tela
	context.fillStyle = "#263328";
	context.beginPath();
	context.fillRect(0,0,Configuracao.maxWidth,Configuracao.maxHeight); // Background do jogo
	
	//Personagem
	context.fillStyle = personagem.invencible ? "#b71c1c" : "#f0f4c3";
	context.fillRect(personagem.position[0] * Configuracao.largura, personagem.position[1] * Configuracao.largura, Configuracao.largura, Configuracao.largura);
	
	context.fillStyle = personagem.invencible ? "blue" : "red";

	var path = new Path2D();//Desenha a flecha dentro do personagem dependendo da direção que o personagem esta apontando
	switch(personagem.direction){
		case 2: // Baixo
			path.moveTo((personagem.position[0] * Configuracao.largura), (personagem.position[1] * Configuracao.largura) + Configuracao.largura/2);
			path.lineTo((personagem.position[0] * Configuracao.largura) + Configuracao.largura/2, (personagem.position[1] * Configuracao.largura) + Configuracao.largura);
			path.lineTo((personagem.position[0] * Configuracao.largura) + Configuracao.largura,(personagem.position[1] * Configuracao.largura)+Configuracao.largura/2);
			break;


		case 3: // Esquerda
			path.moveTo((personagem.position[0]*Configuracao.largura)+Configuracao.largura/2, (personagem.position[1]*Configuracao.largura));
			path.lineTo((personagem.position[0]*Configuracao.largura), (personagem.position[1]*Configuracao.largura)+Configuracao.largura/2);
			path.lineTo((personagem.position[0]*Configuracao.largura)+Configuracao.largura/2,(personagem.position[1]*Configuracao.largura)+Configuracao.largura);
			break;


		case 4: // Direita
			path.moveTo((personagem.position[0]*Configuracao.largura)+Configuracao.largura/2, (personagem.position[1]*Configuracao.largura));
			path.lineTo((personagem.position[0]*Configuracao.largura)+Configuracao.largura, (personagem.position[1]*Configuracao.largura)+Configuracao.largura/2);
			path.lineTo((personagem.position[0]*Configuracao.largura)+Configuracao.largura/2,(personagem.position[1]*Configuracao.largura)+Configuracao.largura);
			break;


		default: // Cima
			path.moveTo((personagem.position[0] * Configuracao.largura), (personagem.position[1] * Configuracao.largura) + Configuracao.largura/2);
			path.lineTo((personagem.position[0] * Configuracao.largura) + Configuracao.largura/2, (personagem.position[1] * Configuracao.largura));
			path.lineTo((personagem.position[0] * Configuracao.largura) + Configuracao.largura,(personagem.position[1] * Configuracao.largura)+Configuracao.largura/2);
			break;
	}
	context.fill(path);

	//Blocks
	context.fillStyle = "#ffd600";
	//context.fillText(KeyMap.toString(2),10,10);
	for(var i = 0; i < blocks.length; i++){//loop para pintar os inimigos
		if(!Jogo.isEndGame && !Jogo.isPaused && !Jogo.isTitleScreen)blocks[i].move();//move os inimigos
		context.fillStyle = blocks[i].invencible ? "#ab47bc" : "#e11e4e";
		context.fillRect(blocks[i].position[0] * Configuracao.largura, blocks[i].position[1] * Configuracao.largura, Configuracao.largura, Configuracao.largura);
		context.fillStyle = "#ffd600";
		context.fillText(blocks[i].lives, parseInt(blocks[i].position[0] * Configuracao.largura + 4), parseInt(blocks[i].position[1] * Configuracao.largura +11));
	}
	context.closePath();


	//Bullets
	for(var i = 0; i < bullets.length; i++){//loop para pintar os tiros
		if(!Jogo.isEndGame && !Jogo.isPaused && !Jogo.isTitleScreen)bullets[i].mover();//move os tiros
		context.fillStyle = "#1b5e20";
		context.beginPath();
		context.arc(bullets[i].position[0]*Configuracao.largura, bullets[i].position[1]*Configuracao.largura, bullets[i].largura, 0, 2 * Math.PI);
		context.stroke();
		context.fill();
		context.closePath();
	}

	if(boss != ""){// Desenha os tiros do boss na tela
		for(var i = 0; i < boss.bullets.length; i++){
			if(!Jogo.isEndGame && !Jogo.isPaused && !Jogo.isTitleScreen)boss.bullets[i].mover();//move os tiros do boss
			context.fillStyle = "grey";
			context.beginPath();
			context.arc(boss.bullets[i].position[0]*Configuracao.largura, boss.bullets[i].position[1]*Configuracao.largura, boss.bullets[i].largura, 0, 2 * Math.PI);
			context.stroke();
			context.fill();
			context.closePath();
		}
	}

	//Informações de Jogo
	document.getElementById("score").innerHTML = "Pontos: "+Jogo.score + ".";
	document.getElementById("level").innerHTML = Jogo.isBossLevel ? "Level: Boss Level." : "Level: "+Jogo.level + ".";
	document.getElementById("enemies").innerHTML = "Inimigos Restantes: "+blocks.length + ".";
	document.getElementById("lives").innerHTML = "Vidas Restantes: "+(personagem.lives +1) + ".";
};

document.addEventListener('keydown',function(e){//Evento de tecla pressionada
	var key = e.keyCode ? e.keyCode : e.which;
	if(Keys[key]){
		KeyMap = Keys[key] | KeyMap;
		e.preventDefault();
	}
});

document.addEventListener('keyup',function(e){//Evento de tecla liberada
	var key = e.keyCode ? e.keyCode : e.which;
	if(KeyMap & Keys[key]){
		KeyMap -= Keys[key];
		e.preventDefault();
	}
});

window.onkeydown = function(e,event){//Evento para teclas "unicas"
	if(window.event){
		e=window.event;
	}
	switch(e.keyCode){
		case 32: case 13://Spacebar
			if(bullets.length < 10 && !Jogo.isPaused && !Jogo.isEndGame && !Jogo.isTitleScreen)bullets.push(new Bullet(personagem.position, personagem.direction));
			e.preventDefault();
			break;
		case 80://P
			Jogo.pauseGame();
			e.preventDefault();
			break;
	}	
};

window.onload = init;//roda a função init() quando a página carregar
