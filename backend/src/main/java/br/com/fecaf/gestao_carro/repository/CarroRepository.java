package br.com.fecaf.gestao_carro.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.fecaf.gestao_carro.model.Carro;

public interface CarroRepository extends JpaRepository<Carro, Integer> {
        @Query(value = """
                            SELECT * FROM veiculos c
                            WHERE
                                LOWER(c.cor) LIKE CONCAT('%', LOWER(:termo), '%')
                                OR LOWER(c.marca) LIKE CONCAT('%', LOWER(:termo), '%')
                                OR LOWER(c.modelo) LIKE CONCAT('%', LOWER(:termo), '%')
                                OR CAST(c.preco AS CHAR) LIKE CONCAT('%', :termo, '%')
                                OR CAST(c.quilometragem AS CHAR) LIKE CONCAT('%', :termo, '%')
                                OR (
                                    (:termo LIKE '%disponivel%' AND :termo NOT LIKE '%indisponivel%' AND c.disponibilidade = 1)
                                    OR (:termo LIKE '%indisponivel%' AND c.disponibilidade = 0)
                                )
                        """, nativeQuery = true)
        List<Carro> buscarPorTermo(@Param("termo") String termo);

}
