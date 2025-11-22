const painelModel = require("../models/painelModel");

function getPainel(req, res) {
    const idUsuario = req.params.id;

    painelModel.buscarPainel(idUsuario)
        .then(function(resultado) {
            res.json(resultado);
        })
        .catch(function(erro) {
            console.log("Erro ao buscar painel", erro);
            res.status(500).json({ erro: "Erro ao buscar painel" });
        });
}

function getRecomendacoes(req, res) {
    const idQuiz = req.params.id;

    painelModel.buscarRecomendacoes(idQuiz)
        .then(function(resultado) {
            res.json(resultado);
        })
        .catch(function(erro) {
            console.log("Erro ao buscar recomendações", erro);
            res.status(500).json({ erro: "Erro ao buscar recomendações" });
        });
}

module.exports = { getPainel, getRecomendacoes };
