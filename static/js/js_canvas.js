
// Variables para dimensiones para canvas
var canvasWidth = 600;
var canvasHeight = 400;
//Contenedor del elemento canvas
var container = document.getElementById("container");

var gameCanvas = {
    canvas: document.getElementById("canvas"), //Objeto canvas de html
    start: function(){
        this.canvas.width = canvasWidth; //Asignar anchura de lienza canvas
        this.canvas.height = canvasHeight;//Asignar altura de lienza canvas
        this.context = this.canvas.getContext("2d");
        container.appendChild(this.canvas, container.childNodes[0]);//Añadir elemento canvas al contenedor
    }
};
/*
    Variables para player
*/
var player;
var playerYPosition = 200; //Posicion de jugador en el eje vertical

/*
    Variables y para añadir efecto de gravedad a elemento player
*/
var fallSpeed = 0; //Variable para  velocidad de caida
var interval = setInterval(updateCanvas, 20); //Crear nuevo intervalo

/*
    Variables para efecto de salto
*/
var isJumping = false; //Propiedad booleana para saber si esta saltando o no
var jumpSpeed = 0; //Para determinar velocidad de salto

/*
    Variable para crear bloque de ataque
*/
var block;

/*
    Variables para puntuacion
*/
var score = 0;
var scoreLabel;

//Esta funcion es la que será llamada en el archivo html
function startGame(){
    gameCanvas.start();
    //Creamos nuestro player usando la funcion correspondiente
    player = new createPlayer(30, 30, 10);
    //Creamos bloque de ataque
    block = new createBlock();
    //Creamos elemento score
    scoreLabel = new createScoreLabel(10, 30);
}

//Funcion para construir el elemento player
function createPlayer(width, height, x){
    //variables constructoras de elemento jugador
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = playerYPosition;

    //Creamos una funcion draw para dibujar elemento player en el lienzo canvas
    this.draw = function(){
        ctx = gameCanvas.context;
        ctx.fillStyle = "black"; 
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };

    //Creamos una funcion makefall (para efecto de caida del objeto)
    this.makeFall = function(){
        if(!isJumping){
            this.y += fallSpeed;
            fallSpeed += 0.1;
    
            //Llamer a la funcion stopPlayer
            this.stopPlayer();
        }
    };

    //Creamos una funcion stopPlayer para hacer que el objeto se detenga al llegar al punto inicial
    this.stopPlayer = function(){
        var ground = canvasHeight - this.height; //Identificamos como 'ground' al limite del eje horizontal inferior del lienzo
        if(this.y > ground){//Si el objeto no se encuentra en el suelo, se lo hace 'caer'
            this.y = ground;
        }
    };

    //Funcion jump
    this.jump = function(){
        if(isJumping){
            this.y -= jumpSpeed;
            jumpSpeed += 0.3;
        }
    };
}

//Funcion para actualizar la ubicacion de nuestro jugador en el lienzo y hacer que caiga
function updateCanvas(){
    detectCollision();

    ctx = gameCanvas.context;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    //Llamamos a funciones creadas en el elemento player (funciones createPlayer())
    player.makeFall();
    player.draw();
    player.jump();

    //Llamamos a funciones creadas en el elemento block (funcion createBlock())
    block.draw();
    block.attackPlayer();

    //Llamamos a funciones creadas en el elemento score (createScoreLabel())
    scoreLabel.text = "Score: "+score;
    scoreLabel.draw();
}

/*
    Añadirmos funcionalidad a nuestro juego
    - Permitir que nuestro jugador salte cuando presionamos la barra espaciadora
*/

function resetJump(){
    jumpSpeed = 0;
    isJumping = false;
}

/*
    Creacion de bloques de ataque
*/
function createBlock(){
    var width = randomNumber(10, 50);
    var height = randomNumber(10, 200);
    var speed = randomNumber(2,6);

    this.x = canvasWidth;
    this.y = canvasHeight - height;

    this.draw = function(){
        ctx = gameCanvas.context;
        ctx.fillStyle = "red"; 
        ctx.fillRect(this.x, this.y, width, height);
    };
    
    //Funcion para dar movimiento a attack player
    this.attackPlayer = function(){
        this.x -= speed;
        this.returnToAttackPosition();
    };
    //Funcion para regresar elemento a la posicion iniciar
    this.returnToAttackPosition = function(){
        if(this.x < 0){
             width = randomNumber(10, 50);
             height = randomNumber(10, 200);
             speed = randomNumber(4,6);

             this.x = canvasWidth;
             this.y = canvasHeight - height;

             score = score + 1;
        }
    };
}

function randomNumber(min, max){
   return Math.floor(Math.random() * (max - min + 1) + min);
}

/*
    Creamos funcion para deteactar colisiones
*/
function detectCollision(){
    //Extremos de elemento player
    var playerLeft = player.x;
    var playerRight = player.x + player.width;
    //Extremos de elemento block
    var blockLeft = block.x;
    var blockRight = block.x + block.width;

    //Base de elemento jugador
    var playerBottom = player.y + player.height;
    //Parte superior de elemento block
    var blockTop = block.y;

    //Detener juego si hay colision
    if(playerRight > blockLeft &&
        playerLeft < blockLeft &&
        playerBottom > blockTop){
        gameCanvas.stop();
    }
}

function createScoreLabel(x, y){
    this.score = 0;
    this.x = x;
    this.y = y;

    this.draw = function(){
        ctx = gameCanvas.context;
        ctx.font = "25px Marker Felt";
        ctx.fillStyle = "black"; 
        ctx.fillText(this.text, this.x, this.y);
    };
}


document.body.onkeyup = function(e){
    if(e.keyCode == 32){
        isJumping = true; //Alternamos el valor del booleano una vez que presionamos la tecla
        setTimeout(function(){
            resetJump();
        }, 1000);
    }
};


