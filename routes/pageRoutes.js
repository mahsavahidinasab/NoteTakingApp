const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.user) {
        return res.redirect('/notes');
    }

    res.render('index');
});

module.exports = router;
