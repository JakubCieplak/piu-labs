const api = new Ajax({
    baseURL: 'https://jsonplaceholder.typicode.com',
    timeout: 5000
});

const btnFetch = document.getElementById('btn-fetch');
const btnError = document.getElementById('btn-error');
const btnReset = document.getElementById('btn-reset');
const errorDiv = document.getElementById('error');
const loader = document.getElementById('loader');
const list = document.getElementById('list');

function showLoader() {
    loader.classList.add('visible');
}

function hideLoader() {
    loader.classList.remove('visible');
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.add('visible');
}

function hideError() {
    errorDiv.classList.remove('visible');
}

function clearList() {
    list.innerHTML = '';
}

function renderPosts(posts) {
    posts.forEach(post => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${post.title}</strong><span>${post.body}</span>`;
        list.appendChild(li);
    });
}

btnFetch.addEventListener('click', async () => {
    hideError();
    clearList();
    showLoader();

    try {
        const posts = await api.get('/posts?_limit=10');
        renderPosts(posts);
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoader();
    }
});

btnError.addEventListener('click', async () => {
    hideError();
    clearList();
    showLoader();

    try {
        await api.get('/invalid-endpoint');
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoader();
    }
});

btnReset.addEventListener('click', () => {
    hideError();
    clearList();
    hideLoader();
});
