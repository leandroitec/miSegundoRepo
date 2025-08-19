const { sumar, restar, multiplicar } = require("./math");

// Pruebas con console.assert
console.assert(sumar(2, 3) === 5, "❌ Error en sumar(2, 3)");
console.assert(sumar(-1, 1) === 0, "❌ Error en sumar(-1, 1)");

console.assert(restar(10, 5) === 5, "❌ Error en restar(10, 5)");
console.assert(restar(0, 3) === -3, "❌ Error en restar(0, 3)");

console.assert(multiplicar(4, 5) === 20, "❌ Error en multiplicar(4, 5)");
console.assert(multiplicar(-2, 3) === -6, "❌ Error en multiplicar(-2, 3)");

console.log("✅ Todas las pruebas pasaron correctamente");
