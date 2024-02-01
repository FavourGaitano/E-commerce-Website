"use strict";
document.addEventListener("DOMContentLoaded", function () {
    let items = JSON.parse(localStorage.getItem('items') || '[]');
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    function displayItems() {
        const general = document.querySelector('.general');
        if (general) {
            general.innerHTML = '';
            items.forEach((item) => {
                const show = document.createElement('div');
                show.className = 'show';
                const pictureUrl = document.createElement('img');
                pictureUrl.setAttribute('src', item.picture);
                pictureUrl.className = 'picture_url';
                const name = document.createElement('div');
                name.textContent = item.title;
                name.className = 'nameTitle';
                const description = document.createElement('div');
                description.textContent = item.desc;
                description.className = 'description';
                const price = document.createElement('div');
                price.textContent = `$${item.price}`;
                price.className = 'price';
                const addToCartBtn = document.createElement('button');
                addToCartBtn.textContent = 'Add to Cart';
                addToCartBtn.className = 'addToCartBtn';
                addToCartBtn.onclick = () => addToCart(item.id);
                show.appendChild(pictureUrl);
                show.appendChild(name);
                show.appendChild(description);
                show.appendChild(price);
                show.appendChild(addToCartBtn);
                general.appendChild(show);
            });
        }
    }
    function addToCart(itemId) {
        const item = cart.find(item => item.id === itemId);
        if (item) {
            item.quantity += 1;
        }
        else {
            cart.push({ id: itemId, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.href = 'cart.html';
    }
    function displayCart() {
        const cartContainer = document.querySelector('#cart-container');
        if (cartContainer) {
            let tableHTML = `<table><thead><tr><th>Item</th><th>Quantity</th><th>Price</th><th>Action</th></tr></thead><tbody>`;
            let total = 0;
            cart.forEach(cartItem => {
                const item = items.find(item => item.id === cartItem.id);
                if (item) {
                    const totalPrice = item.price * cartItem.quantity;
                    total += totalPrice;
                    tableHTML += `<tr>
                                    <td>${item.title}</td>
                                    <td>
                                        <button class="quantity-btn" onclick="window.changeQuantity(${cartItem.id}, -1)">-</button>
                                        ${cartItem.quantity}
                                        <button class="quantity-btn" onclick="window.changeQuantity(${cartItem.id}, 1)">+</button>
                                    </td>
                                    <td>$${totalPrice.toFixed(2)}</td>
                                    <td><button class="remove-btn" onclick="window.removeFromCart(${cartItem.id})">Remove</button></td>
                                </tr>`;
                }
            });
            tableHTML += `<tr>
                            <td colspan="2">Total:</td>
                            <td>$${total.toFixed(2)}</td>
                            <td></td>
                        </tr>`;
            tableHTML += `</tbody></table>`;
            // Add Checkout button
            tableHTML += `<button class="btn1"  onclick="window.checkout()">Checkout</button>`;
            cartContainer.innerHTML = tableHTML;
        }
    }
    function updateCartDisplay() {
        if (window.location.pathname === '/cart.html') {
            displayCart();
            displayYourOrders(); // Display Your Orders table
        }
    }
    window.checkout = function () {
        if (cart.length === 0) {
            alert('Your cart is empty.');
            return;
        }
        const newOrder = {
            id: Date.now(),
            items: [...cart],
            status: 'pending'
        };
        saveOrder(newOrder);
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        displayYourOrders(); // Display Your Orders table
        alert('Order placed successfully!');
    };
    function saveOrder(order) {
        let orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
    }
    window.removeFromCart = function (itemId) {
        cart = cart.filter(item => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        displayYourOrders(); // Update Your Orders table
    };
    window.changeQuantity = function (itemId, change) {
        const item = cart.find(item => item.id === itemId);
        if (item) {
            item.quantity += change;
            if (item.quantity < 1) {
                window.removeFromCart(itemId);
            }
            else {
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartDisplay();
            }
        }
    };
    function displayOrders() {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const ordersContainer = document.querySelector('#orders-container');
        if (ordersContainer) {
            ordersContainer.innerHTML = '';
            orders.forEach(order => {
                const orderDiv = document.createElement('div');
                orderDiv.innerHTML = `Order ID: ${order.id}, Status: ${order.status}`;
                ordersContainer.appendChild(orderDiv);
            });
        }
    }
    function displayYourOrders() {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const ordersContainer = document.querySelector('#your-orders-container');
        if (ordersContainer) {
            ordersContainer.innerHTML = '<h2 class="head">Your Orders</h2>';
            let tableHTML = `<table><thead><tr><th>Order ID</th><th>Items</th><th>Total</th><th>Status</th></tr></thead><tbody>`;
            orders.forEach(order => {
                const total = calculateOrderTotal(order);
                tableHTML += `<tr>
                                <td>${order.id}</td>
                                <td>${displayOrderItems(order.items)}</td>
                                <td>$${total.toFixed(2)}</td>
                                <td>${order.status}</td>
                            </tr>`;
            });
            tableHTML += `</tbody></table>`;
            ordersContainer.innerHTML += tableHTML;
        }
    }
    function displayOrderItems(cartItems) {
        const items = JSON.parse(localStorage.getItem('items') || '[]');
        const itemsList = cartItems.map(cartItem => {
            const item = items.find(item => item.id === cartItem.id);
            return item ? `<li>${item.title} (Qty: ${cartItem.quantity})</li>` : '';
        });
        return `<ul>${itemsList.join('')}</ul>`;
    }
    function calculateOrderTotal(order) {
        return order.items.reduce((total, cartItem) => {
            const item = items.find(item => item.id === cartItem.id);
            if (item) {
                total += item.price * cartItem.quantity;
            }
            return total;
        }, 0);
    }
    if (window.location.pathname === '/cart.html') {
        displayCart();
        displayYourOrders(); // Display Your Orders table
    }
    else {
        displayItems();
        displayOrders();
        displayYourOrders(); // Display Your Orders table
    }
    window.addEventListener('storage', (event) => {
        if (event.key === 'items') {
            items = JSON.parse(event.newValue || '[]');
            displayItems();
        }
        else if (event.key === 'orders') {
            displayOrders();
            displayYourOrders(); // Display Your Orders table
        }
        else if (event.key === 'cart') {
            updateCartDisplay();
        }
    });
});
