var quizModel = require("../models/quizModel");
var database = require("../database/config");

function obterQuiz(req, res) {
    var idUsuario = req.params.idUsuario;

    database.executar(
        `SELECT nivel_atual FROM usuario WHERE id_usuario = ${idUsuario};`
    )
    .then(function (resultadoNivel) {

        if (resultadoNivel.length === 0) {
            res.status(404).send("Usuário não encontrado");
            return;
        }

        var nivelAtual = resultadoNivel[0].nivel_atual;

        quizModel.buscarQuestoesPorNivel(nivelAtual)
        .then(function (linhas) {

            if (linhas.length === 0) {
                res.status(204).send("Nenhum quiz encontrado para este nível");
                return;
            }

            var quizMontado = {
                titulo: linhas[0].titulo,
                perguntas: []
            };

            var mapaPerguntas = {};

            for (var i = 0; i < linhas.length; i++) {
                var linha = linhas[i];

                if (!mapaPerguntas[linha.id_pergunta]) {
                    mapaPerguntas[linha.id_pergunta] = {
                        id_pergunta: linha.id_pergunta,
                        enunciado: linha.enunciado,
                        alternativas: []
                    };
                }

                mapaPerguntas[linha.id_pergunta].alternativas.push({
                    id_alternativa: linha.id_alternativa,
                    texto: linha.texto_alternativa,
                    correta: linha.correta ? 1 : 0
                });
            }

            var arrPerguntas = [];
            for (var chave in mapaPerguntas) {
                arrPerguntas.push(mapaPerguntas[chave]);
            }

            quizMontado.perguntas = arrPerguntas;

            res.status(200).json(quizMontado);

        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });

    })
    .catch(function (erro) {
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
    });
}


function enviarResposta(req, res) {
    var idUsuario = req.body.idUsuario;
    var idPergunta = req.body.idPergunta;
    var idAlternativaEscolhida = req.body.idAlternativaEscolhida;
    var correta = req.body.correta;

    if (!idUsuario || !idPergunta || !idAlternativaEscolhida || correta === undefined) {
        res.status(400).send("Parâmetros errados");
        return;
    }

    correta = correta ? 1 : 0;

    var instrucaoSql = `
        INSERT INTO resposta_usuario
        (id_usuario, id_pergunta, id_alternativa_escolhida, correta)
        VALUES (${idUsuario}, ${idPergunta}, ${idAlternativaEscolhida}, ${correta});
    `;

 database.executar(instrucaoSql)
        .then(() => {
            return database.executar(`SELECT id_quiz FROM pergunta WHERE id_pergunta = ${idPergunta};`);
        })
        .then(resultadoQuiz => {
            const idQuiz = resultadoQuiz[0].id_quiz;
            return database.executar(`SELECT COUNT(*) AS total FROM pergunta WHERE id_quiz = ${idQuiz};`)
                .then(totalRes => {
                    return { idQuiz, totalPerguntas: totalRes[0].total };
                });
        })
        .then(({ idQuiz, totalPerguntas }) => {
            return database.executar(`
                SELECT COUNT(*) AS respondidas
                FROM resposta_usuario ru
                JOIN pergunta p ON p.id_pergunta = ru.id_pergunta
                WHERE ru.id_usuario = ${idUsuario} AND p.id_quiz = ${idQuiz};
            `)
            .then(respondidasRes => {
                return { idQuiz, totalPerguntas, respondidas: respondidasRes[0].respondidas };
            });
        })
        .then(({ idQuiz, totalPerguntas, respondidas }) => {
            if (respondidas >= totalPerguntas) {
                return database.executar(`
                    UPDATE progresso_quiz
                    SET status_progresso = 'concluido'
                    WHERE id_usuario = ${idUsuario} AND quiz_atual = ${idQuiz};
                `);
            }
        })
        .then(() => {
            res.status(201).send({ message: "Resposta salva com sucesso!" });
        })
        .catch(erro => {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}
function atualizarNivel(req, res) {
    var idUsuario = req.body.idUsuario;
    var novoNivel = req.body.novoNivel;

    if (!idUsuario || !novoNivel) {
        res.status(400).send("Parâmetros inválidos");
        return;
    }

    database.executar(`
        UPDATE usuario 
        SET nivel_atual = ${novoNivel}
        WHERE id_usuario = ${idUsuario};
    `)
    .then(() => {
        res.status(200).send("Nível atualizado com sucesso!");
    })
    .catch(erro => {
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
    obterQuiz,
    enviarResposta,
    atualizarNivel
};
