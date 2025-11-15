var database = require("../database/config");

function buscarQuizPorUsuario(idUsuario) {
    var instrucaoSql = `SELECT * FROM quiz WHERE fk_usuario = ${idUsuario};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrar(descricao, idUsuario) {
    var instrucaoSql = `INSERT INTO quiz (descricao, fk_usuario) VALUES ('${descricao}', ${idUsuario});`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarQuizPorUsuario,
    cadastrar
};