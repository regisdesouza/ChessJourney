var express = require("express");
var router = express.Router();
var dashController = require("../controllers/dashController");

router.get("/acertosTentativas/:idUsuario", function (req, res) {
    dashController.buscarAcertosETentativas(req, res);
});

router.get("/estatistica/:idUsuario", function (req, res) {
    dashController.estatistica(req, res);
});


module.exports = router;
