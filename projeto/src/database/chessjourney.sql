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
    data_conclusao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (quiz_atual) REFERENCES quiz(id_quiz)
);

CREATE TABLE pergunta (
    id_pergunta INT PRIMARY KEY AUTO_INCREMENT,
    id_quiz INT NOT NULL,
    enunciado VARCHAR(500) NOT NULL,
    FOREIGN KEY (id_quiz) REFERENCES quiz(id_quiz)
);

CREATE TABLE alternativa (
    id_alternativa INT PRIMARY KEY AUTO_INCREMENT,
    id_pergunta INT NOT NULL,
    texto VARCHAR(300) NOT NULL,
    correta BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_pergunta) REFERENCES pergunta(id_pergunta)
);

CREATE TABLE resposta_usuario (
    id_resposta INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_pergunta INT NOT NULL,
    id_alternativa_escolhida INT NOT NULL,
    correta BOOLEAN NOT NULL,
    data_resposta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_pergunta) REFERENCES pergunta(id_pergunta),
    FOREIGN KEY (id_alternativa_escolhida) REFERENCES alternativa(id_alternativa)
);
