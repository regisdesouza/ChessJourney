var database = require("../database/config");

function estatistica(idUsuario) {
    var instrucao = `
        SELECT 
            COUNT(*) AS tentativas,
            SUM(CASE WHEN correta = 1 THEN 1 ELSE 0 END) AS acertos
        FROM resposta_usuario
        WHERE id_usuario = ${idUsuario};`

    return database.executar(instrucao);
}

module.exports = {
    estatistica
};
