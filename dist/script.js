const displayData = document.getElementById('displayData');
const inputCurrentPage = document.getElementById('inputCurrentPage');
const inputLimit = document.getElementById('inputLimit');
const inputSearch = document.getElementById('inputSearch');
const totalPagesElement = document.getElementById('totalPages');

const apiUrl = 'https://clubwebdev-backend.vercel.app/api/news';

inputLimit.value = 5;
inputCurrentPage.value = 1;

let totalPages = 1;

const fetchData = async () => {
    try {
        const title = inputSearch.value;
        let limit = inputLimit.value;
        let currentPage = inputCurrentPage.value;

        limit = Math.max(1, limit);

        let url = `${apiUrl}?`;

        if (limit) {
            url += `limit=${limit}`;
        }
        if (currentPage) {
            currentPage = Math.min(Math.max(1, currentPage), totalPages);
            url += `&currentPage=${currentPage}`;
            inputCurrentPage.value = currentPage;
        }
        if (title) {
            url += `&title=${title}`;
        }

        const response = await fetch(url);
        const { data, totalItems } = await response.json();

        totalPages = Math.ceil(totalItems / limit);

        document.getElementById('totalPages').textContent = totalPages;
        document.getElementById('currentPage').textContent = currentPage;

        displayData.innerHTML = `
            ${data.map((item) => `
                <div class="text-white border border-solid border-[#ccc] p-[10px] mb-[10px] gap-[5px] w-[500px] flex text-center flex-col items-center">
                    <img src="${item.imageURL}" alt="News Image" class="w-2/5 mb-[5px]">
                    <div class="mb-[5px] font-bold">${item.title}</div>
                    <div class="mb-[5px]">${item.content}</div>
                    <div class="mb-[5px]">Author: ${item.author}</div>
                </div>
            `).join('')}
        `;
    } catch (error) {
        console.error(error);
    }
};

inputLimit.addEventListener('input', () => {
    if (inputLimit.value < 1) {
        inputLimit.value = 1;
    }
    inputCurrentPage.value = 1;  
    fetchData();
});

inputCurrentPage.addEventListener('input', () => {
    const currentPage = Math.min(Math.max(1, inputCurrentPage.value), totalPages);
    inputCurrentPage.value = currentPage;
    fetchData();
});
inputSearch.addEventListener('input', () => {
    inputCurrentPage.value = 1;
    fetchData();
});

fetchData();