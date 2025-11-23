var db = require("../database/config");

function buscarPainel(idUsuario) {
    return db.executar(`SELECT id_usuario, nome, email FROM usuario WHERE id_usuario = ${idUsuario}`)
        .then(function(usuario) {
            return db.executar(`
                SELECT q.id_quiz, q.titulo, q.numero_quiz, COUNT(p.id_pergunta) AS total_perguntas
                FROM quiz q
                LEFT JOIN pergunta p ON p.id_quiz = q.id_quiz
                GROUP BY q.id_quiz
                ORDER BY q.numero_quiz ASC
            `).then(function(quizzes) {
                return db.executar(`
                    SELECT id_recomendacao, titulo, tipo, descricao, conteudo, url_recurso, id_quiz
                    FROM recomendacao
                `).then(function(recomendacoes) {
                    return {
                        usuario: usuario,
                        quizzes: quizzes,
                        recomendacoes: recomendacoes
                    };
                });
            });
        });
}

function buscarRecomendacoes(idQuiz) {
    return db.executar(`
        SELECT id_recomendacao, titulo, tipo, descricao, conteudo, url_recurso
        FROM recomendacao
        WHERE id_quiz = ${idQuiz}
    `);
}

module.exports = { buscarPainel, buscarRecomendacoes };
