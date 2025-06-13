CREATE DATABASE db_carro;
use db_carro;

CREATE TABLE IF NOT EXISTS marcas (
	id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(20) NOT NULL,
    UNIQUE INDEX (id)
);

CREATE TABLE IF NOT EXISTS modelos (
	id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(20) NOT NULL,
    ano INT NOT NULL,
    id_marcas INT,
    FOREIGN KEY (id_marcas) REFERENCES marcas(id),
    UNIQUE INDEX (id)
);

CREATE TABLE IF NOT EXISTS veiculos (
	id INT AUTO_INCREMENT PRIMARY KEY,
    cor VARCHAR(25) NOT NULL,
    preco DECIMAL NOT NULL,
    marca varchar(30),
    modelo varchar(30),
    quilometragem INT NOT NULL,
    disponibilidade BOOL,
    id_modelos INT,
    FOREIGN KEY (id_modelos) REFERENCES modelos(id),
	UNIQUE INDEX (id)
);


INSERT INTO marcas (nome) VALUES ('Kia');

INSERT INTO modelos (nome, ano, id_marcas) VALUES ('Ceratto', 2020, 1);
INSERT INTO veiculos (cor, preco, marca, modelo, quilometragem, disponibilidade, id_modelos)
VALUES ('Preto', 85000.00, 'Kia', 'Ceratto', 45000, TRUE, 1);