CREATE DATABASE chessjourney;
USE chessjourney;

CREATE TABLE usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(30) NOT NULL,
    nivel_atual INT DEFAULT 1
);

CREATE TABLE quiz (
    id_quiz INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(400) NOT NULL,
    numero_quiz INT NOT NULL,
    id_quiz_proximo INT DEFAULT NULL,
    FOREIGN KEY (id_quiz_proximo) REFERENCES quiz(id_quiz)
);

CREATE TABLE recomendacao (
    id_recomendacao INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(400) NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    descricao VARCHAR(500),
    conteudo VARCHAR(500),
    id_quiz INT,
    url_recurso VARCHAR(500),
    FOREIGN KEY (id_quiz) REFERENCES quiz(id_quiz)
);

CREATE TABLE usuario_quiz (
    id_usuario INT NOT NULL,
    id_quiz INT NOT NULL,
    PRIMARY KEY (id_usuario, id_quiz),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_quiz) REFERENCES quiz(id_quiz)
);

CREATE TABLE progresso_quiz (
    id_progresso INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT UNIQUE NOT NULL,
    quiz_atual INT NOT NULL,
    status_progresso VARCHAR(20) DEFAULT 'pendente',
    tentativas INT DEFAULT 0,
    data_conclusao TIMESTAMP NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (quiz_atual) REFERENCES quiz(id_quiz)
);
