package br.com.fecaf.gestao_carro.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.fecaf.gestao_carro.model.Modelo;

public interface ModeloRepository extends JpaRepository<Modelo, Integer> {
}
