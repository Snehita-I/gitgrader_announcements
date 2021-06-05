import express from 'express';
import Announcement from '../models/announcementModel.js';

const router = express.Router()
router.route('/').get((req, res) => {
  Announcement.find()
    .then(exercises => res.json(exercises))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Announcement.findByIdAndDelete(req.params.id)
    .then(() => res.json('Assignment deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/:id').get((req, res) => {
  Announcement.findById(req.params.id)
    .then(assignment => res.json(assignment))
    .catch(err => res.status(400).json('Error: ' + err));
});




export default router;