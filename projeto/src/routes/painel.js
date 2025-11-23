var express = require("express");
var router = express.Router();
var painelModel = require("../models/painelModel");

router.get("/quizzes", (req, res) => {
    painelModel.listarQuizzes()
        .then(lista => res.json(lista))
        .catch(err => res.status(500).json({ erro: "Erro ao listar quizzes" }));
});

router.get("/recomendacoes/:idQuiz", (req, res) => {
    var idQuiz = req.params.idQuiz;
    painelModel.listarRecomendacoesPorQuiz(idQuiz)
        .then(lista => res.json(lista))
        .catch(err => res.status(500).json({ erro: "Erro ao listar recomendações" }));
});

module.exports = router;
