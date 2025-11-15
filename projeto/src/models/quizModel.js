var database = require("../database/config");

async function buscarQuestoesPorNivel(nivel) {
    var instrucaoSql = `
        SELECT 
            q.titulo,
            p.id_pergunta,
            p.enunciado,
            a.id_alternativa,
            a.texto AS texto_alternativa,
            a.correta
        FROM quiz q
        JOIN pergunta p ON p.id_quiz = q.id_quiz
        JOIN alternativa a ON a.id_pergunta = p.id_pergunta
        WHERE q.numero_quiz = ${nivel}
        ORDER BY p.id_pergunta, a.id_alternativa;
    `;
    return await database.executar(instrucaoSql);
}

module.exports = {
    buscarQuestoesPorNivel
};
