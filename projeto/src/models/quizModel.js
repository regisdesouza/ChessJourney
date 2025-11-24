const database = require("../database/config");


function listar(callback) {
    const sql = `SELECT * FROM quiz ORDER BY numero_quiz;`;
    database.executar(sql)
        .then(resultado => callback(null, resultado))
        .catch(erro => callback(erro, null));
}

function carregarQuiz(idQuiz, callback) {
    const sqlQuiz = `SELECT id_quiz, titulo FROM quiz WHERE id_quiz = ${idQuiz};`;

    database.executar(sqlQuiz)
        .then(res1 => {
            if (res1.length === 0) return callback(null, null);

            const sqlPerguntas = `SELECT * FROM pergunta WHERE id_quiz = ${idQuiz};`;

            database.executar(sqlPerguntas)
                .then(perguntas => {
                    if (perguntas.length === 0) {
                        return callback(null, { id_quiz: idQuiz, titulo: res1[0].titulo, perguntas: [] });
                    }

                    let pendentes = perguntas.length;
                    const perguntasComAlternativas = [];

                    perguntas.forEach(p => {
                        const sqlAlternativas = `SELECT * FROM alternativa WHERE id_pergunta = ${p.id_pergunta};`;
                        database.executar(sqlAlternativas)
                            .then(alts => {
                                perguntasComAlternativas.push({
                                    id_pergunta: p.id_pergunta,
                                    enunciado: p.enunciado,
                                    alternativas: alts
                                });

                                pendentes--;
                                if (pendentes === 0) {
                                    callback(null, {
                                        id_quiz: idQuiz,
                                        titulo: res1[0].titulo,
                                        perguntas: perguntasComAlternativas
                                    });
                                }
                            })
                            .catch(erro => callback(erro, null));
                    });
                })
                .catch(erro => callback(erro, null));
        })
        .catch(erro => callback(erro, null));
}


function listarPerguntas(idQuiz, callback) {
    const sql = `SELECT * FROM pergunta WHERE id_quiz = ${idQuiz};`;
    database.executar(sql)
        .then(resultado => callback(null, resultado))
        .catch(erro => callback(erro, null));
}

function listarAlternativas(idPergunta, callback) {
    const sql = `SELECT * FROM alternativa WHERE id_pergunta = ${idPergunta};`;
    database.executar(sql)
        .then(resultado => callback(null, resultado))
        .catch(erro => callback(erro, null));
}

function enviarBusca(idUsuario, idPergunta, id_alternativa_escolhida, correta) {
    const sql = `
        INSERT INTO resposta_usuario
        (id_usuario, id_pergunta, id_alternativa_escolhida, correta)
        VALUES ('${idUsuario}', ${idPergunta}, ${id_alternativa_escolhida}, ${correta})
    `;
    return database.executar(sql);
}


module.exports = {
    listar,
    carregarQuiz,
    listarPerguntas,
    listarAlternativas,
    enviarBusca
};
