import express from 'express';
import Assignment from '../models/assignmentModel.js';
import Attachment from '../models/attachmentModel.js';
//import assignmentDetailPages from '../../src/components/AssignmentDetailPage/AssignmentDetailPage.jsx';
const router = express.Router()
router.route('/').get((req, res) => {
  Assignment.find()
    .then(exercises => res.json(exercises))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Assignment.findByIdAndDelete(req.params.id)
    .then(() => res.json('Assignment deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/:id').get((req, res) => {
  Assignment.findById(req.params.id)
    .then(assignment => res.json(assignment))
    .catch(err => res.status(400).json('Error: ' + err));
});



//Attachments
router.route('/:id/addAttachment').post((req,res) =>{

  //REMEMBER:: studid id the one who has logged in
  const studId = req.body.studId;
  const file = req.body.file;
  const fileType = req.body.fileType;
  const plagarismPercent = req.body.plagarismPercent;

  const newAttachment = new Attachment({
    studId,
    file,
    fileType,
    plagarismPercent
  });

  newAttachment.save()
      .then(() => 
      {
        Assignment.findById(req.params.id).then((assignment) => {

          assignment.attachments.push(newAttachment);
          assignment.save().then(()=>{
            res.json('Attachment updated');
          });
        });

      });
});

router.route(':id/:attachmentid').get((req, res) => {
  Assignment.find()
    .then(exercises => res.json(exercises))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Assignment.findByIdAndDelete(req.params.id)
    .then(() => res.json('Assignment deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/:id').get((req, res) => {
  Assignment.findById(req.params.id)
    .then(assignment => res.json(assignment))
    .catch(err => res.status(400).json('Error: ' + err));
});




export default router;