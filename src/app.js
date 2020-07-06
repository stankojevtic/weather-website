const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

//prod env - heroku port
const port = process.env.PORT || 3000

//define path for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//setup handlerbars engine and views and partials location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//setup static directory to serve (za static data - slike itd.)
app.use(express.static(publicDirectoryPath)) // app.get('') nikad nece 
//biti pozvano zbog ovoga jer je index valjda default fajl name

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Stanko'
    })
    //render se koristi za handlebar tj. dynamic renderovanje
    //gleda se folder 'views' (mora biti tacan naziv), 
    //moze da se customizuje path do foldera da ne bude 'views'
    //koristeci app.set('views', {putanja do tog foldera tipa .../templates})
    //dok res.send se koristi za static data
})

app.get('/about', (req,res) => {
    res.render('about', {
        title: 'About me',
        name: 'Stanko'
    })
})

app.get('/help', (req,res) => {
    res.render('help', {
        message: 'Yo help message.',
        title: 'Help',
        name: 'Stanko'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address.'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Stanko',
        errorMessage: 'Yo, help 404.'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Stanko',
        errorMessage: 'Yo, 404.'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})