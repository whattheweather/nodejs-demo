const csv = require('csv');
  iconv = require('iconv-lite');
  json2csv = require('json2csv') 
  fs = require('fs')
  XLSX = require('xlsx')

exports.csv2doc = ({ buf, keys, keysCn, type }) => {
  return new Promise((resolve, reject) => {
    let data = iconv.decode(buf, 'gbk');
    csv.parse(data, (err, result) => {
      let header = result[0]
      let keysNum = keys.length
      let index = {};
      for (let i = 0; i < header.length; i ++)
        for (let j = 0; j < keysNum; j ++)
          if (header[i] === keysCn[j])
            index[keys[j]] = i
      let docs = []
      for (let i = 1; i < result.length; i ++) {
        let tmp = {}
        for (let j = 0; j < keysNum; j ++) tmp[keys[j]] = result[i][index[keys[j]]]
        tmp['type'] = type
        docs.push(tmp)
      }
      resolve(docs)
    })
  })
}

exports.doc2csv = ({ data, keys, keysCn, dir }) => {
  return new Promise((resolve, reject) => {
    let newData = []
    data.forEach(val => {
      let newVal = {}
      for (let i = 0; i < keys.length; i ++)
        newVal[keysCn[i]] = val[keys[i]] ? val[keys[i]].replace(/\n/g, ' ').replace(/\\n/g, ' ') : ''
      newData.push(newVal)
    })
    json2csv({ data: newData, fields: keysCn }, (err, csv) => {
      let newCsv = iconv.encode(csv, 'GBK')
      let random = Date.parse(new Date()) / 1000
      filename = `./csv${dir}/${random}.csv`
      fs.writeFile(filename, newCsv, err => { resolve(filename) })
    })
  })
}

exports.checkType = path => {
  switch (path) {
    case 'do':
      return 0
    case 'todo':
      return 1
    case 'did':
      return 2
  }
}

exports.xlsx2doc = (buf, keys) => {
  return new Promise((resolve, reject) => {
    let sheet = XLSX.read(buf, {type:'buffer'}).Sheets.Sheet1
    let data = XLSX.utils.sheet_to_json(sheet, { header: 1 })
    let obj = {}
    let header
    for (let d of data)
      if (d[0]) {
        header = d[0]
        obj[header] = [d[1]]
      } else { obj[header].push(d[1]) }
    for (let key of keys)
      if (!(key in obj)) obj[key] = []
    resolve(obj)
  })
}