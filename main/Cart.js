const Order = require ('./Order.js');

module.exports = class Cart{
    constructor(inputs){
        this.orders = this.getOrders(inputs);
    }

    getOrders(inputs){
        return inputs.map(input => Order.parse(input));
    }

    mergeOrders(){
        let mergedOrders = [];
        for(let i=0;i<this.orders.length;i++){
            let targetOrder = mergedOrders.find(mergedOrder => mergedOrder.barcode === this.orders[i].barcode);
            if(targetOrder != undefined){
                targetOrder.count += this.orders[i].count;
            }else{
                mergedOrders.push(this.orders[i]);
            }
        }
        return mergedOrders;
    }
}