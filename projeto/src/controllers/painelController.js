const painelModel = require("../models/painelModel");

function getPainel(req, res) {
    const idUsuario = req.params.id;
    painelModel.buscarPainel(idUsuario)
        .then(resultado => res.json(resultado))
        .catch(erro => {
            console.log(erro);
            res.status(500).json({ erro: "Erro ao buscar painel" });
        });
}

function getRecomendacoes(req, res) {
    const idQuiz = req.params.id;
    painelModel.buscarRecomendacoes(idQuiz)
        .then(resultado => res.json(resultado))
        .catch(erro => {
            console.log(erro);
            res.status(500).json({ erro: "Erro ao buscar recomendações" });
        });
}

module.exports = { getPainel, getRecomendacoes };
