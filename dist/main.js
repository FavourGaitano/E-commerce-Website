"use strict";
document.addEventListener("DOMContentLoaded", function () {
    let addform = document.querySelector('#form');
    let picture = document.querySelector('#picture');
    let title = document.querySelector('#title');
    let desc = document.querySelector('#desc');
    let price = document.querySelector('#prc');
    function getItems() {
        return JSON.parse(localStorage.getItem('items') || '[]');
    }
    function saveItems(items) {
        localStorage.setItem('items', JSON.stringify(items));
    }
    if (window.location.pathname.endsWith('/add.html')) {
        addform.addEventListener('submit', (e) => {
            e.preventDefault();
            let items = getItems();
            let newItem = {
                id: Math.max(0, ...items.map(item => item.id)) + 1, // Ensures a unique ID
                picture: picture.value.trim(),
                title: title.value.trim(),
                desc: desc.value.trim(),
                price: parseInt(price.value.trim())
            };
            items.push(newItem);
            saveItems(items);
            picture.value = '';
            title.value = '';
            desc.value = '';
            price.value = '';
        });
    }
    if (window.location.pathname.endsWith('/update.html')) {
        let form = document.querySelector('#form0');
        let pictureInput = document.querySelector('#picture');
        let titleInput = document.querySelector('#title');
        let descInput = document.querySelector('#desc');
        let priceInput = document.querySelector('#prc');
        const urlParams = new URLSearchParams(window.location.search);
        const itemId = parseInt(urlParams.get('id') || '0');
        // Pre-fill form if item exists
        const items = getItems();
        const itemToEdit = items.find(item => item.id === itemId);
        if (itemToEdit) {
            pictureInput.value = itemToEdit.picture;
            titleInput.value = itemToEdit.title;
            descInput.value = itemToEdit.desc;
            priceInput.value = itemToEdit.price.toString();
        }
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (itemToEdit) {
                itemToEdit.picture = pictureInput.value.trim();
                itemToEdit.title = titleInput.value.trim();
                itemToEdit.desc = descInput.value.trim();
                itemToEdit.price = parseInt(priceInput.value.trim());
                saveItems(items);
            }
            window.location.href = '/index.html';
        });
    }
    class ItemActions {
        displayItems() {
            let general = document.querySelector('.general');
            general.innerHTML = '';
            let items = getItems();
            items.forEach((item) => {
                let show = document.createElement('div');
                show.className = 'show';
                let picture_url = document.createElement('img');
                picture_url.setAttribute('src', item.picture);
                picture_url.className = 'picture_url';
                let name = document.createElement('div');
                name.textContent = item.title;
                name.className = 'nameTitle';
                let description = document.createElement('div');
                description.textContent = item.desc;
                description.className = 'description';
                let price = document.createElement('div');
                price.textContent = `$${item.price}`;
                price.className = 'price';
                let deletebtn = document.createElement('button');
                deletebtn.textContent = 'Delete';
                deletebtn.className = 'deletebtn';
                deletebtn.dataset.id = item.id.toString();
                deletebtn.addEventListener('click', () => this.deleteItem(parseInt(deletebtn.dataset.id || '0')));
                let editbtn = document.createElement('button');
                editbtn.textContent = 'Update';
                editbtn.className = 'editbtn';
                editbtn.dataset.id = item.id.toString();
                editbtn.addEventListener('click', () => this.editItem(parseInt(editbtn.dataset.id || '0')));
                show.appendChild(picture_url);
                show.appendChild(name);
                show.appendChild(description);
                show.appendChild(price);
                show.appendChild(deletebtn);
                show.appendChild(editbtn);
                general.appendChild(show);
            });
        }
        deleteItem(itemId) {
            let items = getItems();
            items = items.filter(item => item.id !== itemId);
            saveItems(items);
            this.displayItems();
        }
        editItem(itemId) {
            const items = getItems();
            const itemToEdit = items.find(item => item.id === itemId);
            if (itemToEdit) {
                const queryParams = `?id=${itemToEdit.id}&picture=${encodeURIComponent(itemToEdit.picture)}&title=${encodeURIComponent(itemToEdit.title)}&desc=${encodeURIComponent(itemToEdit.desc)}&price=${itemToEdit.price}`;
                window.location.href = `update.html${queryParams}`;
            }
        }
    }
    let instance = new ItemActions();
    if (window.location.pathname.endsWith('/index.html')) {
        instance.displayItems();
    }
});
