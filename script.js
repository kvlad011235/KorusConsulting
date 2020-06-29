window.addEventListener("DOMContentLoaded", () => {

    "use strict";

    const tragedy = {
        'name':'tragedy',
        'price': 40000,
        'audience': 30
    };

    const comedy = {
        'name':'comedy',
        'price': 30000,
        'audience': 20
    };

    // функция конвертер
    const format = new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        minimumFractionDigits: 2
    }).format;



    // функция агрегатор
    function calculatePrice(invoice, performances) {
       
        const price = _calcPrice(performances);
        const bonus = _calcBonus(performances);
    
        let result = 
        `
        Счет для ${invoice.customer}.
        Итого с вас ${format(price/100)}.
        Вы заработали ${bonus} бонусов.
        \n
        `;

        return console.log(result);
    }

    // расчет стоимости
    function _calcPrice(performances) {
        const _arr = performances;
        let finalAmount = 0;
        let thisAmount = 0;
        _arr.forEach((play) => {
            switch (play.type) {
                case "tragedy":
                    thisAmount = tragedy.price;
                    if (play.audience > tragedy.audience) {
                        thisAmount += 1000 * (play.audience - 30);
                    }
                    finalAmount += thisAmount;
                    break;
                case "comedy":
                    thisAmount = comedy.price;
                    if (play.audience > comedy.audience) {
                        thisAmount += 10000 + 500 * (play.audience - 20);
                    }
                    thisAmount += 300 * play.audience;
                    finalAmount += thisAmount;
                    break;
                default:
                    throw new Error(`неизвестный тип: ${play.type}`);
            }
        });
        return finalAmount;
    }

    // расчет бонусов
    function _calcBonus(performances) {
        const _arr = performances;
        let volumeCredits=0;
        let count=0;
        _arr.forEach((play) => {
            volumeCredits += Math.max(play.audience - 30, 0);
            
            if (comedy.name === play.type) {
                count++;
            }

            if(count % 10 !== 0) {
                volumeCredits += Math.floor(play.audience / 5);
            }
        });

        if(isNaN(volumeCredits)) {
            volumeCredits = 0;
        }
        return volumeCredits;
    }



    // запрос за данными
    const getResource = async (url) => { 
        let res = await fetch(url);
        if(!res.ok) {
            throw new Error(`Couldnt fetch ${url}, status: ${res.status}`);
        }
        return await res.json(); 
    };

    getResource("http://localhost:3000/orders")
    .then(res => {
        console.log(res);
        calculatePrice(res[0],res[0].performance);
    })
    .catch(res => console.log(res));

});