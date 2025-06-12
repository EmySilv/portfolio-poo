const cardContainer = document.getElementById('cardContainer');

let carros = [];

// Carrega todos os carros e renderiza
async function loadCards() {
    try {
        const response = await fetch('http://localhost:8080/api/carros/listarCarro');
        carros = await response.json();
        renderCards();
    } catch (error) {
        console.error('Erro ao carregar carros:', error);
    }
}

/**
 * Renderiza os cards dos carros.
 * Se receber um array carrosParam, renderiza ele.
 * Se não, renderiza o array global carros.
 */
function renderCards(carrosParam) {
    const lista = carrosParam || carros;

    cardContainer.innerHTML = '';

    if (!lista || lista.length === 0) {
        cardContainer.innerHTML = '<p>Nenhum carro encontrado.</p>';
        return;
    }

    lista.forEach((carro) => {
        const card = document.createElement('div');
        card.className = 'card';

        /* Caso queira adicionar imagem:
        const image = document.createElement('img');
        image.src = carro.foto || 'https://via.placeholder.com/150';
        card.appendChild(image);
        */

        const marca = document.createElement('h2');
        marca.textContent = carro.marca;
        card.appendChild(marca);

        const modelo = document.createElement('h3');
        modelo.textContent = carro.modelo;
        card.appendChild(modelo);

        if (carro.ano !== undefined) {
            const ano = document.createElement('p');
            ano.textContent = `Ano: ${ carro.ano }`;
            card.appendChild(ano);
        }

        const cor = document.createElement('p');
        cor.textContent = `Cor: ${ carro.cor }`;
        card.appendChild(cor);

        const preco = document.createElement('p');
        preco.textContent = `Preço: R$ ${ carro.preco }`;
        card.appendChild(preco);

        const quilometragem = document.createElement('p');
        quilometragem.textContent = `Quilometragem: ${ carro.quilometragem } km`;
        card.appendChild(quilometragem);

        const disponibilidade = document.createElement('p');
        disponibilidade.textContent = `Disponibilidade: ${ carro.disponibilidade ? 'Disponível' : 'Indisponível' }`;
        card.appendChild(disponibilidade);

        // Botão Editar
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.onclick = () => {
            localStorage.setItem('carroParaEditar', JSON.stringify(carro));
            window.location.href = 'editarVeiculo.html';
        };
        card.appendChild(editButton);

        // Botão Deletar
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Deletar';
        deleteButton.onclick = () => deleteCar(carro.id);
        card.appendChild(deleteButton);

        cardContainer.appendChild(card);
    });
}

// Adiciona um carro (formulário)
async function adicionarCarro() {
    const modelo = document.getElementById('modeloInput').value.trim();
    const marca = document.getElementById('marcaInput').value.trim();
    const cor = document.getElementById('corInput').value.trim();
    const preco = parseFloat(document.getElementById('precoInput').value);
    const quilometragem = parseInt(document.getElementById('quilometragemInput').value);
    const disponibilidade = document.getElementById('opcoes').value === '1'; // true se 1, false se 2

    if (modelo && marca && cor && !isNaN(preco) && !isNaN(quilometragem)) {
        const newCar = {
            modelo,
            marca,
            cor,
            preco,
            quilometragem,
            disponibilidade,
        };

        try {
            const response = await fetch('http://localhost:8080/api/carros/cadastrarCarro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCar),
            });

            if (response.ok) {
                loadCards();
                clearForm();
            } else {
                const errorText = await response.text();
                console.error('Erro ao cadastrar carro:', errorText);
                alert('Erro ao cadastrar: ' + errorText);
            }
        } catch (error) {
            console.error('Erro ao cadastrar carro:', error);
            alert('Erro ao cadastrar: ' + error.message);
        }
    } else {
        alert('Por favor, preencha todos os campos corretamente.');
    }
}

function clearForm() {
    document.getElementById('modeloInput').value = '';
    document.getElementById('marcaInput').value = '';
    document.getElementById('corInput').value = '';
    document.getElementById('precoInput').value = '';
    document.getElementById('quilometragemInput').value = '';
    // limpar outros campos, se houver
}

async function deleteCar(id) {
    try {
        const response = await fetch(`http://localhost:8080/api/carros/deletarCarro/${id}`, {
            method: 'DELETE',
        });

    if (response.ok) {
        loadCards();
    } else {
        console.error('Erro ao deletar carro:', await response.text());
    }
    } catch (error) {
        console.error('Erro ao deletar carro:', error);
    }
}

// Busca carros pelo modelo
function search() {
    const searchInput = document.getElementById('searchInput').value.trim();

    // Se o campo de busca estiver vazio, recarrega todos os carros.
    // Este é um comportamento comum e útil para a experiência do usuário.
    if (!searchInput) {
        loadCards(); // Assume que 'loadCards()' carrega todos os carros
        return;     // Interrompe a execução da função search()
    }

    // Faz a requisição para a sua API backend.
    // Usamos 'termo' como o nome do parâmetro, que o backend espera para a busca genérica.
    // O backend (CarroService.buscarCarrosPorTermo) será responsável por buscar
    // esse 'termo' em cor, marca, modelo, preco, quilometragem e disponibilidade.
    fetch(`http://localhost:8080/api/carros/buscar?termo=${encodeURIComponent(searchInput)}`)
        .then(response => {
            // Verifica se a resposta HTTP foi bem-sucedida (status 200-299).
            if (!response.ok) {
                // Se não for bem-sucedida, tenta ler a mensagem de erro do servidor.
                return response.text().then(text => {
                    throw new Error(`Erro na requisição: ${text || response.statusText}`);
                });
            }
            // Converte a resposta para JSON.
            return response.json();
        })
        .then(data => {
            // Atualiza o array global 'carros' com os resultados da busca.
            carros = data;
            // Renderiza os cards com os dados filtrados.
            renderCards(data);
        })
        .catch(error => {
            // Captura e exibe qualquer erro que ocorra durante o fetch ou processamento.
            console.error('Erro ao buscar carros:', error);
            // Opcional: exiba uma mensagem de erro amigável na interface do usuário.
            // Exemplo:
            // cardContainer.innerHTML = '<p>Ocorreu um erro ao buscar os carros. Tente novamente.</p>';
        });
}

// Observações importantes:
// 1. Garanta que o elemento HTML com id 'searchInput' existe e está acessível.
// 2. Certifique-se de que a função 'loadCards()' está definida e carrega todos os carros quando chamada.
// 3. Esta função 'search()' deve ser chamada quando o usuário interage com o campo de busca,
//    por exemplo, ao clicar em um botão de busca ou pressionar Enter no input.
// Exemplo de como você pode chamar a função:
// document.getElementById('searchButton').addEventListener('click', search);
// Ou:
// document.getElementById('searchInput').addEventListener('keypress', function(event) {
//     if (event.key === 'Enter') {
//         search();
//     }
// });

// Inicia carregando os carros
loadCards();