var database = require("../database/config");

function buscarQuestoesPorNivel(nivel) {

    const instrucao = `
        SELECT 
            p.id_pergunta,
            p.enunciado,
            a.id_alternativa,
            a.texto,
            a.correta
        FROM quiz q
        JOIN pergunta p ON p.id_quiz = q.id_quiz
        JOIN alternativa a ON a.id_pergunta = p.id_pergunta
        WHERE q.numero_quiz = ${nivel}
        ORDER BY p.id_pergunta, a.id_alternativa;
    `;

    console.log("Executando SQL:\n" + instrucao);

    return database.executar(instrucao).then(rows => {

        if (rows.length === 0) return [];

        let listaFinal = [];
        let atual = null;
        let contador = 0;

        for (let linha of rows) {

            if (!atual || atual.id_pergunta !== linha.id_pergunta) {
                atual = {
                    id_pergunta: linha.id_pergunta,
                    enunciado: linha.enunciado,
                    alternativaA: "",
                    alternativaB: "",
                    alternativaC: "",
                    alternativaD: "",
                    correta: null
                };
                listaFinal.push(atual);
                contador = 0;
            }

            const letra = ["A", "B", "C", "D"][contador];

            atual[`alternativa${letra}`] = linha.texto;

            if (linha.correta == 1) {
                atual.correta = contador + 1;
            }

            contador++;
        }

        return listaFinal;
    });
}

module.exports = {
    buscarQuestoesPorNivel
};
