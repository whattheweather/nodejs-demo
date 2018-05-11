const models = require('./models.js')
  database = models.supportCompaniesSchema
  keys = models.keys
  functions = require('./functions.js')
  express = require('express')
  fs = require('fs')
  app = express()
  bodyParser = require('body-parser')
  multer  = require('multer')
  memoryStorage = multer.memoryStorage()
  uploadStorage = multer({ storage: memoryStorage })
  // diskStorage = multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     let parentDir = `./pdf/${req.params.id}`
  //     let childDir = `./pdf/${req.params.id}/${req.params.type}`
  //     if (!fs.existsSync(parentDir)) {
  //       fs.mkdirSync(parentDir)
  //       fs.mkdirSync(childDir)
  //     }
  //     cb(null, childDir)
  //   },
  //   filename: (req, file, cb) => { cb(null, file.originalname) },
  // })
  // uploadDest = multer({ storage: diskStorage })

if (!fs.existsSync('./csv')) {
  fs.mkdirSync('./csv')
  fs.mkdirSync('./csv/did')
  fs.mkdirSync('./csv/do')
  fs.mkdirSync('./csv/todo')
}

if (!fs.existsSync('./download')) {
  fs.mkdirSync('./download')
  fs.mkdirSync('./download/did')
  fs.mkdirSync('./download/do')
  fs.mkdirSync('./download/todo')
}
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/api/:path', (req, res) => {
  let type = functions.checkType(req.params.path)
  let query = { type: type }
  if (req.query.lot && req.query.lot !== 'all') query['lot'] = req.query.lot
  database.find(query).then(docs => {
    res.json(docs)
  })
})

app.put('/api/:path', (req, res) => {
  let operations = []
  for (let id of req.body.ids) {
    operations.push({
      updateOne: {
        filter: { _id: id },
        update: {  type: functions.checkType(req.body.to) }
      }
    })
  }
  database.bulkWrite(operations).then(data => {
    data.ok === 1 && res.send('OK')
  })
})

app.delete('/api/:path', (req, res) => {
  database.remove({ _id: { $in: req.body.ids } }).then(() => {
    res.send('OK')
  })
})

app.get('/api/:path/csv', (req, res) => {
  let type = functions.checkType(req.params.path)
  let query = { type: type }
  if (req.query.lot && req.query.lot !== 'all') query['lot'] = req.query.lot
  database.find(query).then(docs => {
    switch (type) {
      case 0:
        functions.doc2csv({ data: docs, keys: keys['do'], keysCn: keys['doCn'], dir: '/do' })
          .then(path => {
            res.download(path)
          })
        break
      case 1:
        functions.doc2csv({ data: docs, keys: keys['todo'], keysCn: keys['todoCn'], dir: '/todo' })
          .then(path => {
            res.download(path)
          })
        break
      case 2:
        functions.doc2csv({ data: docs, keys: keys['did'], keysCn: keys['didCn'], dir: '/did' })
          .then(path => {
            res.download(path)
          })
        break
      default:
    }
  })
})

app.post('/api/:path/csv', uploadStorage.single('csv'), (req, res) => {
  let data = req.file.buffer
  let type = functions.checkType(req.params.path)
  functions.csv2doc({ buf: data, keys: keys.info, keysCn: keys.infoCn, type: type})
    .then(docs => {
      database.create(docs, (err, data) => {
        res.send('OK')
      })
  })
})

app.put('/api/:path/:id', (req, res) => {
  database.update({ _id: req.params.id }, req.body).then(result => {
    result.ok === 1 && res.end()
  })
})

app.get('/api/:path/:id/detail', (req, res) => {
  database.findOne({ _id: req.params.id }).then(doc => {
    res.json(doc)
  }) 
})

app.post('/api/:path/:id/detail', uploadStorage.single('detail'), 
  (req, res) => {
    functions.xlsx2doc(req.file.buffer, keys.detail).then(doc => {
      database.update({ _id: req.params.id }, { detail: doc }).then(() => {
        res.json(doc)
      })
    })
  })

app.listen(8000)
