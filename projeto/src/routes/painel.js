const express = require("express");
const router = express.Router();
const painelController = require("../controllers/painelController");

router.get("/:id", painelController.getPainel);

router.get("/recomendacao/quiz/:id", async (req, res) => {
    const idQuiz = req.params.id;
    const painelModel = require("../models/painelModel");

    try {
        const resultado = await painelModel.buscarRecomendacoes(idQuiz);
        res.json(resultado);
    } catch (erro) {
        console.log("Erro ao carregar recomendações", erro);
        res.status(500).json({ erro: "Erro ao carregar recomendações" });
    }
});

module.exports = router;
