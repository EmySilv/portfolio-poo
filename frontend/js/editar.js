// editar.js

// Pega o carro armazenado no localStorage
const carroParaEditar = JSON.parse(localStorage.getItem('carroParaEditar'));

const modeloInput = document.getElementById('modeloInput');
const marcaInput = document.getElementById('marcaInput');
const corInput = document.getElementById('corInput');
const precoInput = document.getElementById('precoInput');
const quilometragemInput = document.getElementById('quilometragemInput');
const disponibilidadeSelect = document.getElementById('opcoes');
const editarBtn = document.getElementById('editarBtn');

// Preenche o formulário com os dados do carro
if (carroParaEditar) {
    modeloInput.value = carroParaEditar.modelo || '';
    marcaInput.value = carroParaEditar.marca || '';
    corInput.value = carroParaEditar.cor || '';
    precoInput.value = carroParaEditar.preco || '';
    quilometragemInput.value = carroParaEditar.quilometragem || '';
    const disponibilidade = document.getElementById('opcoes').value === '1'; // true se "1", false se "2"

} else {
    alert('Nenhum carro selecionado para editar.');
    window.location.href = 'index.html';
}

// Função para enviar a atualização para o backend
async function editarCarro() {
    const modelo = modeloInput.value.trim();
    const marca = marcaInput.value.trim();
    const cor = corInput.value.trim();
    const preco = precoInput.value.trim();
    const quilometragem = quilometragemInput.value.trim();
    const disponibilidade = disponibilidadeSelect.value;

    if (!modelo || !marca || !cor || !preco || !quilometragem) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const carroAtualizado = {
        modelo,
        marca,
        cor,
        preco: parseFloat(preco),           // número
        quilometragem: parseInt(quilometragem),  // inteiro
        disponibilidade: disponibilidade === '1' // booleano true/false
    };


    try {
        const response = await fetch(`http://localhost:8080/api/carros/atualizarCarro/${carroParaEditar.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(carroAtualizado),
        });

        if (response.ok) {
            alert('Carro atualizado com sucesso!');
            localStorage.removeItem('carroParaEditar');
            window.location.href = 'index.html';
        } else {
            const errorText = await response.text();
            alert('Erro ao atualizar carro: ' + errorText);
        }
    } catch (error) {
        alert('Erro ao atualizar carro: ' + error.message);
    }
}

editarBtn.addEventListener('click', editarCarro);
