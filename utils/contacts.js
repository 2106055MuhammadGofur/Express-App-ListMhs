const fs = require('fs')

const dirPath = './data'
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath)
}

const filePath = './data/datas.json'
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf-8')
}

const loadDatas = () => {
    const file = fs.readFileSync('./data/datas.json', 'utf-8')
    const datas = JSON.parse(file)
    return datas
}

const findData = (nama) => {
    const datas = loadDatas()
    const data =  datas.find((data) => data.nama === nama)
    return data
}

const saveData = (datas) => {
    fs.writeFileSync('./data/datas.json', JSON.stringify(datas))
}

const addData = (data) => {
    const datas = loadDatas()
    datas.push(data)
    saveData(datas)
}

const cekDuplikatNama = (nama) => {
    const datas = loadDatas()
    return datas.find((data) => data.nama === nama)

}

const cekDuplikatNim = (nim) => {
    const datas = loadDatas()
    return datas.find((data) => data.nim === nim)

}

const editData = (newData) => {
    const datas = loadDatas()
    const filterData = datas.filter((data) => data.nama !== newData.oldNama)

    delete newData.oldNama
    filterData.push(newData)
    saveData(filterData)
}

const deleteData = (nama) => {
    const datas = loadDatas()

    const filterData = datas.filter((data) => data.nama !== nama)

    saveData(filterData)

}

module.exports = { loadDatas, findData, addData, cekDuplikatNama, cekDuplikatNim , editData, deleteData }
