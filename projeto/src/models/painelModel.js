var db = require("../database/config");

function buscarPainel(idUsuario) {
    return db.executar(`SELECT id_usuario, nome, email, nivel_atual FROM usuario WHERE id_usuario = ${idUsuario}`)
        .then(function(usuario) {
            return db.executar(`
                SELECT q.id_quiz, q.titulo, q.nivel, COUNT(p.id_pergunta) AS total_perguntas
                FROM quiz q
                LEFT JOIN pergunta p ON p.id_quiz = q.id_quiz
                LEFT JOIN progresso_quiz pq ON pq.quiz_atual = q.id_quiz 
                    AND pq.id_usuario = ${idUsuario} 
                    AND pq.status_progresso = 'pendente'
                GROUP BY q.id_quiz
                ORDER BY 
                    CASE WHEN pq.id_usuario IS NOT NULL THEN 0 ELSE 1 END, 
                    q.nivel ASC
                LIMIT 1
            `).then(function(quizAtual) {
                return db.executar(`
                    SELECT q.id_quiz, q.titulo, q.nivel, COUNT(p.id_pergunta) AS total_perguntas
                    FROM quiz q
                    LEFT JOIN pergunta p ON p.id_quiz = q.id_quiz
                    WHERE q.nivel > (SELECT nivel_atual FROM usuario WHERE id_usuario = ${idUsuario})
                    GROUP BY q.id_quiz
                    ORDER BY q.nivel ASC
                    LIMIT 1
                `).then(function(proximoQuiz) {
                    if (quizAtual.length > 0) {
                        return db.executar(`
                            SELECT id_recomendacao, titulo, tipo, descricao, conteudo, url_recurso
                            FROM recomendacao
                            WHERE id_quiz = ${quizAtual[0].id_quiz}
                        `).then(function(recomendacoes) {
                            return {
                                usuario: usuario,
                                quizAtual: quizAtual,
                                proximoQuiz: proximoQuiz,
                                recomendacoes: recomendacoes
                            };
                        });
                    } else {
                        return {
                        usuario: usuario,
                        quizAtual: quizAtual,
                        proximoQuiz: proximoQuiz,
                        recomendacoes: []
                    };
                }
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
