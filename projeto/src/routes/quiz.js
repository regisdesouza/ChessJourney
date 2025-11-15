var express = require("express");
var router = express.Router();

var quizController = require("../controllers/quizController");

router.get("/:idUsuario", function (req, res) {
    quizController.obterQuiz(req, res);
});


router.post("/resposta", function (req, res) {
    quizController.enviarResposta(req, res);
});

module.exports = router;
