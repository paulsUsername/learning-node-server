const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;


var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');


var inMaintenance = false;

app.use((req, res, next) => {
    var now = new Date().toString();

    var log = `${now}: ${req.method} ${req.url}`

    console.log(log)

    fs.appendFile('Server.log', log + '\n', (err) => {
        if (err) {
            console.log('unable to append')
        }
    });
    next();
});

app.use((req, res, next) => {
    if (inMaintenance) {
        renderMaintenancePage(res);
    } else {
        next()
    }
});


//show the maintenance page
var renderMaintenancePage = (res) => {
    res.render('maintenance.hbs', {
        pageTitle: "Site currently under maintenance",
        welcomePageBody: "We will be back shortly."
    })
};

app.use(express.static(__dirname + '/public'));




//Global Website helper
hbs.registerHelper('getCurrentYear',() => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt',(text) => {
    return text.toUpperCase();
});



//Individual website helpers
app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: "Waymarked Trails Home",
        welcomePageBody: "Welcome to my website."
    })
});

app.get("/about", (req, res) => {
    res.render('about.hbs', {
        pageTitle: "About Page",
    });
});

app.get("/bad", (req, res) => {
    res.send({
        pageTitle: "Error",
        error: "Unable to handel request."
    })
})

var projectText = "This is where you will find a list of Waymarked Trails web app projects."

app.get("/projects", (req, res) => {
    res.render('projects.hbs', {
        pageTitle: "Projects",
        projectPageBody: projectText
    })
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
});