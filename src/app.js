const { hasSubscribers } = require('diagnostics_channel');
const { application, response } = require('express');
const express = require('express');
const path = require('path')
const hbs = require('hbs');
const geocode = require('./utils/geocode.js')
const forecast = require('./utils/weather')

const app = express();

const port = process.env.PORT || 3000
    //Paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('views', viewsPath)
app.set('view engine', 'hbs')
hbs.registerPartials(partialsPath)



// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

// Router Handlers
app.get('', (req, res) => {
    res.render('index', {
        title: "Weather App",
        name: "Jay"
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: "About Me",
        name: "Jay"
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        help_text: 'Help Text',
        title: 'Help',
        name: 'Jay'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Address Not provided'
        });
    }
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }
        forecast(latitude, longitude, (error, weather_data) => {
            if (error) {
                return res.send({ error });
            }
            res.send({
                forecast: weather_data,
                location,
                address: req.query.address
            })
        })
    })

})

// Error Routes
app.get('/help/*', (req, res) => {
    res.render("404", {
        message: "help article not found",
        name: 'Jay'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        message: 'Page Not Found',
        name: 'Jay'
    })
})

app.listen(port, () => {
    console.log('server runnning on port + ' + port)
})