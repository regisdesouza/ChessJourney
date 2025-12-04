var database = require("../database/config");

function estatistica(idUsuario) {
    var instrucao = `
    SELECT * FROM vw_acertos_erros WHERE id_usuario = ${idUsuario};
`

    return database.executar(instrucao);
}


module.exports = {
    estatistica
};
