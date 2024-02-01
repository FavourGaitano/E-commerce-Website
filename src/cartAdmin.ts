type OrderStatus = 'pending' | 'in transit' | 'delivered';

interface Item {
    id: number;
    title: string;
    price: number;
}

interface CartItem {
    id: number;
    quantity: number;
    status: OrderStatus; // Add status property
}

interface Order {
    id: number;
    items: CartItem[];
    status: OrderStatus;
}

function displayOrders() {
    const orders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
    const ordersContainer = document.querySelector('#admin-orders-container');

    if (ordersContainer) {
        let tableHTML = "<table><tr><th>Order ID</th><th>Items</th><th>Total</th><th>Status</th><th>Action</th></tr>";
        orders.forEach(order => {
            const total = calculateOrderTotal(order);
            tableHTML += `<tr>
                <td>${order.id}</td>
                <td>${displayOrderItems(order.items)}</td>
                <td>$${total.toFixed(2)}</td>
                <td>${order.status}</td>
                <td><button class="btn0" onclick="changeStatus(${order.id}, 'in transit')">Mark as In Transit</button></td>
            </tr>`;
        });
        tableHTML += "</table>";
        ordersContainer.innerHTML = tableHTML;
    }
}

function displayOrderItems(cartItems: CartItem[]): string {
    const items: Item[] = JSON.parse(localStorage.getItem('items') || '[]');
    const itemsList = cartItems.map(cartItem => {
        const item = items.find(item => item.id === cartItem.id);
        return item ? `<li>${item.title} (Qty: ${cartItem.quantity})</li>` : '';
    });
    return `<ul>${itemsList.join('')}</ul>`;
}

function calculateOrderTotal(order: Order): number {
    const items: Item[] = JSON.parse(localStorage.getItem('items') || '[]');
    return order.items.reduce((total, cartItem) => {
        const item = items.find(item => item.id === cartItem.id);
        if (item) {
            total += item.price * cartItem.quantity;
        }
        return total;
    }, 0);
}

function changeStatus(orderId: number, newStatus: OrderStatus) {
    // Update status in local storage
    const orders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedOrders = orders.map(order => {
        if (order.id === orderId) {
            return { ...order, status: newStatus };
        }
        return order;
    });
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    // Update admin orders display
    displayOrders();
}

document.addEventListener("DOMContentLoaded", function () {
    // Add HTML elements dynamically using JavaScript
    const cartDiv = document.createElement('div');
    cartDiv.className = 'cart';
    document.body.appendChild(cartDiv);

    const adminOrdersContainer = document.createElement('div');
    adminOrdersContainer.id = 'admin-orders-container';
    cartDiv.appendChild(adminOrdersContainer);

    // Display admin orders
    displayOrders();
});
