/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Tabs, Tab } from '@material-ui/core'
import { useParams } from 'react-router'
import ReactModal from 'react-modal'
import { firestore, firebaseFirestore } from '../firebase'
import '../index.css'
import { TiUserAdd } from 'react-icons/ti'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import AssignmentCard from './AssignmentCard'

function AssignmentList (props) {
  const assignments = props.assignments
  console.log('assignments: ', assignments)
  const assignmentItems = assignments.map((assignment) =>
      <AssignmentCard
        assignment={assignment}
        key={assignment.uid.toString()}
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
  const { userId, userName, classId, courseId, isInstructor, name } = useParams()
  const [selectedTab, setSelectedTab] = useState(0)
  const classUid = classId
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [penality, setPenality] = useState(0)
  const [allowLate, setAllowLate] = useState(false)
  const [dueDate, setDueDate] = useState(new Date())
  const [lateDueDate, setLateDueDate] = useState(new Date())
  const [releaseDate, setReleaseDate] = useState(new Date())

  const handleSubmit = () => {
    console.log('title:', title)
    console.log('text:', text)
    console.log('allowLate:', allowLate)
    console.log('penality:', penality)
    console.log('dueDate:', dueDate)
    console.log('lateDueDate:', lateDueDate)
    console.log('releaseDate:', releaseDate)
    setIsModalOpen(false)
    firestore.collection('Classes').doc(classUid).collection('assignments').doc().set({
      title: title,
      text: text,
      allowLate: allowLate,
      penality: penality,
      dueDate: dueDate,
      classId: classUid,
      courseId: courseId,
      lateDueDate: lateDueDate,
      releaseDate: releaseDate,
      attachments: [],
      students_attached: []
    })
      .then(function () {
        console.log('Document successfully written!')
      })
      .catch(function (error) {
        console.error('Error writing document: ', error)
      })
  }

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue)
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
          <ClassPageStream classId={classId}
              name={name}
              courseid={courseId}
              classId={classId}
              userId={userId}
              userName={userName}
              isInstructor={isInstructor}/> }
        { selectedTab === 1 &&
          <PeoplePage classId={classId}
            isInstructor={isInstructor}/> }

        <ReactModal
            isOpen={isModalOpen}
            contentLabel="Minimal Modal Example"
            className='container w-2/5 mx-auto h-4/5 mt-11 bg-purple-300 border-white focus:border-white'
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
                            <textarea value={text} className="text-gray-500 rounded-lg" onChange={(event) => { setText(event.target.value) }} />
                        </label >
                    </div>

                    <button className='bg-purple-200 text-purple-700 w-48 h-8 rounded-lg' type="submit" value="Submit">ADD POST</button>
                    <button className='bg-purple-200 text-purple-700 w-48 h-8 rounded-lg mt-3' onClick={() => { setIsModalOpen(false) }}>CANCEL</button>
                </form>
            </ReactModal>
      </div>
  )
}

function PeopleCard (props) {
  // const isInstructor = props.isInstructor
  return (
    <div className='h-11' >
      <div className='flex justify-start'><p className='text-gray-600 pb-8'>{props.person.name}</p></div>
    </div>
  )
}

function PeopleList (props) {
  const people = props.people
  console.log('people: ', people)
  const peopleItems = people.map((person) =>
    <PeopleCard
      person={person}
      key={person.uid.toString()}
    />
  )
  return (
    <ul>{peopleItems}</ul>
  )
}

function PeoplePage (props) {
  const isInstructor = props.isInstructor
  const [students, setStudents] = useState([])
  const [instructors, setInstructors] = useState([])
  const [isModalOpenStudent, setIsModalOpenStudent] = useState(false)
  const [isModalOpenInstructor, setIsModalOpenInstructor] = useState(false)
  const [studentAddEmail, setStudentAddEmail] = useState('')
  const [instructorAddEmail, setInstructorAddEmail] = useState('')

  useEffect(() => {
    firestore.collection('Classes')
      .doc(props.classId.trim())
      .get().then(function (doc) {
        if (doc.exists) {
          console.log('Document data:', doc.data())
          setInstructors(doc.data().instructors)
          setStudents(doc.data().students)
          console.log(students)
          console.log(instructors)
        } else {
          console.log('No such document!')
        }
      })
      .catch(function (error) {
        console.log('Error getting document:', error)
      })
  }, [])

  const handleSubmitStudentAdd = () => {
    console.log('StudentEmail:', studentAddEmail)
    setIsModalOpenStudent(false)

    firestore.collection('Users')
      .where('emailid', '==', studentAddEmail)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          if (doc.exists) {
            console.log(doc.id, ' => ', doc.data())
            firestore.collection('Classes')
              .doc(props.classId.trim())
              .update({
                students:
                  firebaseFirestore.FieldValue.arrayUnion({ name: doc.data().name, uid: doc.id })
              })
          } else {
            alert('No such User Exists')
          }
        })
      })
      .catch(function (error) {
        console.log('Error getting documents: ', error)
      })
  }

  const handleSubmitInstructorAdd = () => {
    console.log('InstructorEmail:', instructorAddEmail)
    setIsModalOpenInstructor(false)

    firestore.collection('Users')
      .where('emailid', '==', instructorAddEmail)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          if (doc.exists) {
            console.log(doc.id, ' => ', doc.data())
            firestore.collection('Classes')
              .doc(props.classId.trim())
              .update({
                instructors:
                  firebaseFirestore.FieldValue.arrayUnion({ name: doc.data().name, uid: doc.id })
              })
          } else {
            alert('No such User Exists')
          }
        })
      })
      .catch(function (error) {
        console.log('Error getting documents: ', error)
      })
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
  const classUid = props.classId
  // const username = 'Ananya'

  // const [instructors, setInstructors] = useState(['9G649wYEVM0qjUqTPNqO'])

  useEffect(() => {
    firestore.collection('Classes').doc(classUid.trim())
      .collection('assignments')
      .get()
      .then(querySnapshot => {
        const dataTemp = querySnapshot.docs.map(function (doc) {
          const queryData = { ...doc.data(), uid: doc.id }
          console.log(doc.data())
          return queryData
        })
        console.log('firebase')
        setData([...dataTemp])
      })
  }, [])
  return (
      <div className='component bg-gray-200 w-full h-screen'>

            <div className='component rounded h-24 mt-4 mx-32 bg-purple-600 bg-opacity-80'>
                <p className='text-white text-lg pt-2 font-bold'>{props.name}</p>
                <div className='w-64 mt-2'>
                  <p className='text-white'>{props.courseid}</p>
                </div>
            </div>
            <div className='container mx-auto self-center flex-row items-center justify-center w-4/5'>
                <AssignmentList assignments={data} userName={userName} isInstructor={isInstructor} userId={userId}/>

            </div>
     </div>
  )
}
export default ClassPage
