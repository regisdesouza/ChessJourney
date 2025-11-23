var db = require("../database/config");

function listarQuizzes() {
    const instrucaoSql = `
        SELECT id_quiz, titulo, numero_quiz
        FROM quiz
        ORDER BY numero_quiz ASC
    `;
    return db.executar(instrucaoSql);
}

function listarRecomendacoesPorQuiz(idQuiz) {
    const instrucaoSql = `
        SELECT titulo, tipo, descricao, conteudo, url_recurso
        FROM recomendacao
        WHERE id_quiz = ${idQuiz}
        ORDER BY id_recomendacao ASC
    `;
    return db.executar(instrucaoSql);
}


module.exports = { listarQuizzes, listarRecomendacoesPorQuiz };
