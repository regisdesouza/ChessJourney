var express = require("express");
var router = express.Router();
var painelController = require("../controllers/painelController");

router.get("/:id", painelController.getPainel);
router.get("/recomendacao/quiz/:id", painelController.getRecomendacoes);

module.exports = router;
