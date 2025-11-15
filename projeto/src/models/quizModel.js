var database = require("../database/config");

async function buscarQuestoesPorNivel(nivel) {
    var instrucaoSql = `
        SELECT 
            p.id_pergunta,
            p.enunciado,
            MAX(CASE WHEN a.id_alternativa = 1 THEN a.texto END) AS alternativaA,
            MAX(CASE WHEN a.id_alternativa = 2 THEN a.texto END) AS alternativaB,
            MAX(CASE WHEN a.id_alternativa = 3 THEN a.texto END) AS alternativaC,
            MAX(CASE WHEN a.id_alternativa = 4 THEN a.texto END) AS alternativaD,
            MAX(CASE WHEN a.correta = TRUE THEN 
                CASE 
                    WHEN a.id_alternativa = 1 THEN 'alternativaA'
                    WHEN a.id_alternativa = 2 THEN 'alternativaB'
                    WHEN a.id_alternativa = 3 THEN 'alternativaC'
                    WHEN a.id_alternativa = 4 THEN 'alternativaD'
                END 
            END) AS correta
        FROM quiz q
        INNER JOIN pergunta p ON p.id_quiz = q.id_quiz
        INNER JOIN alternativa a ON a.id_pergunta = p.id_pergunta
        WHERE q.numero_quiz = ${nivel}
        GROUP BY p.id_pergunta;
    `;
    console.log("Executando SQL: \n" + instrucaoSql);
    return await database.executar(instrucaoSql);
}

module.exports = {
    buscarQuestoesPorNivel
};
