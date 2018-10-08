#!/usr/bin/env node
// Regex: \.+\/[a-zA-Z\/_\.]*/g

const program = require('commander')
const fs = require('fs')
const Mustache = require('mustache')
const pino = require('pino')

const logger = pino({
  prettyPrint: { colorize: true }
})

let appHomePath = './src/app/ApplicationExchangeHome/applicationExchangeHome.js'
let sourceHomePath = '/app'
let desinationHomePath = '/refactor'

program.version('0.1.0').parse(process.argv)
let onlyComponentsRegExp = RegExp('_redux|_utils|PoolsApi|css')
let cssFileComponent = RegExp('css')

if (!fs.existsSync(__dirname + desinationHomePath)) {
  fs.mkdirSync(__dirname + desinationHomePath)
}
if (!fs.existsSync(__dirname + desinationHomePath + '/_atomic/')) {
  fs.mkdirSync(__dirname + desinationHomePath + '/_atomic/')
}
if (!fs.existsSync(__dirname + desinationHomePath + '/_atomic/atoms')) {
  fs.mkdirSync(__dirname + desinationHomePath + '/_atomic/atoms')
}
if (!fs.existsSync(__dirname + desinationHomePath + '/_atomic/molecules')) {
  fs.mkdirSync(__dirname + desinationHomePath + '/_atomic/molecules')
}
if (!fs.existsSync(__dirname + desinationHomePath + '/_atomic/organisms')) {
  fs.mkdirSync(__dirname + desinationHomePath + '/_atomic/organisms')
}
if (!fs.existsSync(__dirname + desinationHomePath + '/_const/')) {
  fs.mkdirSync(__dirname + desinationHomePath + '/_const/')
}
if (!fs.existsSync(__dirname + desinationHomePath + '/_redux/')) {
  fs.mkdirSync(__dirname + desinationHomePath + '/_redux/')
}
if (!fs.existsSync(__dirname + desinationHomePath + '/_utils/')) {
  fs.mkdirSync(__dirname + desinationHomePath + '/_utils/')
}

if (!fs.existsSync(__dirname + desinationHomePath + '/Elements/')) {
  fs.mkdirSync(__dirname + desinationHomePath + '/Elements/')
}

extractImportedComponents = file => {
  let content = fs.readFileSync(file, 'utf8')
  return content.match(/\.+\/[a-zA-Z\/_\.]*/g).filter(element => {
    return !onlyComponentsRegExp.test(element)
  })
}

extractComponentCssFile = file => {
  let content = fs.readFileSync(file, 'utf8')
  return content.match(/\.+\/[a-zA-Z\/_\.]*/g).filter(element => {
    console.log(onlyComponentsRegExp.test(element), element)
    return cssFileComponent.test(element)
  })
}

logger.info(`Working directory: ${__dirname}`)
let matches = extractImportedComponents(appHomePath)
console.log(matches)
let sourceComponents = matches.map(element => {
  let elementArray = element.split('/')
  elementArray.shift()
  elementPath = __dirname + sourceHomePath + '/' + elementArray.join('/')
  return elementPath
})
let destinationComponents = matches.map(element => {
  let elementArray = element.split('/')
  elementArray.shift()
  elementPath = __dirname + desinationHomePath + '/' + elementArray.join('/')
  return elementPath
})

console.log(sourceComponents)

// destinationComponents.forEach(element => {
//   // Creating destination directory
//   logger.info(`Creating destination component directory: ${element}`)
//   if (!fs.existsSync(element)) {
//     fs.mkdirSync(element)
//   }
// })

moveFile(file)

// Copying js and css code files
sourceComponents.forEach((element, key) => {
  logger.info(`Copying to destination folder: ${element}.js`)
  let elementArray = element.split('/')
  let fileName = elementArray.pop()
  fs.createReadStream(element + '.js').pipe(
    fs.createWriteStream(destinationComponents[key] + '/' + fileName + '.js')
  )

  if (fs.existsSync(element + '.module.css')) {
    fs.createReadStream(element + '.module.css').pipe(
      fs.createWriteStream(
        destinationComponents[key] + '/' + fileName + '.module.css'
      )
    )
  }

  let testTemplate = fs.readFileSync('./src/templates/test.mst').toString()
  let indexTemplate = fs.readFileSync('./src/templates/index.mst').toString()
  let view = {
    fileName: fileName
  }
  logger.info(`Creating test file.`)
  fs.writeFileSync(
    destinationComponents[key] + '/' + fileName + '.test.js',
    Mustache.render(testTemplate, view)
  )
  logger.info(`Creating index file.`)
  fs.writeFileSync(
    destinationComponents[key] + '/index.js',
    Mustache.render(indexTemplate, view)
  )
})
