const quizModel = require("../models/quizModel");
function listar(req, res) {
    quizModel.listar((erro, resultado) => {
        if (erro) {
            console.error("Erro ao listar quizzes:", erro.sqlMessage || erro);
            return res.status(400).json({ erro: erro.sqlMessage || erro });
        }
        res.status(200).json(resultado ?? []);
    });
}

function carregarQuizFixo(req, res) {
    const idQuiz = req.params.idQuiz;

    quizModel.carregarQuiz(idQuiz, function(erro, resultado) {
        if (erro) {
            console.error("Erro ao carregar quiz:", erro);
            return res.status(500).json({ erro: "Erro ao carregar quiz", detalhes: erro.sqlMessage || erro });
        }

        if (!resultado) {
            return res.status(404).json({ erro: "Quiz não encontrado" });
        }

        res.status(200).json(resultado);
    });
}

function listarPerguntas(req, res) {
    const idQuiz = req.params.idQuiz;

    quizModel.listarPerguntas(idQuiz, (erro, resultado) => {
        if (erro) {
            console.error("Erro ao listar perguntas:", erro.sqlMessage || erro);
            return res.status(400).json({ erro: erro.sqlMessage || erro });
        }
        res.status(200).json(resultado ?? []);
    });
}
function listarAlternativas(req, res) {
    const idPergunta = req.params.idPergunta;

    quizModel.listarAlternativas(idPergunta, (erro, resultado) => {
        if (erro) {
            console.error("Erro ao listar alternativas:", erro.sqlMessage || erro);
            return res.status(400).json({ erro: erro.sqlMessage || erro });
        }
        res.status(200).json(resultado ?? []);
    });
}

module.exports = {
    listar,
    carregarQuizFixo,
    listarPerguntas,
    listarAlternativas
};
