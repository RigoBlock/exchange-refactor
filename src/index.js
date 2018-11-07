#!/usr/bin/env node

const program = require('commander')
const fs = require('fs-extra')
const Handlebars = require('handlebars')
const pino = require('pino')

const logger = pino({
  prettyPrint: { colorize: true }
})

const appHomePath =
  './src/app/ApplicationExchangeHome/applicationExchangeHome.js'
const srcPath = '/app'
const refactorPath = '/refactor'
const onlyComponentsRegExp = RegExp('_redux|_utils|PoolsApi|css')
const cssFileComponent = RegExp('css')

program.version('0.1.0').parse(process.argv)

fs.ensureDirSync(__dirname + refactorPath)
fs.ensureDirSync(__dirname + refactorPath + '/_atomic/')
fs.ensureDirSync(__dirname + refactorPath + '/_atomic/atoms')
fs.ensureDirSync(__dirname + refactorPath + '/_atomic/molecules')
fs.ensureDirSync(__dirname + refactorPath + '/_atomic/organisms')
fs.ensureDirSync(__dirname + refactorPath + '/_const/')
fs.ensureDirSync(__dirname + refactorPath + '/_redux/')
fs.ensureDirSync(__dirname + refactorPath + '/_utils/')
fs.ensureDirSync(__dirname + refactorPath + '/Elements/')

const extract = async () => {
  const matches = getImportedComponents(appHomePath)
  const sourceComponents = matches.map(el =>
    el.replace('..', __dirname + srcPath)
  )
  console.log(sourceComponents)
  const destinationComponents = matches.map(el =>
    el.replace('..', __dirname + refactorPath)
  )

  const copyPromises = destinationComponents.map(async (path, index) => {
    await fs.ensureDirSync(path)
    const filename = `${path.split('/').pop()}`
    await fs.ensureFile(`${path}/index.js`)
    await fs.ensureFile(`${path}/${filename}.test.js`)
    await fs.copy(`${sourceComponents[index]}.js`, `${path}/${filename}.jsx`)
  })

  await Promise.all(copyPromises)

  // sourceComponents.forEach((element, key) => {
  //   logger.info(`Copying to destination folder: ${element}.js`)
  //   let elementArray = element.split('/')
  //   let fileName = elementArray.pop()
  //   fs.createReadStream(element + '.js').pipe(
  //     fs.createWriteStream(destinationComponents[key] + '/' + fileName + '.js')
  //   )
}

//   if (fs.existsSync(element + '.module.css')) {
//     fs.createReadStream(element + '.module.css').pipe(
//       fs.createWriteStream(
//         destinationComponents[key] + '/' + fileName + '.module.css'
//       )
//     )
//   }

//   let testTemplate = fs.readFileSync('./src/templates/test.mst').toString()
//   let indexTemplate = fs.readFileSync('./src/templates/index.mst').toString()
//   let view = {
//     fileName: fileName
//   }
//   logger.info(`Creating test file.`)
//   fs.writeFileSync(
//     destinationComponents[key] + '/' + fileName + '.test.js',
//     Mustache.render(testTemplate, view)
//   )
//   logger.info(`Creating index file.`)
//   fs.writeFileSync(
//     destinationComponents[key] + '/index.js',
//     Mustache.render(indexTemplate, view)
//   )
// })

getImportedComponents = file => {
  let content = fs.readFileSync(file, 'utf8')
  return content
    .match(/\.+\/[a-zA-Z\/_\.]*/g)
    .filter(element => !onlyComponentsRegExp.test(element))
}

getImportedCss = file => {
  let content = fs.readFileSync(file, 'utf8')
  return content
    .match(/\.+\/[a-zA-Z\/_\.]*/g)
    .filter(element => cssFileComponent.test(element))
}

extract()
