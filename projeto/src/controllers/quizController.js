var quizModel = require("../models/quizModel");
var database = require("../database/config");

function obterQuiz(req, res) {
    var idUsuario = req.params.idUsuario;

    database.executar(`SELECT nivel_atual FROM usuario WHERE id_usuario = ${idUsuario};`)
    .then(resultadoNivel => {
        if (resultadoNivel.length === 0) {
            res.status(404).send("Usuário não encontrado");
            return;
        }

        var nivelAtual = resultadoNivel[0].nivel_atual;

        quizModel.buscarQuestoesPorNivel(nivelAtual)
        .then(linhas => {
            if (linhas.length === 0) {
                res.status(204).send("Nenhum quiz encontrado para este nível");
                return;
            }

            var quizMontado = { titulo: linhas[0].titulo, perguntas: [] };
            var mapaPerguntas = [];

            for (var i = 0; i < linhas.length; i++) {
                var linha = linhas[i];
                var existente = null;
                for (var j = 0; j < mapaPerguntas.length; j++) {
                    if (mapaPerguntas[j].id_pergunta == linha.id_pergunta) {
                        existente = mapaPerguntas[j];
                        break;
                    }
                }
                if (!existente) {
                    existente = { id_pergunta: linha.id_pergunta, enunciado: linha.enunciado, alternativas: [] };
                    mapaPerguntas.push(existente);
                }
                existente.alternativas.push({
                    id_alternativa: linha.id_alternativa,
                    texto: linha.texto_alternativa,
                    correta: linha.correta ? 1 : 0
                });
            }

            for (var k = mapaPerguntas.length - 1; k > 0; k--) {
                var r = Math.random() * (k + 1);
                r = r - (r % 1);
                var temp = mapaPerguntas[k];
                mapaPerguntas[k] = mapaPerguntas[r];
                mapaPerguntas[r] = temp;
            }

            var perguntasLimitadas = [];
            var qCount = mapaPerguntas.length < 5 ? mapaPerguntas.length : 5;
            for (var l = 0; l < qCount; l++) perguntasLimitadas.push(mapaPerguntas[l]);

            quizMontado.perguntas = perguntasLimitadas;
            res.status(200).json(quizMontado);

        }).catch(erro => { console.log(erro); res.status(500).json(erro.sqlMessage); });
    }).catch(erro => { console.log(erro); res.status(500).json(erro.sqlMessage); });
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

    database.executar(`
        INSERT INTO resposta_usuario
        (id_usuario, id_pergunta, id_alternativa_escolhida, correta)
        VALUES (${idUsuario}, ${idPergunta}, ${idAlternativaEscolhida}, ${correta});
    `)
    .then(() => res.status(201).send({ message: "Resposta salva com sucesso!" }))
    .catch(erro => { console.log(erro); res.status(500).json(erro.sqlMessage); });
}

function atualizarNivel(req, res) {
    var idUsuario = req.body.idUsuario;
    var novoNivel = req.body.novoNivel;

    if (!idUsuario || !novoNivel) { res.status(400).send("Parâmetros inválidos"); return; }

    database.executar(`UPDATE usuario SET nivel_atual = ${novoNivel} WHERE id_usuario = ${idUsuario};`)
    .then(() => res.status(200).send("Nível atualizado com sucesso!"))
    .catch(erro => { console.log(erro); res.status(500).json(erro.sqlMessage); });
}

function finalizarQuiz(req, res) {
    var idUsuario = req.body.idUsuario;

    if (!idUsuario) {
        res.status(400).send("Parâmetros inválidos");
        return;
    }

    database.executar(`
        SELECT pq.quiz_atual, COUNT(p.id_pergunta) AS total_perguntas,
               SUM(ru.correta) AS acertos
        FROM progresso_quiz pq
        JOIN pergunta p ON p.id_quiz = pq.quiz_atual
        LEFT JOIN resposta_usuario ru ON ru.id_pergunta = p.id_pergunta AND ru.id_usuario = ${idUsuario}
        WHERE pq.id_usuario = ${idUsuario} AND pq.status_progresso = 'pendente'
        GROUP BY pq.quiz_atual
    `).then(result => {
        if (result.length === 0) {
            res.status(404).send("Nenhum quiz pendente encontrado");
            return;
        }

        var quizAtual = result[0];
        var total = quizAtual.total_perguntas;
        var acertos = quizAtual.acertos || 0;
        var minimo = total * 6 / 10;
        var quizConcluido = false;
        var novoNivel = null;

        if (acertos >= minimo) {
            novoNivel = quizAtual.quiz_atual - 0 + 1;
            quizConcluido = true;
            database.executar(`UPDATE usuario SET nivel_atual = ${novoNivel} WHERE id_usuario = ${idUsuario};`);
        }

        database.executar(`
            UPDATE progresso_quiz
            SET status_progresso = 'concluido'
            WHERE id_usuario = ${idUsuario} AND quiz_atual = ${quizAtual.quiz_atual};
        `).then(() => res.json({ quizConcluido, novoNivel }));
    }).catch(erro => { console.log(erro); res.status(500).json({ erro: erro.sqlMessage }); });
}

module.exports = {
    obterQuiz,
    enviarResposta,
    atualizarNivel,
    finalizarQuiz
};
