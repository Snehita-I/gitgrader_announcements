/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Tabs, Tab } from '@material-ui/core'
import { useParams } from 'react-router'
import ReactModal from 'react-modal'
import { TiUserAdd } from 'react-icons/ti'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import axios from 'axios'

import { Link } from 'react-router-dom'
import AssignmentCard from './AssignmentCard'

function AssignmentList (props) {
  //assignmentsOfClass
  const assignments = props.assignments;
  console.log(assignments.length)
  const assignmentItems = assignments.map((assignment) =>
      <AssignmentCard
        assignment={assignment}
        key={assignment._id}
        userName={props.userName}
        userId={props.userId}
        isInstructor={props.isInstructor}
      />
  )
  return (
      <ul>{assignmentItems}</ul>
  )
}
function ClassPage (props) {
  const { userId, userName, classId, courseCode, isInstructor, name } = useParams()
  const [selectedTab, setSelectedTab] = useState(0)
  const classUid = classId
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const [title, setTitle] = useState('')
  const [assignmentCode, setAssignmentCode] = useState('')
  const [text, setText] = useState('')
  const [penality, setPenality] = useState(0)
  const [allowLate, setAllowLate] = useState(false)
  const [dueDate, setDueDate] = useState(new Date())
  const [lateDueDate, setLateDueDate] = useState(new Date())
  const [releaseDate, setReleaseDate] = useState(new Date())

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue)
  }
  const handleSubmit = () => {
    //setSelectedTab(newValue)
    console.log("classID",classId);
    axios({
      method: 'post',
      url: 'http://localhost:5000/classes/'+classId+'/addAssignment',
      data: {
      assignmentCode:assignmentCode,
      title: title,
      description: text,
      allowLate: allowLate,
      penality: penality,
      dueDate: dueDate,
      courseCode: courseCode,
      lateDueDate: lateDueDate
      }
    }).then(()=>
    alert("Assignment added")
    ).catch((err)=>
    alert("Assignment not added"+err)
    )
  }
    
  return (

      <div>
         <div className='component bg-purple-600 bg-opacity-80 mx-auto h-14 flex justify-between'>
              <p className='mx-5 pt-3 text-xl text-white font-bold'>GitGrader</p>
              <div>
              <Tabs value={selectedTab} onChange={handleChange}>
                <Tab label = 'Stream'/>
                <Tab label = 'People'/>
              </Tabs></div>
                {isInstructor &&
                <button className='border-white shadow-none focus:shadow-none focus:border-white' onClick={() => { setIsModalOpen(true) }}>
                  <p className='text-white text-lg mb-4 h-full'>Add Assignment</p>
                </button>
                }

                  <p className='text-white text-lg pt-3 mr-3'>{userName}</p>
                </div>
                { selectedTab === 0 &&
          <ClassPageStream 
              classId={classId}
              name={name}
              courseCode={courseCode}
              userId={userId}
              userName={userName}
              isInstructor={isInstructor}/> }
          { selectedTab === 1 &&
          <PeoplePage classId={classId}
            isInstructor={isInstructor}/> }
        

        <ReactModal
            scrollable={true}
            isOpen={isModalOpen}
            contentLabel="Minimal Modal Example"
            className='container w-2/5 mx-auto h-4/5 bg-purple-300 border-white focus:border-white'
            >
                <form onSubmit={handleSubmit} className='container w-1/3 mx-auto h-full py-5 mt-10 bg-purple-300 my-auto border-white '>

                    <div className='my-3 w-4/5'>
                        <label className="text-white">
                            Title:
                            <input type="text" className="text-gray-500 rounded-lg" value={title} onChange={(event) => { setTitle(event.target.value) }} />
                        </label>
                    </div>
                    <div className='my-3 w-4/5'>
                        <label className="text-white">
                            Assignment Code:
                            <input type="text" className="text-gray-500 rounded-lg" value={assignmentCode} onChange={(event) => { setAssignmentCode(event.target.value) }} />
                        </label>
                    </div>

                    <div className='my-3 w-4/5'>
                        <label className="text-white">
                            Penality:
                            <input type="number" className="text-gray-500 rounded-lg" value={penality} onChange={(event) => { setPenality(event.target.value) }} />
                        </label>
                    </div>

                    <div>
                      <label>
                        <span><p className='text-white'>Due Date</p></span>
                        <DatePicker selected={dueDate} onChange={date => setDueDate(date)} />
                      </label>
                    </div>

                    <div>
                      <label>
                        <span><p className='text-white'>Release Date</p></span>
                        <DatePicker selected={releaseDate} onChange={date => setReleaseDate(date)} />
                      </label>
                    </div>

                    <div>
                      <label>
                        <span><p className='text-white'>Late Due Date</p></span>
                        <DatePicker selected={lateDueDate} onChange={date => setLateDueDate(date)} />
                      </label>
                    </div>

                    <div className='my-3 w-4/5'>
                        <label className="text-white">
                            Assignment Details:
                            <textarea value={text} className="text-gray-500 rounded-lg" onChange={(event) => { setText(event.target.value);console.log("Text",text)}} />
                        </label >
                    </div>

                    <button className='bg-purple-200 text-purple-700 w-48 h-8 rounded-lg' type="submit" value="Submit">ADD POST</button>
                    <button className='bg-purple-200 text-purple-700 w-48 h-8 rounded-lg mt-3' onClick={() => { setIsModalOpen(false) }}>CANCEL</button>
                </form>
            </ReactModal>
      </div>
  )
}

async function PeopleCard (props) {
  const response = await axios.get('http://localhost:5000/users/'+props.person);
  
  // const isInstructor = props.isInstructor
  return (
    <div className='h-11' >
      <div className='flex justify-start'><p className='text-gray-600 pb-8'>{response.data.name}</p></div>
    </div>
  )
}

function PeopleList (props) {
  console.log("props: ",props.people);
  const people= props.people;
  console.log("prople: ",people)
  let peopleItems = []
  people.forEach((person)=>{
    peopleItems.push(<PeopleCard
      person={person}
      key={person}
    />);
  }) 
  
  return (
    <ul>{peopleItems}</ul>
  )
}
function PeoplePage (props) {
  const isInstructor = props.isInstructor
  const classId = props.classId
  const [students, setStudents] = useState([])
  const [instructors, setInstructors] = useState([])
  const [isModalOpenStudent, setIsModalOpenStudent] = useState(false)
  const [isModalOpenInstructor, setIsModalOpenInstructor] = useState(false)
  const [studentAddEmail, setStudentAddEmail] = useState('')
  const [instructorAddEmail, setInstructorAddEmail] = useState('')
  useEffect(() => {
    async function fetchData(){
    let dataTempStudents = []
    let dataTempInstructors = []
      console.log("ClassStream:",props.classId)
      const response = await axios.get('http://localhost:5000/classes/'+props.classId);
      console.log("prople red: ",response);
      response.data.students.map(async (student)=>{
        dataTempStudents.push(student);
        
      })
      setStudents([...dataTempStudents])
      response.data.instructors.map(async (student)=>{
        dataTempInstructors.push(student);
        
      })
      setInstructors([...dataTempInstructors])
   //dataTemp.push({"assignments":response.data.assignments,"id":response.data._id})
      
    }
    fetchData();
  }, [classId, props.classId])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  //useEffect( async () => {
   // const insTemp=[];
    //const stuTemp=[];
    //const response = await axios.get('http://localhost:5000/classes/'+props.classId);
    //console.log("people response"+response.data.instructors)
    // response.data.instructors.map((i)=>{
    //   insTemp.push(i);
    // })
    // response.data.students.map((s)=>{
    //   stuTemp.push(s);
      
    // })
    
    //setStudents([...stuTemp])
    //setInstructors([...insTemp])
    console.log("students",students);
    console.log("instructors",instructors);
  //}, [instructors, props.classId, students])
  const handleSubmitStudentAdd = async () => {
    setIsModalOpenStudent(false)
    const response = await axios.get('http://localhost:5000/users/');
    
  
  }
  const handleSubmitInstructorAdd = () => {
  }
  return (
    <div>
          <ReactModal
            ariaHideApp={false}
            appElement={document.getElementById('app')}
            isOpen={isModalOpenStudent}
            contentLabel="Minimal Modal Example"
            className='container w-2/5 mx-auto h-2/3 mt-36 bg-purple-300 border-white focus:border-white'
            >
            <form onSubmit={handleSubmitStudentAdd} className='container w-1/3 mx-auto h-2/3 py-5 mt-36 bg-purple-300 my-auto border-white '>
  
                <div className='my-3 w-4/5'>
                    <label className="text-white">
                        Student Email id:
                        <input type="text" className="text-gray-500 rounded-lg" value={studentAddEmail} onChange={(event) => { setStudentAddEmail(event.target.value) }} />
                    </label>
                </div>
                <button className='bg-purple-200 text-purple-700 w-48 h-8 rounded-lg' type="submit" value="Submit">ADD POST</button>
                <button className='bg-purple-200 text-purple-700 w-48 h-8 rounded-lg mt-3' onClick={() => { setIsModalOpenStudent(false) }}>CANCEL</button>
            </form>
          </ReactModal>
  
          <ReactModal
            ariaHideApp={false}
            appElement={document.getElementById('app')}
            isOpen={isModalOpenInstructor}
            contentLabel="Minimal Modal Example"
            className='container w-2/5 mx-auto h-2/3 mt-36 bg-purple-300 border-white focus:border-white'
            >
            <form onSubmit={handleSubmitInstructorAdd} className='container w-1/3 mx-auto h-2/3 py-5 mt-36 bg-purple-300 my-auto border-white '>
  
                <div className='my-3 w-4/5'>
                    <label className="text-white">
                        Course id:
                        <input type="text" className="text-gray-500 rounded-lg" value={instructorAddEmail} onChange={(event) => { setInstructorAddEmail(event.target.value) }} />
                    </label>
                </div>
                <button className='bg-purple-200 text-purple-700 w-48 h-8 rounded-lg' type='submit' value='Submit'>ADD POST</button>
                <button className='bg-purple-200 text-purple-700 w-48 h-8 rounded-lg mt-3' onClick={() => { setIsModalOpenInstructor(false) }}>CANCEL</button>
            </form>
          </ReactModal>
  
      <div className='container w-2/3 mx-auto flex-col al justify-center content-center'>
        <div className='my-3 justify-center content-center'>
  
            <div className='my-3 flex justify-between'>
              <p className='text-purple-700 text-2xl font-bold my-2'>Instructors</p>
              {isInstructor &&
              <button onClick={() => { setIsModalOpenInstructor(true) }}><p className='text-purple-700 text-2xl font-bold my-2'><TiUserAdd/></p></button>
              }
            </div>
  
          <div className='container mx-auto self-center flex-row items-center justify-center '>
            <PeopleList people={instructors}/>
          </div>
        </div>
  
        <div className='my-3 justify-center content-center'>
  
            <div className='my-3 flex justify-between'>
              <p className='text-purple-700 text-2xl font-bold my-2'>Students</p>
              {isInstructor &&
              <button onClick={() => { setIsModalOpenStudent(true) }}><p className='text-purple-700 text-2xl font-bold my-2'><TiUserAdd/></p></button>
              }
            </div>
  
          <div className='container mx-auto self-center flex-row items-center justify-center'>
            <PeopleList people={students}/>
          </div>
        </div>
      </div>
    </div>
    )
}


function ClassPageStream (props) {
  const [data, setData] = useState([])
  const userId = props.userId
  const userName = props.userName
  const isInstructor = props.isInstructor
  const classId = props.classId
  const courseCode = props.courseCode
  const name = props.name
  
  // const [instructors, setInstructors] = useState(['9G649wYEVM0qjUqTPNqO'])

  useEffect(() => {
    async function fetchData(){
    let dataTemp = []
      console.log("ClassStream:",classId)
      const response = await axios.get('http://localhost:5000/classes/'+classId);
      console.log(response);
      response.data.assignments.map(async (assignment)=>{
        console.log("assignemnt: ",assignment," ",typeof(assignment));
      const response1 = await axios.get('http://localhost:5000/assignments/'+assignment);
      console.log("res1: ",response1);
      dataTemp.push(response1.data);
      setData([...dataTemp])
      }
      )
   //dataTemp.push({"assignments":response.data.assignments,"id":response.data._id})
      
    }
    fetchData();
  }, [classId])
  return (
      <div className='component bg-gray-200 w-full h-screen'>

            <div className='component rounded h-24 mt-4 mx-32 bg-purple-600 bg-opacity-80'>
                <p className='text-white text-lg pt-2 font-bold'>{props.name}</p>
                <Link className='rounded-lg w-48 py-1 bg-purple-500 hover:bg-purple-400 text-white' to={
    {
      
      //'/announcementsPage/:userId/:userName/:classId/:name/:courseId/:isInstructor
      pathname: '/announcementsPage/'+userId+'/' + userName + '/' + classId+'/'+name+'/'+courseCode+'/'+isInstructor,
      state: {  }
    } }> Go to Announcement </Link>
                <div className='w-64 mt-2'>
                  <p className='text-white'>{props.courseCode}</p>
                </div>
            </div>
            
            <div className='container mx-auto self-center flex-row items-center justify-center w-4/5'>
                <AssignmentList assignments={data} userName={userName} isInstructor={isInstructor} userId={userId}/>

            </div>
     </div>
  )
}
export default ClassPage
