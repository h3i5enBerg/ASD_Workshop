const express = require('express');
const app = express();
const port = 3000;
const path = require('path')
const fs = require("fs/promises");
const { rejects } = require('assert');

let filePath = path.join(__dirname, "db.json")

async function readData() {
    let data = await fs.readFile(filePath, "utf-8")
    return JSON.parse(data)
}

async function delayReadData() {
    await new Promise((resolve, reject) => {
        setTimeout(() => resolve() , 1500)
    })
    return await readData()
}

app.get('/products', async (req, res) => {
    try {
        let products = await delayReadData()
        res.json(products)
    } catch (error) {
        res.send(error)
    }
});

app.get('/products/:id', async (req, res) => {

    try {
        let id = Number(req.params.id)
        let products = await delayReadData()
        let data = products.find((item) => item.id == id)
        res.json(data)
    } catch (error) {
        res.send(error)
    }

});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});


let cache = {}
// "/products" - []
// "/products/1" - {}
// "/products/2" - {}