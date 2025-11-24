const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");

router.get("/listar", quizController.listar);
router.get("/perguntas/:idQuiz", quizController.listarPerguntas);
router.get("/alternativas/:idPergunta", quizController.listarAlternativas);

router.get("/fixed/:idQuiz", quizController.carregarQuizFixo);

router.post("/enviarRespostas", quizController.enviarBusca);

module.exports = router;