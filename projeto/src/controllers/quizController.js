var quizModel = require("../models/quizModel");
var database = require("../database/config");

async function obterQuiz(req, res) {
    try {
        const idUsuario = req.params.idUsuario;

        const resultadoNivel = await database.executar(
            `SELECT nivel_atual FROM usuario WHERE id_usuario = ${idUsuario};`
        );

        if (resultadoNivel.length === 0) {
            res.status(404).send("Usuário não encontrado");
            return;
        }

        const nivelAtual = resultadoNivel[0].nivel_atual;
        const linhas = await quizModel.buscarQuestoesPorNivel(nivelAtual);

        if (linhas.length === 0) {
            res.status(204).send("Nenhum quiz encontrado para este nível");
            return;
        }

        const quizMontado = {
            titulo: linhas[0].titulo,
            perguntas: []
        };

        const mapaPerguntas = {};

        for (let linha of linhas) {
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

        quizMontado.perguntas = Object.values(mapaPerguntas);

        res.status(200).json(quizMontado);

    } catch (erro) {
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
    }
}

async function enviarResposta(req, res) {
    try {
        let { idUsuario, idPergunta, idAlternativaEscolhida, correta } = req.body;

        if (!idUsuario || !idPergunta || !idAlternativaEscolhida || correta === undefined) {
            res.status(400).send("Parâmetros inválidos");
            return;
        }

        correta = correta ? 1 : 0;

        const instrucaoSql = `
            INSERT INTO resposta_usuario 
            (id_usuario, id_pergunta, id_alternativa_escolhida, correta)
            VALUES (${idUsuario}, ${idPergunta}, ${idAlternativaEscolhida}, ${correta});
        `;

        const resultado = await database.executar(instrucaoSql);
        res.status(201).json(resultado);

    } catch (erro) {
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
    }
}

module.exports = {
    obterQuiz,
    enviarResposta
};
