const Cart = require('./Cart');
const OrderComputer = require('./OrderComputer');

module.exports = function main(inputs) {
    let cart = new Cart(inputs);
    let orderComputer = new OrderComputer(cart.mergeOrders());
    let inventory = orderComputer.getInventory();
    console.log(inventory);
}