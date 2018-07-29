const DataBase = require ('./datbase.js');

module.exports = class Order{
    constructor(barcode,count){
        this.barcode = barcode;
        this.count = count;
        let order = DataBase.loadAllItems().find(item => item.barcode === barcode);
        this.price = order.price;
        this.unit = order.unit;
        this.name = order.name;
    }

    static parse(input){
        if(input.includes('-')){
            let array = input.split('-');
            return new Order(array[0],array[1]);
        }else{
            return new Order(input,1);
        }
    }
}