const painelModel = require("../models/painelModel");

function getPainel(req, res) {
    const idUsuario = req.params.id;

    painelModel.listarRecomendacoesPorQuiz(idQuiz)
        .then(dados => {
            if (!dados.usuario || dados.usuario.length === 0) {
                return res.status(404).json({ erro: "Usuário não encontrado" });
            }

            res.json({
                usuario: dados.usuario[0],
                recomendacoes: dados.recomendacoes || []
            });
        })
        .catch(erro => {
            console.log("Erro no painel:", erro);
            res.status(500).json({ erro: "Erro ao carregar painel" });
        });
}

function getRecomendacoes(req, res) {
    const idQuiz = req.params.idQuiz;

    painelModel.buscarRecomendacoes(idQuiz)
        .then(recomendacoes => {
            res.json(recomendacoes);
        })
        .catch(erro => {
            console.log("Erro ao carregar recomendações:", erro);
            res.status(500).json({ erro: "Erro ao carregar recomendações" });
        });
}

module.exports = { getPainel, getRecomendacoes };
