var database = require("../database/config");

function salvarResposta(idUsuario, idPergunta, idAlternativa, correta) {
    var instrucaoSql = `
        INSERT INTO resposta_usuario (id_usuario, id_pergunta, id_alternativa_escolhida, correta)
        VALUES (${idUsuario}, ${idPergunta}, ${idAlternativa}, ${correta});
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    salvarResposta
};