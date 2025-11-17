const db = require("../database/config");

async function buscarPainel(idUsuario) {
    const usuarioQuery = `SELECT id_usuario, nome, email, nivel_atual FROM usuario WHERE id_usuario = ${idUsuario}`;
    const usuario = await db.executar(usuarioQuery);

    const quizAtualQuery = `
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
    `;
    const quizAtual = await db.executar(quizAtualQuery);

    const proximoQuizQuery = `
        SELECT q.id_quiz, q.titulo, q.nivel, COUNT(p.id_pergunta) AS total_perguntas
        FROM quiz q
        LEFT JOIN pergunta p ON p.id_quiz = q.id_quiz
        WHERE q.nivel > (SELECT nivel_atual FROM usuario WHERE id_usuario = ${idUsuario})
        GROUP BY q.id_quiz
        ORDER BY q.nivel ASC
        LIMIT 1
    `;
    const proximoQuiz = await db.executar(proximoQuizQuery);

    let recomendacoes = [];
    if (quizAtual.length > 0) {
        const recomendacoesQuery = `
            SELECT id_recomendacao, titulo, tipo, descricao, conteudo, url_recurso
            FROM recomendacao
            WHERE id_quiz = ${quizAtual[0].id_quiz}
        `;
        recomendacoes = await db.executar(recomendacoesQuery);
    }

    return {
        usuario,
        quizAtual,
        proximoQuiz,
        recomendacoes
    };
    
    
}
async function buscarRecomendacoes(idQuiz) {
    const query = `
        SELECT id_recomendacao, titulo, tipo, descricao, conteudo, url_recurso
        FROM recomendacao
        WHERE id_quiz = ${idQuiz}
    `;
    return await db.executar(query);
}

module.exports = { buscarPainel, buscarRecomendacoes };
