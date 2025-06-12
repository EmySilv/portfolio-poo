package br.com.fecaf.gestao_carro.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.fecaf.gestao_carro.model.Carro;
import br.com.fecaf.gestao_carro.repository.CarroRepository;

@Service
public class CarroService {
    @Autowired
    private CarroRepository carroRepository;

    // Lista todos os carros disponíveis
    public List<Carro> listarCarros() {
        return carroRepository.findAll();
    }

    // Salva um novo carro
    public Carro salvarCarro(Carro carro) {
        return carroRepository.save(carro);
    }

    // Deleta um carro pelo id
    public void deletarCarro(int id) {
        if (!carroRepository.existsById(id)) {
            throw new RuntimeException("Carro não encontrado com o ID: " + id);
        }
        carroRepository.deleteById(id);
    }

    // Atualiza um carro existente
    public Carro atualizarCarro(int id, Carro carroDetails) {
        Optional<Carro> carroOptional = carroRepository.findById(id);

        if (carroOptional.isPresent()) {
            Carro carro = carroOptional.get();
            carro.setModelo(carroDetails.getModelo());
            carro.setMarca(carroDetails.getMarca());
            carro.setQuilometragem(carroDetails.getQuilometragem());
            carro.setDisponibilidade(carroDetails.isDisponibilidade()); // corrigido para isDisponibilidade()
            carro.setPreco(carroDetails.getPreco()); // BigDecimal no modelo, manter assim
            carro.setCor(carroDetails.getCor());

            return carroRepository.save(carro);
        } else {
            throw new RuntimeException("Carro não encontrado com o ID: " + id);
        }
    }


    // Busca carros por termo em vários campos
    public List<Carro> buscarCarrosPorTermo(String termo) {
        if (termo == null || termo.trim().isEmpty()) {
            return listarCarros(); // Retorna todos os carros caso não tenha termo
        }

        termo = termo.trim().toLowerCase();

        switch (termo) {
            case "disponivel", "disponível", "true", "sim" -> {
                // Retorna somente carros disponíveis
                return carroRepository.buscarDisponiveis();
            }
            case "indisponivel", "indisponível", "false", "nao", "não" -> {
                // Retorna somente carros indisponíveis
                return carroRepository.buscarIndisponiveis();
            }
            default -> {
                // Para qualquer outro termo, retorna lista vazia ou todos os carros (aqui escolhi lista vazia)
                return List.of();
            }
        }
    }
}
