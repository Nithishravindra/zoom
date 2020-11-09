const express = require('express');

const router = express.Router();

router.route('/meetings').get();

router.route('/participants/:meetingID').get();

module.exports = router;
