CREATE DATABASE chessjourney;
USE chessjourney;

CREATE TABLE usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    nivel_atual INT DEFAULT 1
);

CREATE TABLE quiz (
    id_quiz INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(400) NOT NULL,
    numero_quiz INT NOT NULL,
    nivel INT NOT NULL DEFAULT 1,
    id_quiz_proximo INT DEFAULT NULL,
    FOREIGN KEY (id_quiz_proximo) REFERENCES quiz(id_quiz)
);

CREATE TABLE recomendacao (
    id_recomendacao INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(400) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
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
    id_usuario INT NOT NULL,
    quiz_atual INT NOT NULL,
    status_progresso ENUM('pendente','concluido') DEFAULT 'pendente',
    tentativas INT DEFAULT 0,
    data_conclusao TIMESTAMP NULL DEFAULT NULL,
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


INSERT INTO quiz (titulo, numero_quiz, nivel) VALUES
("Movimento das Peças", 1, 1);

INSERT INTO pergunta (id_quiz, enunciado) VALUES
(1, 'Qual peça do xadrez se move em formato de L, pulando sobre outras peças?'),
(1, 'Qual peça pode se mover qualquer número de casas em linha reta, horizontal ou vertical?'),
(1, 'Qual peça pode se mover qualquer número de casas apenas na diagonal?'),
(1, 'Qual peça pode se mover apenas uma casa em qualquer direção, horizontal, vertical ou diagonal?'),
(1, 'Qual peça se move apenas para frente uma casa por vez, exceto no primeiro movimento, quando pode avançar duas casas?'),
(1, 'Qual peça captura na diagonal, mas não se move diagonalmente para frente?'),
(1, 'Qual peça combina os movimentos da torre e do bispo, podendo se mover qualquer número de casas em linha reta ou diagonal?'),
(1, 'Qual peça é a única que pode pular sobre outras peças em seu movimento?'),
(1, 'Qual peça só pode se mover uma casa por vez, mas possui uma captura especial chamada "en passant"?'),
(1, 'Qual peça pode avançar duas casas no primeiro movimento e depois apenas uma casa por vez, capturando na diagonal?');

INSERT INTO alternativa (id_pergunta, texto, correta) VALUES
(1, 'Bispo', 0),(1, 'Torre', 0),(1, 'Cavalo', 1),(1, 'Rainha', 0),
(2, 'Bispo', 0),(2, 'Torre', 1),(2, 'Cavalo', 0),(2, 'Rainha', 0),
(3, 'Bispo', 1),(3, 'Torre', 0),(3, 'Cavalo', 0),(3, 'Rainha', 0),
(4, 'Rei', 1),(4, 'Rainha', 0),(4, 'Bispo', 0),(4, 'Torre', 0),
(5, 'Peão', 1),(5, 'Torre', 0),(5, 'Cavalo', 0),(5, 'Bispo', 0),
(6, 'Peão', 1),(6, 'Cavalo', 0),(6, 'Rainha', 0),(6, 'Rei', 0),
(7, 'Rainha', 1),(7, 'Torre', 0),(7, 'Bispo', 0),(7, 'Cavalo', 0),
(8, 'Cavalo', 1),(8, 'Bispo', 0),(8, 'Torre', 0),(8, 'Rainha', 0),
(9, 'Peão', 1),(9, 'Cavalo', 0),(9, 'Torre', 0),(9, 'Rei', 0),
(10, 'Peão', 1),(10, 'Bispo', 0),(10, 'Cavalo', 0),(10, 'Rainha', 0);

INSERT INTO quiz (titulo, numero_quiz, nivel) VALUES
("Táticas Básicas", 2, 2);

INSERT INTO pergunta (id_quiz, enunciado) VALUES
(2, 'O que significa um ataque duplo no xadrez?'),
(2, 'O que é um garfo de peças?'),
(2, 'Como funciona um cravada?'),
(2, 'O que é um ataque descoberto?'),
(2, 'Como criar uma ameaça dupla envolvendo peão e torre?'),
(2, 'O que significa “pin” em xadrez?'),
(2, 'O que é uma sobrecarga de defesa?'),
(2, 'Como usar um xeque duplo para capturar material?'),
(2, 'Qual é a função de uma cravada absoluta?'),
(2, 'O que é um ataque entrelaçado de peças?');

INSERT INTO alternativa (id_pergunta, texto, correta) VALUES
(11,'Mover duas peças ao mesmo tempo',0),(11,'Atacar duas peças adversárias simultaneamente',1),(11,'Trocar peças sem estratégia',0),(11,'Mover o rei sem proteção',0),
(12,'Atacar o rei e a torre ao mesmo tempo',0),(12,'Capturar duas peças com o mesmo cavalo',1),(12,'Trocar peões rapidamente',0),(12,'Mover a rainha sem estratégia',0),
(13,'Cravada é quando uma peça não pode se mover sem expor peça de maior valor',1),(13,'Clavada é sempre mover torre',0),(13,'Cravada é troca de bispos',0),(13,'Mover peões sem estratégia',0),
(14,'Ataque simultâneo com peões',0),(14,'Ataque descoberto é mover uma peça revelando ataque de outra',1),(14,'Trocar peças rapidamente',0),(14,'Avançar rei sem defesa',0),
(15,'Criar ameaça dupla entre peão e torre para capturar peça valiosa',1),(15,'Trocar torres sem estratégia',0),(15,'Mover cavalos sem objetivo',0),(15,'Avançar rei aleatoriamente',0),
(16,'Pin é quando você protege peças',0),(16,'Pin é um movimento de peão',0),(16,'Pin é uma cravada que não pode ser quebrada sem perder peça de maior valor',1),(16,'Trocar bispos sem critério',0),
(17,'Sobrecarga é atacar uma peça indefesa',0),(17,'Sobrecarga de defesa significa forçar adversário a proteger muitas peças ao mesmo tempo',1),(17,'Avançar peões sem plano',0),(17,'Mover rei sem segurança',0),
(18,'Xeque duplo permite capturar material aproveitando duas ameaças ao mesmo tempo',1),(18,'Mover rainha sem estratégia',0),(18,'Trocar peças sem planejamento',0),(18,'Avançar peões aleatoriamente',0),
(19,'Cravada absoluta impede peça de se mover sem perder peça de valor maior',1),(19,'Trocar bispos aleatoriamente',0),(19,'Mover torre sem plano',0),(19,'Avançar rei sem estratégia',0),
(20,'Ataque entrelaçado é coordenar peças para criar múltiplas ameaças simultâneas',1),(20,'Mover peões sem controle',0),(20,'Trocar torres sem estratégia',0),(20,'Avançar rei sem defesa',0);


INSERT INTO quiz (titulo, numero_quiz, nivel) VALUES
("Estratégias de Abertura", 3, 3);

INSERT INTO pergunta (id_quiz, enunciado) VALUES
(3,'Qual é o objetivo principal das aberturas no xadrez?'),
(3,'O que significa “controlar o centro”?'),
(3,'Qual é a finalidade de desenvolver os cavalos e bispos primeiro?'),
(3,'Qual é a ideia de “roque curto”?'),
(3,'O que é uma abertura “italiana”?'),
(3,'Qual é o objetivo de uma abertura “espanhola”?'),
(3,'O que significa “fianchetto”?'),
(3,'Por que é importante desenvolver peças antes de mover a rainha?'),
(3,'O que é um “gambito”?'),
(3,'Por que é importante proteger o rei desde a abertura?');

INSERT INTO alternativa (id_pergunta, texto, correta) VALUES
(21,'Capturar o rei adversário rapidamente',0),(21,'Colocar suas peças em posições estratégicas e controlar o centro',1),(21,'Trocar peões imediatamente',0),(21,'Manter as peças na primeira fileira',0),
(22,'Avançar apenas os peões laterais',0),(22,'Trocar torres por bispos',0),(22,'Posicionar peças e peões nas casas centrais do tabuleiro',1),(22,'Movimentar o rei para o centro',0),
(23,'Capturar peças adversárias',0),(23,'Trocar peças de pouca importância',0),(23,'Colocar peças menores em posições ativas para controlar o tabuleiro',1),(23,'Manter o rei exposto',0),
(24,'Mover a torre para o centro',0),(24,'Avançar peões do lado da dama',0),(24,'Proteger o rei e colocar a torre em posição de ataque',1),(24,'Trocar a rainha imediatamente',0),
(25,'Avançar todos os peões sem estratégia',0),(25,'Mover a rainha para a primeira fileira',0),(25,'Trocar torres rapidamente',0),(25,'Desenvolver rapidamente cavalos e bispos enquanto controla o centro',1),
(26,'Capturar peões na lateral',0),(26,'Mover o rei sem proteção',0),(26,'Trocar cavalos por peões',0),(26,'Controlar o centro e preparar ataques futuros na ala do rei',1),
(27,'Mover o rei para a ala',0),(27,'Trocar bispo por cavalo',0),(27,'Colocar o bispo em diagonal longa atrás de peões avançados',1),(27,'Avançar torres sem proteção',0),
(28,'A rainha não pode capturar',0),(28,'Trocar peões primeiro',0),(28,'Para evitar ataques e perder tempo com movimentos desnecessários',1),(28,'Manter o rei no centro',0),
(29,'Capturar torres adversárias',0),(29,'Oferecer material para obter vantagem posicional ou de desenvolvimento',1),(29,'Mover o rei rapidamente',0),(29,'Trocar bispos com cavalos',0),
(30,'Não avançar o rei',0),(30,'Trocar a rainha',0),(30,'Evitar ataques rápidos e manter o jogo seguro',1),(30,'Capturar peças adversárias sem pensar',0);


INSERT INTO quiz (titulo, numero_quiz, nivel) VALUES
("Finais Simples", 4, 4);

INSERT INTO pergunta (id_quiz, enunciado) VALUES
(4,'Qual é a estratégia básica ao final do jogo com rei e peões?'),
(4,'O que é “posição de oposição” no final de jogo?'),
(4,'Como usar o rei no final do jogo?'),
(4,'O que é importante ao promover um peão?'),
(4,'Como capturar o último peão do adversário?'),
(4,'Qual é a importância do “rei ativo” no final do jogo?'),
(4,'O que fazer se você tem rei e torre contra rei?'),
(4,'O que é um “xadrez de zugzwang”?'),
(4,'Como vencer com rei e dois peões contra rei?'),
(4,'Qual é a regra principal ao empatar no final?');

INSERT INTO alternativa (id_pergunta, texto, correta) VALUES
(31,'Trocar todas as peças restantes',0),(31,'Avançar o rei sem estratégia',0),(31,'Promover peões e usar o rei ativamente',1),(31,'Capturar a rainha adversária imediatamente',0),
(32,'Capturar peões laterais',0),(32,'Trocar torres',0),(32,'Colocar o rei em frente ao rei adversário para limitar seus movimentos',1),(32,'Mover a rainha sem controle',0),
(33,'Manter o rei parado',0),(33,'Trocar o rei por peças',0),(33,'Ativar o rei como peça de ataque e defesa',1),(33,'Avançar apenas peões',0),
(34,'Mover o peão duas vezes',0),(34,'Trocar a torre primeiro',0),(34,'Escolher a peça correta para ganhar vantagem no final do jogo',1),(34,'Capturar o rei adversário',0),
(35,'Ignorar o peão',0),(35,'Trocar peões rapidamente',0),(35,'Usar o rei e a peça correta para garantir a promoção',1),(35,'Avançar a rainha sem proteção',0),
(36,'Permitir xeque',0),(36,'Trocar peças',0),(36,'Controlar casas e apoiar peões para promoção',1),(36,'Avançar apenas peões sem ajuda',0),
(37,'Trocar a torre',0),(37,'Avançar rei sem estratégia',0),(37,'Usar a torre e o rei para encurralar o rei adversário',1),(37,'Mover apenas a torre',0),
(38,'Trocar peças',0),(38,'Avançar o rei sem pensar',0),(38,'Forçar o adversário a se mover e piorar sua posição',1),(38,'Capturar o peão errado',0),
(39,'Trocar peões',0),(39,'Avançar sem proteção',0),(39,'Promover um peão enquanto o rei protege o outro',1),(39,'Deixar o adversário capturar o peão',0),
(40,'Não avançar o rei',0),(40,'Trocar a rainha',0),(40,'Evitar movimentos que resultem em empate ou repetição',1),(40,'Capturar o último peão',0);

INSERT INTO recomendacao (titulo, tipo, descricao, conteudo, id_quiz, url_recurso) VALUES
('Livro Xadrez Básico', 'Livro', 'Aprenda movimentos e táticas básicas', 'Capítulos 1 a 5 do livro e/ou acessar o artigo', 1, 'https://www.chess.com/pt-BR/blog/L4wKov/movimento-das-pecas-no-xadrez'),
('Exercícios de Tática', 'Exercício', 'Pratique táticas básicas do xadrez', 'Acesse o artigo para aprender mais sobre', 2, 'https://www.chess.com/pt-BR/article/view/taticas-de-xadrez-38-definicoes-e-exemplos'),
('Controle do Centro', 'Conceito', 'Aprenda a controlar o centro do tabuleiro', 'Siga o aritgo para mais informações', 3, 'https://www.xadrezforte.com.br/guia-definitivo-para-as-aberturas-de-xadrez/'),
('Finalizando Partidas', 'Livro', 'Aprenda técnicas de finais simples', 'Capítulos 1 a 3 e/ou acessar o artigo', 4, 'https://www.chess.com/article/view/chess-endgames');



SELECT * FROM recomendacao;

select * from usuario;  