const express = require('express')
const path = require('path')
const fs = require('fs')
// Nécessaire pour Heroku
const port = process.env.PORT || 3000
const hbs = require('hbs')
const app = express()

// template engine + config (partials, helpers)
hbs.registerPartials(path.join(__dirname, 'views/partials'))
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
})
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase()
})
app.set('view engine', 'hbs')

// middlewares
// Exemple d'un middleware qui print des infos sur les request et crée un log
app.use((req, res, next) => {
  const now = new Date().toString()
  const log = `${now}: ${req.method} ${req.url}`
  console.log(log)
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log')
    }
  })
  next()
})

// met le site en maintenance, donc pas de next! Commenter ce middleware si on veut que quelque chose s'affiche
// /!\ On le met avant le truc qui fout le dossier public en route sinon on pourrait encore accéder à ce dossier malgré la maintenance
// app.use((req, res, next) => {
//   res.render('maintenance.hbs')
// })

// fout en route statique tout ce qui est dans le path, on y accede sans devoir taper .html grace à extensions: ['html']
app.use(express.static(path.join(__dirname, 'public'), {
  extensions: ['html']
}))

// routes
app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home',
    welcomeMessage: 'Hello and welcome to my website!'
  })
})

app.get('/about', (req, res) => {
  // res.sendFile(path.join(__dirname, 'views', 'about.html'))
  res.render('about.hbs', {
    pageTitle: 'About page'
  })
})

// launch le server sur le port 3000
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`)
})
