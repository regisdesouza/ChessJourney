const painelModel = require("../models/painelModel");

async function getPainel(req, res) {
    const idUsuario = req.params.id;

    try {
        const dados = await painelModel.buscarPainel(idUsuario);

        if (!dados.usuario || dados.usuario.length === 0) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }

        res.json({
            usuario: dados.usuario[0],
            quizAtual: dados.quizAtual[0] || null,
            proximoQuiz: dados.proximoQuiz[0] || null,
            recomendacoes: dados.recomendacoes || []
        });

    } catch (erro) {
        console.log("Erro no painel:", erro);
        res.status(500).json({ erro: "Erro ao carregar painel" });
    }
}

async function getRecomendacoes(req, res) {
    const idQuiz = req.params.idQuiz;

    try {
        const recomendacoes = await painelModel.buscarRecomendacoes(idQuiz);
        res.json(recomendacoes);
    } catch (erro) {
        console.log("Erro ao carregar recomendações:", erro);
        res.status(500).json({ erro: "Erro ao carregar recomendações" });
    }
}

module.exports = { getPainel, getRecomendacoes };
