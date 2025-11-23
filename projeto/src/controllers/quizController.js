var quizModel = require("../models/quizModel");
var database = require("../database/config");

function obterQuiz(req, res) {
    var idUsuario = req.params.idUsuario;
    var idQuiz = req.query.idQuiz;

    if (!idQuiz) {
        return res.status(400).json({ erro: "Parâmetro idQuiz é obrigatório" });
    }

    montarQuiz(idQuiz, res);
}

function montarQuiz(idQuiz, res) {
    quizModel.buscarQuestoesPorIdQuiz(idQuiz)
        .then(function(linhas) {
            if (!linhas || linhas.length === 0) {
                return res.status(404).json({ erro: "Nenhum quiz encontrado" });
            }

            var quizMontado = {
                titulo: linhas[0].titulo || "Título não disponível",
                perguntas: []
            };

            var mapaPerguntas = [];

            linhas.forEach(linha => {
                if (!linha.id_pergunta) return;
                var existente = mapaPerguntas.find(p => p.id_pergunta == linha.id_pergunta);
                if (!existente) {
                    existente = {
                        id_pergunta: linha.id_pergunta,
                        enunciado: linha.enunciado || "",
                        alternativas: []
                    };
                    mapaPerguntas.push(existente);
                }
                existente.alternativas.push({
                    id_alternativa: linha.id_alternativa,
                    texto: linha.texto_alternativa || "",
                    correta: linha.correta ? 1 : 0
                });
            });

            quizMontado.perguntas = mapaPerguntas;
            res.status(200).json(quizMontado);
        })
        .catch(erro => {
            console.log(erro);
            res.status(500).json({ erro: "Erro ao montar quiz" });
        });
}

function enviarResposta(req, res) {
    var { idUsuario, idPergunta, idAlternativaEscolhida, correta } = req.body;

    if (!idUsuario || !idPergunta || !idAlternativaEscolhida || correta === undefined) {
        return res.status(400).json({ erro: "Parâmetros inválidos" });
    }

    correta = correta ? 1 : 0;

    database.executar(`
        INSERT INTO resposta_usuario
        (id_usuario, id_pergunta, id_alternativa_escolhida, correta)
        VALUES (${idUsuario}, ${idPergunta}, ${idAlternativaEscolhida}, ${correta});
    `).then(() => {
        res.status(201).json({ message: "Resposta salva com sucesso" });
    }).catch(erro => {
        console.log(erro);
        res.status(500).json({ erro: "Erro ao salvar resposta" });
    });
}

function finalizarQuiz(req, res) {
    var idUsuario = req.body.idUsuario;
    var acertos = Number(req.body.acertos);
    var total = Number(req.body.total_perguntas);

    if (!idUsuario || isNaN(acertos) || isNaN(total)) {
        return res.status(400).json({ erro: "Dados do quiz ou usuário faltando" });
    }

    var minimo = total * 0.6;

    res.json({
        message: acertos >= minimo ? "Parabéns! Quiz concluído." : "Quiz finalizado, mas você não atingiu o mínimo de acertos."
    });
}

module.exports = {
    obterQuiz,
    enviarResposta,
    finalizarQuiz
};
