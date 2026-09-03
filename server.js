const express = require('express');

const app = express();
const mongoose = require('mongoose');

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.static('public'));

require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);



app.listen(process.env.PORT || 3000, () => {
    console.log(`server is now running on port ${process.env.PORT}`)
})