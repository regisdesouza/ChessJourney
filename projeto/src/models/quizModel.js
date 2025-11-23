var database = require("../database/config");

function buscarQuestoesPorIdQuiz(idQuiz) {
    var query = `
        SELECT 
            q.id_quiz,
            q.titulo AS titulo_quiz,
            p.id_pergunta,
            p.enunciado,
            a.id_alternativa,
            a.texto AS texto_alternativa,
            a.correta
        FROM quiz q
        JOIN pergunta p ON q.id_quiz = p.id_quiz
        JOIN alternativa a ON p.id_pergunta = a.id_pergunta
        WHERE q.id_quiz = ${idQuiz};
    `;
    return database.executar(query);
}

module.exports = {
    buscarQuestoesPorIdQuiz
};
