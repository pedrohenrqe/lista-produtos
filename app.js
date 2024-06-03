document.addEventListener('DOMContentLoaded', function () {
    const port = 8080; // Porta do seu backend JSON Server
    const productContainer = document.getElementById('produtos-list');
    const productForm = document.getElementById('produto-form');
    const productIdInput = document.getElementById('produto-id');
    const addBtn = document.getElementById('adicionar-btn');
    const updateBtn = document.getElementById('salvar-btn');

    // Função para buscar todos os produtos
    function getAllProducts() {
        fetch(`http://localhost:${port}/produtos`)
            .then(response => response.json())
            .then(products => {
                productContainer.innerHTML = '';
                products.forEach(product => {
                    const productItem = document.createElement('div');
                    productItem.className = 'product-item';
                    productItem.innerHTML = `
                        <img src="${product.imagem}" alt="Imagem de ${product.nome}" class="product-photo">
                        <div class="product-details">
                            <div class="product-name">${product.nome}</div>
                            <div class="product-info">Preço: R$ ${product.preco}</div>
                            <div class="product-info">Descrição: ${product.descricao}</div>
                            <div class="product-info">Quantidade: ${product.quantidade}</div>
                        </div>
                        <div class="product-actions">
                            <button class="edit-button" data-id="${product.id}">Editar</button>
                            <button class="delete-button" data-id="${product.id}">Excluir</button>
                        </div>
                    `;
                    productContainer.appendChild(productItem);
                });

                document.querySelectorAll('.edit-button').forEach(button => {
                    button.addEventListener('click', () => loadProduct(button.getAttribute('data-id')));
                });

                document.querySelectorAll('.delete-button').forEach(button => {
                    button.addEventListener('click', () => deleteProduct(button.getAttribute('data-id')));
                });
            })
            .catch(error => console.error('Erro ao buscar produtos:', error));
    }
    getAllProducts();

    // Clique para enviar as informações do produto
    productForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const newProduct = {
            nome: document.getElementById('nome').value,
            preco: document.getElementById('preco').value,
            imagem: document.getElementById('imagem').value,
            descricao: document.getElementById('descricao').value,
            quantidade: document.getElementById('quantidade').value
        };

        insertProduct(newProduct);
    });

    // Inserir um novo produto
    function insertProduct(product) {
        fetch(`http://localhost:${port}/produtos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        })
        .then(response => {
            if (!response.ok) throw new Error('Erro ao inserir produto.');
            return response.json();
        })
        .then(() => {
            getAllProducts();
            productForm.reset();
        })
        .catch(error => console.error('Erro ao inserir produto:', error));
    }

    // Carregar o produto para edição
    function loadProduct(id) {
        fetch(`http://localhost:${port}/produtos/${id}`)
            .then(response => response.json())
            .then(product => {
                document.getElementById('nome').value = product.nome;
                document.getElementById('preco').value = product.preco;
                document.getElementById('imagem').value = product.imagem;
                document.getElementById('descricao').value = product.descricao;
                document.getElementById('quantidade').value = product.quantidade;
                productIdInput.value = product.id;
                addBtn.style.display = 'none';
                updateBtn.style.display = 'inline-block';
            })
            .catch(error => console.error('Erro ao carregar produto:', error));
    }

    // Clique com a função de salvar alterações no produto
    updateBtn.addEventListener('click', function () {
        const id = productIdInput.value;
        const updatedProduct = {
            nome: document.getElementById('nome').value,
            preco: document.getElementById('preco').value,
            imagem: document.getElementById('imagem').value,
            descricao: document.getElementById('descricao').value,
            quantidade: document.getElementById('quantidade').value
        };

        updateProduct(id, updatedProduct);
    });

    // Atualizar o produto existente
    function updateProduct(id, product) {
        fetch(`http://localhost:${port}/produtos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        })
        .then(response => {
            if (!response.ok) throw new Error('Erro ao atualizar produto.');
            return response.json();
        })
        .then(() => {
            getAllProducts();
            productForm.reset();
            productIdInput.value = '';

            addBtn.style.display = 'inline-block';
            updateBtn.style.display = 'none';
        })
        .catch(error => console.error('Erro ao atualizar produto:', error));
    }

    // Excluir o produto existente
    function deleteProduct(id) {
        if (confirm("Você tem certeza que deseja excluir este produto?")) {
            fetch(`http://localhost:${port}/produtos/${id}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorMessage => {
                        throw new Error(`Erro ao excluir produto com ID ${id}: ${errorMessage}`);
                    });
                }
                console.log(`Produto com ID ${id} excluído com sucesso.`);
                getAllProducts();
            })
            .catch(error => console.error(error));
        }
    }
});
