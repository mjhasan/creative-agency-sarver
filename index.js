const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const fileUpload = require('express-fileupload');
const IMAGE_PATH = `${__dirname}/images`;
var ObjectId = require('mongodb').ObjectID;

const app = express()
const port = 4000
app.use(cors())
app.use(bodyParser.json())
app.use(express.static('images'))
app.use(fileUpload());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1riin.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('Database connection established');

    // insert service
    const service = client.db(`${process.env.DB_NAME}`).collection("service");
    app.post('/service', (req, res) => {
        const picture = req.files.picture
        const title = req.body.title
        const description = req.body.description
        picture.mv(`${IMAGE_PATH}/${picture.name}`, err => {
            if (err) {
                console.log(err);
                return res.status(500).send({ msg: 'Picture Upload Failed' })
            }
        })
        service.insertOne({
            title: title,
            description: description,
            img: picture.name
        })
            .then(result => {
                if (result.insertedCount < 1) {
                    console.log('Something is wrong try again!');
                    return res.send({ status: 'failed', msg: 'Something is wrong try again!' })
                }
                res.send({ status: 'success', msg: 'New service added successfully!' })
                console.log('New service added successfully!');
            })
    })

    app.get('/allService', (req, res) => {
        service.find({})
            .toArray((err, doc) => {
                res.send(doc)
                console.log(err);
            })
    })

    // Add admin
    const admin = client.db(`${process.env.DB_NAME}`).collection("admin");
    app.post('/addAdmin', (req, res) => {
        const newAdmin = req.body;
        admin.insertOne(newAdmin)
            .then(result => {
                if (result.insertedCount < 1) {
                    console.log('Something is wrong try again!');
                    return res.send({ status: 'failed', msg: 'Something is wrong try again!' })
                }
                res.send({ status: 'success', msg: 'New admin added successfully!' })
                console.log('New admin added successfully!');
            })
    })

    app.get('/allAdmin', (req, res) => {
        admin.find({})
            .toArray((err, doc) => {
                res.send(doc)
                console.log(err);
            })
    })

    // Add Order 
    const order = client.db(`${process.env.DB_NAME}`).collection("order");
    app.post('/addOrder', (req, res) => {
        const name = req.body.name
        const email = req.body.email
        const projectDetails = req.body.projectDetails
        const price = req.body.price
        const serviceName = req.body.serviceName
        const serviceImg = req.body.serviceImg
        const serviceDetails = req.body.serviceDetails
        const picture = req.files.picture
        picture.mv(`${IMAGE_PATH}/${picture.name}`, err => {
            if (err) {
                console.log(err);
                return res.status(500).send({ msg: 'Picture Upload Failed' })
            }
        })

        order.insertOne({
            name: name,
            email: email,
            serviceDetails: {serviceName: serviceName, serviceImg: serviceImg, serviceDetails: serviceDetails},
            projectDetails: projectDetails,
            price: price,
            status: 'Pending',
            img: picture.name
        })
            .then(result => {
                if (result.insertedCount < 1) {
                    console.log('Something is wrong try again!');
                    return res.send({ status: 'failed', msg: 'Something is wrong try again!' })
                }
                res.send({ status: 'success', msg: 'New order added successfully!' })
                console.log('New order added successfully!');
            })

    })

    app.get('/allOrder', (req, res) => {
        order.find({})
            .toArray((err, doc) => {
                res.send(doc)
                console.log(err);
            })
    })

    app.get('/myOrder', (req, res) => {
        const email = req.query.email
        order.find({ email: email })
            .toArray((err, doc) => {
                res.send(doc)
                console.log(err);
            })
    })

    // Add Review 
    const review = client.db(`${process.env.DB_NAME}`).collection("review");
    app.post('/addReview', (req, res) => {
        const newReview = req.body;
        review.insertOne(newReview)
            .then(result => {
                if (result.insertedCount < 1) {
                    console.log('Something is wrong try again!');
                    return res.send({ status: 'failed', msg: 'Something is wrong try again!' })
                }
                res.send({ status: 'success', msg: 'New review added successfully!' })
                console.log('New review added successfully!');
            })
    })

    app.get('/allReview', (req, res) => {
        review.find({})
            .toArray((err, doc) => {
                res.send(doc)
                console.log(err);
            })
    })

    app.get('/allReview', (req, res) => {
        review.find({})
            .toArray((err, doc) => {
                res.send(doc)
                console.log(err);
            })
    })

});



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || port)