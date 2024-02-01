document.addEventListener("DOMContentLoaded", function () {
    // Code for add.html
    let addform = document.querySelector('#form') as HTMLFormElement;

    let picture = document.querySelector('#picture') as HTMLInputElement;
    let title = document.querySelector('#title') as HTMLInputElement;
    let desc = document.querySelector('#desc') as HTMLInputElement;
    let price = document.querySelector('#prc') as HTMLInputElement;

    let itemIndex: number; //

    interface Item {
        id: number;
        picture: string;
        title: string;
        desc: string;
        price: number;
    }

    let items: Item[] = [];

    // Retrieve items from local storage on page load
    const storedItems = localStorage.getItem('items');
    if (storedItems) {
        items = JSON.parse(storedItems);
    }

    if (window.location.pathname === '/add.html') {
        addform.addEventListener('submit', (e) => {
            e.preventDefault();

            if (picture.value.trim() && title.value.trim() && desc.value.trim() && price.value.trim()) {
                let itemDetails: Item = {
                    id: items.length + 1,
                    picture: picture.value.trim(),
                    title: title.value.trim(),
                    desc: desc.value.trim(),
                    price: parseInt(price.value.trim())
                };

                items.push(itemDetails);
                localStorage.setItem('items', JSON.stringify(items));

                picture.value = '';
                title.value = '';
                desc.value = '';
                price.value = '';
            }
        });
    }

    // Code for update.html
    if (window.location.pathname === '/update.html') {
        let form = document.querySelector('#form0') as HTMLFormElement;
        let pictureInput = document.querySelector('#picture') as HTMLInputElement;
        let titleInput = document.querySelector('#title') as HTMLInputElement;
        let descInput = document.querySelector('#desc') as HTMLInputElement;
        let priceInput = document.querySelector('#prc') as HTMLInputElement;

        const urlParams = new URLSearchParams(window.location.search);
        const preFilledPicture = urlParams.get('picture') || '';
        const preFilledTitle = urlParams.get('title') || '';
        const preFilledDesc = urlParams.get('desc') || '';
        const preFilledPrice = urlParams.get('price') || '';

        pictureInput.value = decodeURIComponent(preFilledPicture);
        titleInput.value = decodeURIComponent(preFilledTitle);
        descInput.value = decodeURIComponent(preFilledDesc);
        priceInput.value = preFilledPrice;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const updatedPicture = pictureInput.value.trim();
            const updatedTitle = titleInput.value.trim();
            const updatedDesc = descInput.value.trim();
            const updatedPrice = priceInput.value.trim();

            const updatedItem: Item = {
                id: parseInt(urlParams.get('id') || '0'),
                picture: updatedPicture,
                title: updatedTitle,
                desc: updatedDesc,
                price: parseInt(updatedPrice)
            };

            const index = items.findIndex(item => item.id === updatedItem.id);
            if (index !== -1) {
                items[index] = updatedItem;
                localStorage.setItem('items', JSON.stringify(items));
            }

            window.location.href = '/index.html';
        });
    }

    class ItemActions {

        displayItems() {
            let general = document.querySelector('.general') as HTMLDivElement;
            general.innerHTML = '';

            items.forEach((item: Item) => {
                let show = document.createElement('div');
                show.className = 'show';
                show.style.background = 'white';

                let picture_url = document.createElement('img') as HTMLImageElement;
                picture_url.setAttribute('src', item.picture);
                picture_url.className = 'picture_url';

                let name = document.createElement('div') as HTMLDivElement;
                name.textContent = item.title;
                name.className = 'nameTitle';

                let description = document.createElement('div') as HTMLDivElement;
                description.textContent = item.desc;
                description.className = 'description';

                let price = document.createElement('div') as HTMLDivElement;
                price.textContent = `$${item.price}`;
                price.className = 'price';

                let deletebtn = document.createElement('button');
                deletebtn.textContent = 'Delete';
                deletebtn.className = 'deletebtn';
                deletebtn.dataset.id = item.id.toString();
                deletebtn.addEventListener('click', (event) => {
                    const id = parseInt((event.currentTarget as HTMLElement).dataset.id || '0');

                    this.deleteItem(id);
                });

                let editbtn = document.createElement('button');
                editbtn.textContent = 'Update';
                editbtn.className = 'editbtn';
                editbtn.dataset.id = item.id.toString();
                editbtn.addEventListener('click', (event) => {
                    const id = parseInt((event.currentTarget as HTMLElement).dataset.id || '0');

                    this.editItem(id);
                });

                show.appendChild(picture_url);
                show.appendChild(name);
                show.appendChild(description);
                show.appendChild(price);
                show.appendChild(deletebtn);
                show.appendChild(editbtn);

                general.appendChild(show);
            });
        }

        deleteItem(itemId: number) {
            const index = items.findIndex(item => item.id === itemId);
            if (index !== -1) {
                items.splice(index, 1);
                localStorage.setItem('items', JSON.stringify(items));
                this.displayItems();
            }
        }

        editItem(itemId: number) {
            const itemToEdit = items.find(item => item.id === itemId);
            if (itemToEdit) {
                const queryParams = `?id=${itemToEdit.id}&picture=${encodeURIComponent(itemToEdit.picture)}&title=${encodeURIComponent(itemToEdit.title)}&desc=${encodeURIComponent(itemToEdit.desc)}&price=${itemToEdit.price}`;
                window.location.href = `update.html${queryParams}`;
            }
        }
    }

    let instance = new ItemActions();

    if (window.location.pathname === '/index.html') {
        instance.displayItems();
    }
});
