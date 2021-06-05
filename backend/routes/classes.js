import express from 'express';
import Class from '../models/classModel.js';
import User from '../models/userModel.js';
import Assignment from '../models/assignmentModel.js';
import Announcement from '../models/announcementModel.js'
import mongodb from 'mongodb';
import mongoose from 'mongoose';
const ObjectId = mongodb.ObjectID;
const router = express.Router();
router.route('/').get((req, res) => {
  Class.find()
    .then(classes => res.json(classes))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const courseCode = req.body.courseCode;
  const name = req.body.name;
  const semester = req.body.semester;
  const instructorsEmailid =req.body.instructorsEmailid;
  const studentsEmailid = req.body.studentsEmailid;
  const instructor = req.body.instructor;
  const assignments = [];
 
  console.log(instructorsEmailid);
  console.log(studentsEmailid);
  console.log(instructor )
  //const instructors =[];
  let students =[];
  let instructors=[];
  
  User.find()
   .then(users=>users.forEach((user)=>{

     if(instructor==user._id){
        instructors.push(user);
        console.log("user is instructor", user);
     }

     if(instructorsEmailid.includes(user.emailid)){
        instructors.push(user);
     }
     
     if(studentsEmailid.includes(user.emailid)){
      students.push(user);
      //res.json("students: ", user.emailid);
     }
   })).then(()=>{

    var newClass={courseCode, name , semester ,instructors, students,assignments};
    console.log("newClass: ",newClass);
    Class.create(newClass,function(err,)
		{
		  if(err){console.log("error in creating class"+ err);
        res.status(400).json('Error: ' + err)
      }
		  else{
        console.log("class created");
			  res.json('Class added!')
		  }
		
	  });

   });
  //   const newClass = new Class({courseCode, name , semester ,instructors, students,assignments});

  //   newClass.save()
  //     .then(() => res.json('Class added!'))
  //     .catch(err => res.status(400).json('Error: ' + err));
  //  });

});


router.route('/:id/addAssignment').post((req, res) => {
  const assignmentCode = req.body.assignmentCode;
  const courseCode = req.params.id;
  const description = req.body.description;
  const title = req.body.title;
  const dueDate = new Date(req.body.dueDate);
  const penality = req.body.penality;
  const lateDueDate = new Date(req.body.lateDueDate);
  const allowLate = req.body.allowLate;

  let users = [];
  let attachments = [];
  Class.findById(req.params.id).then(async (assignmentClass)=>{
      console.log(assignmentClass)
      await assignmentClass.students.forEach((assignmentClassStudent)=>{
            users = [...users, assignmentClassStudent]
    });
    console.log(users)
  }).then(()=>{
  const newAssignment ={
    users,
    assignmentCode,
    courseCode,
    description,
    title,
    dueDate,
    lateDueDate,
    penality,
    allowLate,
    attachments
  };
  console.log(newAssignment);
  Assignment.create(newAssignment,async function(err,newAssignmentcreated)
		{
		  if(err){console.log("error in creating assignment"+ err);
        res.status(400).json('Error: ' + err)
      }
		  else{
        console.log("Assignment created");
        console.log(newAssignmentcreated);
        await Class.findById(req.params.id).then((assignmentClass)=>{
          assignmentClass.assignments.push(newAssignmentcreated._id);
          console.log("class after assignment: ",assignmentClass);
          assignmentClass.save().then(()=>{
            res.json('Assignment added!');
          })
        });
        
		  }
      
	  });
    console.log("NA",newAssignment)
    })
});

router.route('/:id/addAnnouncement').post((req, res) => {
 
  const announcementCode = req.body.announcementCode;
  const courseCode = req.params.id;
  const announcementText = req.body.announcementText;
 

  let users = [];
  
  Class.findById(req.params.id).then(async (announcementClass)=>{
      //console.log(assignmentClass)
      await announcementClass.students.forEach((assignmentClassStudent)=>{
            users = [...users, assignmentClassStudent]
    });
    console.log("users"+users)
  }).then(()=>{
  const newAnnouncement ={
    users,
    announcementCode,
    courseCode,
    announcementText
  };
  console.log(newAnnouncement);
  Announcement.create(newAnnouncement,async function(err,newAnnouncementcreated)
		{
		  if(err){console.log("error in creating Announcement"+ err);
        res.status(400).json('Error: ' + err)
      }
		  else{
        console.log("Announcement created");
        console.log(newAnnouncementcreated);
        await Class.findById(req.params.id).then((announcementClass)=>{
          announcementClass.announcements.push(newAnnouncementcreated._id);
          console.log("class after announcement: ",announcementClass);
          announcementClass.save().then(()=>{
            res.json('Announcement added!');
          })
        });
        
		  }
      
	  });
    console.log("NA",newAnnouncement)
    })
});
     
    
  router.route('/:id/addStudent').post((req, res) => {
        const studentEmailId = req.body.studentEmailId;
        
        User.find()
   .then(users=>users.forEach((user)=>{
         if(user.emailId===studentEmailId){
                  Class.findById(req.params.id).then((userClass)=>{
                        userClass.students.push(user);
                        userClass.save()
                  .then(() => res.json('Student added!'))
                  .catch(err => res.status(400).json('Error: ' + err));
                  });
                  
         }
      }
   ))

  });


  router.route('/:id/addInstructor').post((req, res) => {
    const instructorEmailId = req.body.instructorEmailId;
    
    User.find().then(users=>users.forEach((user)=>{
     if(user.emailId===instructorEmailId){
              Class.findById(req.params.id).then((userClass)=>{
                    userClass.instructors.push(user);
                    userClass.save()
              .then(() => res.json('Instructor added!'))
              .catch(err => res.status(400).json('Error: ' + err));
              });
              
            }
        }
      ))

   });

router.route('/:id').delete((req, res) => {
  Class.findByIdAndDelete(req.params.id)
    .then(() => res.json('Class deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Class.findById(req.params.id)
    .then(selectedClass => res.json(selectedClass))
    .catch(err => res.status(400).json('Error: ' + err));
});


export default router;