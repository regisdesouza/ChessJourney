var dashModel = require("../models/dashModel");

function estatistica(req, res) {

    var idUsuario = req.params.idUsuario;

    dashModel.estatistica(idUsuario)
        .then(function (resultado) {

            if (resultado.length > 0) {

                var resposta = {
                    tentativas: resultado[0].tentativas,
                    acertos: resultado[0].acertos
                };

                res.status(200).json(resposta);

            } else {
                res.status(204).json({});
            }

        })
        .catch(function (erro) {
            res.status(500).json(erro);
        });
}

module.exports = {
    estatistica
};
