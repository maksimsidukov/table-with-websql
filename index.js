const db = openDatabase("myDB", "0.1", "My db for test example", 200000);

if(!db){alert("Failed to connect to database.");}

const suppliers = ['ABS-AUTO', 'Alfa-NW', 'All4Motors', 'Amtel', 'Aurore Auto', 'Автоспутник', 'АвтоЕвро', 'АвтоСпейс', 'Автотрейд', 'Faeton37'];
const warehouses = ['МСК', 'НН', "Екатеренбург", "Челябинск", "Санкт-Путербург", "Краснодар", "Нижнекамск", "Сочи", "Норильск", "Владивосток"];
const products = ["Кардан", "Колесо", "Свечи", "Форсунки", "ДВС", "Трансмиссия", "Стойки стабилизатора", "Дверь", "Капот", "ДХХ"];

const dropTableButton = document.getElementById('drop_table_button');
const createTableButton = document.getElementById('create_table_button');
const createRandomData = document.getElementById('create_random_data_button');
const updateTableButton = document.getElementById('update_table_button');
const tableBody = document.getElementById('table_body');
const startDate = document.getElementById('start_date');
const endDate = document.getElementById('end_date');
const supplier = document.getElementById('supplier');
const warehouse = document.getElementById('warehouse');
const productName = document.getElementById('product_name');
const startCount = document.getElementById('start_count');
const endCount = document.getElementById('end_count');
const startSumm = document.getElementById('start_summ');
const endSumm = document.getElementById('end_summ');

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const createTable = () => {
    db.transaction(tx => {
        tx.executeSql("CREATE TABLE data (_id INTEGER PRIMARY KEY AUTOINCREMENT, date REAL, supplier_name TEXT, warehouse TEXT, product_name TEXT, count INTEGER, summ INTEGER)",
            [], err => console.log("Таблица не создана, ошибка: ", err), () => console.log("Таблица создана"))
    });
}

const dropTable = () => {
    db.transaction(tx => {
        tx.executeSql("DROP TABLE data",
            [], null, null)
    })
}

const addToTable = info => {
    db.transaction(tx => {
        tx.executeSql("INSERT INTO data (date, supplier_name, warehouse, product_name, count, summ) values(?, ?, ?, ?, ?, ?)",
            [info.date, info.supplier_name, info.warehouse, info.product_name, info.count, info.summ], null, null)
    })
}

const deleteFromTable = id => {
    db.transaction(tx => {
        tx.executeSql("DELETE FROM data WHERE _id=?",
            [id], null, null)
    })
}

const updateInTable = (id, newData) => {
    db.transaction(tx => {
        tx.executeSql("UPDATE data SET date=?, supplier_name=?, warehouse=?, product_name=?, count=?, summ=? WHERE _id=?",
            [newData.date, newData.supplier_name, newData.warehouse, newData.product_name, newData.count, newData.summ, id],
            null, null)
    })
}

const printData = () => {
    const createData = data => {
        for(let i = 0; i < data.rows.length; i++) {
            const tr = document.createElement('tr');
            const idTd = document.createElement('td');
            const dateTd = document.createElement('td');
            const supplierTd = document.createElement('td');
            const warehouseTd = document.createElement('td');
            const productTd = document.createElement('td');
            const countTd = document.createElement('td');
            const summTd = document.createElement('td');

            idTd.innerText = data.rows.item(i)['_id'];
            dateTd.innerText = new Date(data.rows.item(i)['date']);
            supplierTd.innerText = data.rows.item(i)['supplier_name'];
            warehouseTd.innerText = data.rows.item(i)['warehouse'];
            productTd.innerText = data.rows.item(i)['product_name'];
            countTd.innerText = data.rows.item(i)['count'];
            summTd.innerText = data.rows.item(i)['summ'];

            tr.append(idTd, dateTd, supplierTd, warehouseTd, productTd, countTd, summTd);
            tableBody.appendChild(tr);
        }};
    const generateFilterSQLString = () => {
        let resultStr = '';
        const startDateString = startDate.value ? `date >= ${Date.parse(startDate.value)}` : null;
        const endDateString = endDate.value ? `date <= ${Date.parse(endDate.value)}` : null;
        const supplierString = supplier.value ? `supplier_name LIKE '%${supplier.value}%'` : null;
        const warehouseString = warehouse.value ? `warehouse LIKE '%${warehouse.value}%'` : null;
        const productNameString = productName.value ? `product_name LIKE '%${productName.value}%'` : null;
        const startCountString = startCount.value ? `count >= ${startCount.value}` : null;
        const endCountString = endCount.value ? `count <= ${endCount.value}` : null;
        const startSummString = startSumm.value ? `summ >= ${startSumm.value}` : null;
        const endSummString = endSumm.value ? `summ <= ${endSumm.value}` : null;

        const stringsArray = [startDateString, endDateString, supplierString, warehouseString, productNameString,
        startCountString, endCountString, startSummString, endSummString]

        stringsArray.forEach(str => {
            if (str) {
                resultStr = `${resultStr} AND ${str}`
            }
        })

        return resultStr.substr(5);
    };
    const sqlString = generateFilterSQLString();

    tableBody.innerHTML = '';

    db.transaction(tx => {
        tx.executeSql(`SELECT * FROM data ${sqlString.length ? `WHERE ${sqlString}` : ''}`,
            [],
            (tx, result) => createData(result), null)
    });
}

const createRandomDate = () => {
    for (let i = 1; i <= 100; i++){
        addToTable({
            date: new Date(getRandom(1577775543573, 1609397838792)).getTime(),
            supplier_name: suppliers[getRandom(0, 9)],
            warehouse: warehouses[getRandom(0, 9)],
            product_name: products[getRandom(0, 9)],
            count: getRandom(0, 50),
            summ: getRandom(1000, 1000000)
        })
    }
}
printData();

dropTableButton.onclick = () => dropTable();
createTableButton.onclick = () => createTable();
createRandomData.onclick = () => createRandomDate();
updateTableButton.onclick = () => printData();
