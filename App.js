const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const session = require('express-session')
const { body, validationResult } = require('express-validator');
const { loadDatas, findData, addData, cekDuplikatNama, cekDuplikatNim, editData, deleteData } = require('./utils/contacts')

const app = express()
const port = 3000


app.set('view engine','ejs')
app.use(express.static('public'))
app.use(expressLayouts)
app.use(express.urlencoded({extended:true}))
app.use(cookieParser('secret'))
app.use(session({
    cookie: {maxAge:6000},
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

app.get('/', (req, res) => {
    const datas = loadDatas()

    res.render('index', {
        title: 'Home',
        layout: 'layouts/main-layout',
        datas
    })
})

app.get('/member', (req, res) => {
    const datas = loadDatas()

    res.render('member', {
        title: 'Member',
        layout: 'layouts/main-layout',
        datas,
        msg: req.flash('msg')
    })
})

app.post('/member', [
    body('nama').custom((value) => {
        const duplikat = cekDuplikatNama(value)
        if (duplikat) {
            throw new Error ('Nama sudah digunakan')
        }
        return true
    }),
    body('nim').custom((value) => {
        const duplikat = cekDuplikatNim(value)
        if (duplikat) {
            throw new Error ('Nim tidak boleh sama')
        }
        return true
        }),
],
    (req, res) => { 
    const error = validationResult(req);
    if (!error.isEmpty()) {
        // res.send({ errors: error.array() });
        res.render('add-data', {
            title: 'Tambah Data',
            layout: 'layouts/main-layout',
            errors: error.array() 
        })
    } else {
        addData(req.body)

        req.flash('msg', 'Data berhasil ditambahkan')

        res.redirect('/member')
    }
})

app.get('/member/add', (req, res) => {
    res.render('add-data', {
        title: 'Tambah Data',
        layout: 'layouts/main-layout'
    })
})

app.get('/member/detail/:nama', (req, res) => {
    const data = findData(req.params.nama)
    
    res.render('detail', {
        title: 'Detail',
        layout: 'layouts/main-layout',
        data
    })
})

app.get('/member/edit/:nama', (req, res) => {
    const data = findData(req.params.nama)

    if (!data) {
        res.status(404)
        res.send('Data tidak ada')

    } else {
        res.render('edit-data', {
            title: 'Edit',
            layout: 'layouts/main-layout',
            data
        })
    }
})
app.get('/member/delete/:nama', (req, res) => {
    const data = findData(req.params.nama)
    if(!data) {
        res.status(404)
        res.send('Not Found')
    } else {
        deleteData(req.params.nama)
        req.flash('msg', 'Data berhasil dihapus')
        res.redirect('/member')
    }

})

app.post('/member/update', [
    body('nama').custom((value, {req}) => {
        const duplikat = cekDuplikatNama(value)
        if (value !== req.body.oldNama && duplikat) {
            throw new Error ('Nama sudah digunakan')
        }
        return true
    }),
    body('nim').custom((value) => {
        const duplikat = cekDuplikatNim(value)
        if (!duplikat) {
            throw new Error ('Nim tidak boleh diubah')
        }
        return true
        }),
],
    (req, res) => { 
    const error = validationResult(req);
    if (!error.isEmpty()) {
        // res.send({ errors: error.array() });
        res.render('edit-data', {
            title: 'Edit Data',
            layout: 'layouts/main-layout',
            errors: error.array() 
        })
    } else {
        editData(req.body)
        
        req.flash('msg', 'Data berhasil diubah')
        
        res.redirect('/member')
    }
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        layout: 'layouts/main-layout'
    })
})




app.listen(port, console.log(`http://localhost:${port}/`))