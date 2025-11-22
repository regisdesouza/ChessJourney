var express = require("express");
var router = express.Router();

var quizController = require("../controllers/quizController");

router.get("/:idUsuario", function (req, res) {
    quizController.obterQuiz(req, res);
});


router.post("/resposta", function (req, res) {
    quizController.enviarResposta(req, res);
});

router.post("/atualizar-nivel", function (req, res) {
    quizController.atualizarNivel(req, res);
});



module.exports = router;
