package br.com.fecaf.gestao_carro.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.fecaf.gestao_carro.model.Marca;

public interface MarcaRepository extends JpaRepository<Marca, Integer> {
}
