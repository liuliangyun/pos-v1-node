const database = require('../main/datbase');

module.exports = function main(inputs) {
    let expectText = '***<没钱赚商店>购物清单***\n';
    const splitLine1 = '----------------------\n';
    const splitLine2 = '**********************';
    let allItems = database.loadAllItems();
    let promotions = database.loadPromotions()[0].barcodes;

    let count = {};
    for (let i = 0; i < inputs.length; i++) {
        let value = inputs[i];
        if (value.indexOf('-') === -1 && count[value]) {
            count[value]++;
        }
        else if(value.indexOf('-') === -1){
            count[value] = 1;
        }
        else {
            let times = value.split("-")[1];
            count[value.split("-")[0]] = times;
        }
    }

    let barcodeArr = inputs.map(x => x.split("-")[0]);
    let inputsArr = barcodeArr.filter(function(x, index, arr){
        return arr.indexOf(x) === index;
    });

    var shoppingText = '';
    var promotionText = '';
    var sum = 0;
    var freeSum = 0;
    for(let i=0; i< inputsArr.length;i++){
        let x = inputsArr[i];
        for(let j=0;j<allItems.length;j++){
            obj = allItems[j];
            if(obj.barcode == x){
                let temp = 0;
                if (count[x] >= 3 && promotions.includes(x)){
                    let freeCount = Math.floor(count[x] / 3);
                    freeSum += freeCount * obj.price;
                    temp = (count[x]-freeCount) * obj.price;
                    promotionText += '名称：' + obj.name + '，数量：' + freeCount + obj.unit + '\n';
                }
                else{
                    temp = count[x] * obj.price;
                }
                sum += temp;
                shoppingText += '名称：' + obj.name + '，数量：' + count[x] + obj.unit + '，单价：'
                                     + obj.price.toFixed(2) + '(元)，小计：' + temp.toFixed(2) + '(元)\n';
                break;
            }
        }
    }

    expectText += shoppingText + splitLine1;
    expectText += '挥泪赠送商品：\n';
    expectText += promotionText + splitLine1;
    expectText += '总计：' + sum.toFixed(2) + '(元)\n' + '节省：' + freeSum.toFixed(2) + '(元)\n' + splitLine2;

    console.log(expectText);
};