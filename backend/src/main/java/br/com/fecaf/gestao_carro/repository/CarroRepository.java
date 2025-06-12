package br.com.fecaf.gestao_carro.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.fecaf.gestao_carro.model.Carro;

public interface CarroRepository extends JpaRepository<Carro, Integer> {
    
    @Query("SELECT c FROM Carro c WHERE c.disponibilidade = true AND (" +
            "LOWER(c.modelo) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
            "LOWER(c.marca) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
            "LOWER(c.cor) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
            "CAST(c.preco AS string) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
            "CAST(c.quilometragem AS string) LIKE LOWER(CONCAT('%', :termo, '%')))")
    List<Carro> buscarDisponiveisPorTermo(@Param("termo") String termo);

    @Query("SELECT c FROM Carro c WHERE c.disponibilidade = false AND (" +
            "LOWER(c.modelo) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
            "LOWER(c.marca) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
            "LOWER(c.cor) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
            "CAST(c.preco AS string) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
            "CAST(c.quilometragem AS string) LIKE LOWER(CONCAT('%', :termo, '%')))")
    List<Carro> buscarIndisponiveisPorTermo(@Param("termo") String termo);

    @Query("SELECT c FROM Carro c WHERE c.disponibilidade = true")
    List<Carro> buscarDisponiveis();

    @Query("SELECT c FROM Carro c WHERE c.disponibilidade = false")
    List<Carro> buscarIndisponiveis();
}
