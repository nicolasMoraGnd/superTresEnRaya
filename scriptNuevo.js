var turno = "X";
var actualTaTeTi = -1;
let partida = Array(9).fill(null);

class juego{
    constructor(){
        this.gameState = 'en curso'; // Estado inicial del juego
        this.recuento = Array(9).fill(null); // Array para llevar el recuento del juego
    }

    marcarCelda(index){
        this.recuento[index] = turno;
        console.log(this.recuento);
        this.verificarEstado();
        if(megaJuego.gameState !== 'en curso'){
            actualTaTeTi = -2
        }
    }

    verificarEstado() {
        const combinacionesGanadoras = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
            [0, 4, 8], [2, 4, 6]  // Diagonales
        ];

        //to do: poner "or"s con empate para que cuente para ambos
        for (let combinacion of combinacionesGanadoras) {
            const [a, b, c] = combinacion;
            if ((this.recuento[a]) && this.recuento[a] === this.recuento[b] && this.recuento[a] === this.recuento[c]) {
                this.gameState = `${this.recuento[a]}`;
                console.log(this.gameState);
                document.querySelector('.status').textContent = `El ganador es: ${this.gameState}`;
                return;
            }
        }

        // Verificar si todas las celdas están llenas (empate)
        if (!this.recuento.includes(null)) {
            this.gameState = 'Empate';
            //falta lo visual
        }
    }
    reiniciar() {
        this.gameState = 'en curso';
        this.recuento.fill(null);
        actualTaTeTi = -1;
    }
}
//definimos la instancia de la partida actual
const megaJuego = new juego;


// Definir la clase TaTeTi para manejar un juego individual
class TaTeTi extends juego {
    constructor(contenedor, indiceJuego) {
        super();
        this.contenedor = contenedor; // Contenedor del juego (div.ta-te-ti)
        this.celdas = Array.from(this.contenedor.getElementsByClassName('cell')); // Celdas individuales del juego
        this.indiceJuego = indiceJuego; // Índice del juego en el tablero
        

        // Añadir evento de clic a cada celda
        this.celdas.forEach((celda) => {
            celda.addEventListener('click', this.marcarCelda.bind(this));
        });
    }

    // Método para marcar una celda cuando se hace clic
    marcarCelda(event) {
        const celda = event.target;
        const index = parseInt(celda.dataset.index, 10);
        // Verificar si el juego está en curso y si la celda está vacía
        if ((this.gameState !== 'en curso' || this.recuento[index] !== null) || !(this.indiceJuego == actualTaTeTi || actualTaTeTi == -1)) {
            return;
        }

        

        // Marcar la celda con el turno actual
        celda.textContent = turno;
        this.recuento[index] = turno;

        // Verificar si hay un ganador o un empate después de la marca
        this.verificarEstado();
        if (this.gameState !== 'en curso') {
            console.log(this.recuento);
            megaJuego.marcarCelda(this.indiceJuego);
        }

        //guarda el indice del tablero para el proximo turno
        this.contenedor.style.backgroundColor = '#f0f0f0';
        if(juegos[index].gameState === 'en curso'){
            actualTaTeTi = index;
            juegos[actualTaTeTi].contenedor.style.backgroundColor = 'lightblue';
        }else{
            actualTaTeTi = -1;
        }

        // Cambiar el turno si e megaJuego no esta finalizado
        if(megaJuego.gameState === 'en curso'){
            turno = turno === 'X' ? 'O' : 'X';
            document.querySelector('.status').textContent = `Turno del jugador ${turno} en ${actualTaTeTi + 1}`;
        }
        
        
    }

    // Método para verificar el estado del juego
    verificarEstado() {
        const combinacionesGanadoras = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
            [0, 4, 8], [2, 4, 6]  // Diagonales
        ];

        for (let combinacion of combinacionesGanadoras) {
            const [a, b, c] = combinacion;
            if (this.recuento[a] && this.recuento[a] === this.recuento[b] && this.recuento[a] === this.recuento[c]) {
                this.gameState = this.recuento[a];
                document.querySelector('.status').textContent = `Juego ${this.indiceJuego}: ${this.gameState}`;
                this.marcarCuadradoGanado();
                return;
            }
        }

        // Verificar si todas las celdas están llenas (empate)
        if (!this.recuento.includes(null)) {
            this.gameState = 'Empate';
            document.querySelector('.status').textContent = `Juego ${this.indiceJuego + 1}: ${this.gameState}`;
        }
    }

    marcarCuadradoGanado() {
        this.contenedor.classList.add(this.gameState === 'X' ? 'won-x' : 'won-o');
    }

    // Método para reiniciar el juego
    reiniciar() {
        turno = 'X';
        this.gameState = 'en curso';
        this.recuento.fill(null);
        this.celdas.forEach(celda => celda.textContent = '');
        actualTaTeTi = -1;
        this.contenedor.style.backgroundColor = '#f0f0f0';
        document.querySelector('.status').textContent = `Turno del jugador ${turno}`;
    }
}

// Array para almacenar todas las instancias de los tableros de TaTeTi
let juegos = [];

// Inicializar los 9 juegos independientes de TaTeTi
document.addEventListener('DOMContentLoaded', () => {
    const tableros = document.querySelectorAll('.ta-te-ti');
    juegos = Array.from(tableros).map((tablero, index) => new TaTeTi(tablero, index));

    // Añadir evento para el botón de reinicio
    document.querySelector('.restart').addEventListener('click', () => {
        juegos.forEach(juego => juego.reiniciar());
        megaJuego.reiniciar();
    });
    
});
