var turn = "X";
var actualTaTeTi = -1;


class TaTeTi {
    constructor(contenedor, indiceJuego) {
        this.contenedor = contenedor; // Contenedor del juego (div.ta-te-ti)
        this.celdas = Array.from(this.contenedor.getElementsByClassName('cell')); // Celdas individuales del juego
        this.gameState = 'en curso'; // Estado inicial del juego
        this.recuento = Array(9).fill(null); // Array para llevar el recuento del juego
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
        espacio = this.contenedor.dataset.spaceindex;

        // Verificar si el juego está en curso y si la celda está vacía - y si el tablero es el correcto
        if (this.gameState !== 'en curso' || this.recuento[index] !== null) {
            return;
        }

        //-Guarda el index donde tiene que ser el proximo juego
        if (juegos[index].gameState === 'en curso') {
            actualTaTeTi = index;
        }else{
            actualTaTeTi = -1;
        }
        console.log(actualTaTeTi);
        

        // Marcar la celda con el turno actual
        celda.textContent = turn;
        this.recuento[index] = this.turno;

        // Verificar si hay un ganador o un empate después de la marca
        this.verificarEstado();

        // Cambiar el turno si el juego aún está en curso
            turno = turno === 'X' ? 'O' : 'X';
            document.querySelector('.status').textContent = `Turno del jugador ${this.turno}`;
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
                this.gameState = `${this.recuento[a]}`;
                document.querySelector('.status').textContent = `Juego ${this.indiceJuego + 1}: ${this.gameState}`;
                return;
            }
        }

        // Verificar si todas las celdas están llenas (empate)
        if (!this.recuento.includes(null)) {
            this.gameState = 'Empate';
            document.querySelector('.status').textContent = `Juego ${this.indiceJuego + 1}: ${this.gameState}`;
        }
    }

    // Método para reiniciar el juego
    reiniciar() {
        this.turno = 'X';
        this.gameState = 'en curso';
        this.recuento.fill(null);
        this.celdas.forEach(celda => celda.textContent = '');
        document.querySelector('.status').textContent = `Turno del jugador ${this.turno}`;
    }
}

// Inicializar los 9 juegos independientes de TaTeTi
document.addEventListener('DOMContentLoaded', () => {
    const tableros = document.querySelectorAll('.ta-te-ti');
    juegos = Array.from(tableros).map((tablero, index) => new TaTeTi(tablero, index));

    // Añadir evento para el botón de reinicio
    document.querySelector('.restart').addEventListener('click', () => {
        juegos.forEach(juego => juego.reiniciar());
    });
});