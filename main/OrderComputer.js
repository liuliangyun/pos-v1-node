const DataBase = require ('./datbase.js');

module.exports = class OrderComputer{
    constructor(orders){
        this.orders = orders;
        this.promotions = DataBase.loadPromotions();
    }

    getInventory(){
        let result = '***<没钱赚商店>购物清单***\n';
        result += this.getShoppingList().join('\n') + '\n';
        result += '----------------------\n';
        result += "挥泪赠送商品：\n";
        result += this.getPromotionList().join('\n')+'\n';
        result += '----------------------\n';
        result += `总计：${this.getSum().toFixed(2)}(元)\n`;
        result += `节省：${this.getSavedSum().toFixed(2)}(元)\n`;
        result += '**********************';
        return result;
    }

    getShoppingList(){
        let infos = this.orders.map(order => {
            let total = order.price * (order.count - this.getSavedCount(order));
            return `名称：${order.name}，数量：${order.count}${order.unit}，单价：${order.price.toFixed(2)}(元)，小计：${total.toFixed(2)}(元)`;
        });
        return infos;
    }

    getPromotionList(){
        let infos = this.orders.map(order => {
            let savedCount = this.getSavedCount(order);
            if (savedCount === 0) return "";
            return `名称：${order.name}，数量：${savedCount}${order.unit}`;
        }).filter(info => info !== "");
        return infos;
    }

    getSum(){
        return this.orders.reduce((total, order) => {
            return total + order.price * (order.count - this.getSavedCount(order));
        }, 0.0);
    }

    getSavedSum(){
        return this.orders.reduce((total, order) => {
            return total + order.price * this.getSavedCount(order);
        }, 0.0);
    }

    getSavedCount(order){
        return this.isBuyTwoAndOneFree(order.barcode) ? Math.floor(order.count / 3) : 0;
    }

    isBuyTwoAndOneFree(barcode){
        return this.promotions.find(promotion => 
            promotion.type === 'BUY_TWO_GET_ONE_FREE').barcodes.includes(barcode);
    }
}