/* ==========================================================================
   RESPEITO SAGRADO - LÓGICA PRINCIPAL (STATE E INTERAÇÕES)
   ========================================================================== */

// 1. GERENCIAMENTO DE ESTADO (Simulando um Banco de Dados)
const AppState = {
    // Busca os posts salvos no navegador ou inicia um array vazio
    posts: JSON.parse(localStorage.getItem("respeito_sagrado_posts")) || []
};

// 2. LÓGICA DO FEED (Executado no index.html)
function renderFeed() {
    const feedContainer = document.querySelector(".feed-grid"); 
    if (!feedContainer) return; // Se não estiver na página index, ignora

    // Cria o HTML para cada post salvo no LocalStorage
    const dynamicPostsHTML = AppState.posts.map((post, index) => `
        <article class="post post-text animate-fade-in">
            <div class="post-body">
                <span class="category">Comunidade</span>
                <h3 class="post-title" style="font-size: 1.1rem; margin-top: 10px;">${post.caption}</h3>
                
                ${post.image ? `<img src="${post.image}" style="width: 100%; border-radius: var(--radius-sm); margin: 15px 0; object-fit: cover; max-height: 400px;" alt="Imagem do usuário">` : ''}
                
                <div class="post-actions">
                    <button class="action-btn like-btn" onclick="handleLike(${index})">
                        ❤️ <span class="count">${post.likes}</span>
                    </button>
                    <button class="action-btn comment-btn">💬 <span class="count">0</span></button>
                </div>
            </div>
        </article>
    `).join('');

    // Insere os posts novos no topo do feed (logo após o primeiro post hero, se houver)
    feedContainer.insertAdjacentHTML('afterbegin', dynamicPostsHTML);
}

// Função de Curtir
window.handleLike = function(index) {
    AppState.posts[index].likes++;
    localStorage.setItem("respeito_sagrado_posts", JSON.stringify(AppState.posts));
    location.reload(); // Recarrega a página levemente para atualizar o número
};

// 3. LÓGICA DE CRIAÇÃO DE POST (Executado no post.html)
function initPostCreation() {
    const imageInput = document.getElementById("imageInput");
    const uploadArea = document.querySelector(".upload-area");
    const captionInput = document.getElementById("caption");
    const postBtn = document.getElementById("postBtn");
    
    let selectedImageBase64 = null;

    if (!imageInput || !postBtn) return; // Se não estiver na página de criar post, ignora

    // A. Preview da Imagem Selecionada
    imageInput.addEventListener("change", function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                selectedImageBase64 = event.target.result;
                // Substitui o ícone pela imagem selecionada
                uploadArea.innerHTML = `<img src="${selectedImageBase64}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: var(--radius-sm); box-shadow: var(--shadow-sm);">`;
                uploadArea.style.padding = "0";
                uploadArea.style.border = "none";
                uploadArea.style.background = "transparent";
            };
            reader.readAsDataURL(file); // Converte a imagem para texto (Base64) para salvar no LocalStorage
        }
    });

    // B. Publicar o Post
    postBtn.addEventListener("click", function() {
        const caption = captionInput.value.trim();
        
        if (!caption && !selectedImageBase64) {
            alert("Axé! Por favor, adicione um texto ou uma imagem para compartilhar com a comunidade.");
            return;
        }

        // Cria o objeto do novo post
        const newPost = {
            id: Date.now(),
            caption: caption,
            image: selectedImageBase64,
            likes: 0,
            date: new Date().toISOString()
        };

        // Salva e Redireciona
        AppState.posts.unshift(newPost); // Coloca o post mais novo no início do Array
        localStorage.setItem("respeito_sagrado_posts", JSON.stringify(AppState.posts));
        
        // Efeito visual no botão
        postBtn.innerText = "Publicando...";
        postBtn.style.opacity = "0.8";

        setTimeout(() => {
            window.location.href = "index.html"; // Volta para o feed
        }, 500);
    });
}

// 4. LÓGICA DE BUSCA (Executado no explore.html)
function initExploreSearch() {
    const searchBar = document.querySelector(".search-bar");
    const exploreItems = document.querySelectorAll(".explore-item");

    if (!searchBar) return;

    searchBar.addEventListener("input", function(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        exploreItems.forEach(item => {
            // Pega o texto do atributo 'alt' da imagem ou o texto interno do botão
            const content = item.querySelector("img") ? item.querySelector("img").alt.toLowerCase() : item.innerText.toLowerCase();
            
            if (content.includes(searchTerm)) {
                item.style.display = ""; // Mostra
                item.style.animation = "fadeIn 0.3s ease";
            } else {
                item.style.display = "none"; // Esconde
            }
        });
    });
}

// 5. INICIALIZAÇÃO GERAL
// Assim que o HTML da página terminar de carregar, os scripts entram em ação
document.addEventListener("DOMContentLoaded", () => {
    renderFeed();
    initPostCreation();
    initExploreSearch();
});