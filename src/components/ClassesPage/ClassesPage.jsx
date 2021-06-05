/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import ClassCard from './ClassCard'
import { useParams } from 'react-router'
import ReactModal from 'react-modal'
import axios from 'axios'
function ClassList (props) {
  // eslint-disable-next-line react/prop-types
  const a = props.classlist
  console.log('classList', a)
  // eslint-disable-next-line react/prop-types
  const ClassItems = a.map((classItem, i) =>
  <ClassCard
    key={classItem.class._id.toString()}
    name={classItem.class.name}
    semester={classItem.class.semester}
    classId={classItem.class._id}
    courseCode={classItem.class.courseCode}
    userId={props.userId}
    userName={props.userName}
    isInstructor={classItem.isInstructor}
  />
  )
  return (
  <div className="grid grid-cols-1  lg:grid-cols-3 gap-4">{ClassItems}</div>
  )
}

function ClassesPage (props) {
  console.log(props);
  const { userId, userName } = useParams()
  const [data, setData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [courseCode, setCourseid] = useState('')
  const [courseName, setCoursename] = useState('')
  const [courseIntro, setCourseintro] = useState('')
  const [sem, setSem] = useState('')
  const instructors = userId
  const handleSubmit = () => {
    console.log('userid:', userId)
    console.log('courseid:', courseCode)
    console.log('coursename:', courseName)

    console.log('sem:', sem)
    console.log('instructors:', instructors)
    setIsModalOpen(false)
      axios({
      method: 'post',
      url: 'http://localhost:5000/classes/add',
      data: {
        courseCode:courseCode,
        name:courseName,
        semester:sem,   
        instructorsEmailid:[],
        studentsEmailid:[],
        instructor:userId
      }
    }).then(()=>
    console.log("Class added")
    ).catch((err)=>
    console.log("Class not added"+err)
    )
  }

  useEffect(async () => {
    async function fetchData(){
        let dataTemp = []
        let classesPasrOfStud = []
        let classesPasrOfInstr = []
        let isPartOfClass = 0
        const response = await axios.get('http://localhost:5000/classes/');
        
        response.data.map((classObtained) => {
            console.log(classObtained._id);
            isPartOfClass = 0;
            classObtained.students.map((student) => {
              console.log("student: ",student);
              console.log(typeof(student))
                if (student._id.trim() == userId.trim()) {
                    console.log('yes')
                    // 1 => isStudent
                    isPartOfClass = 1
                  }
            })
            classObtained.instructors.map((instructorId) => {
              console.log("instructor:",instructorId);
              console.log("userId:",userId);
              console.log(typeof(instructorId))
              console.log(typeof(userId))
                if (instructorId.trim() == userId.trim()) {
                    console.log("instr");
                    // 1 => isStudent
                    isPartOfClass = 2
                  }
            })
            if (isPartOfClass === 1) {
                classesPasrOfStud.push(classObtained._id)
                dataTemp.push({"class":classObtained,"isInstructor":false})
              } else if (isPartOfClass === 2) {
                  classesPasrOfInstr.push(classObtained._id)  
                  dataTemp.push({"class":classObtained,"isInstructor":true}) 
            } 
        })
        console.log("dataTemp: ",dataTemp)
        setData([...dataTemp])  
        // const response1 = await axios.get('http://localhost:5000/classes/');
        // response1.data.map((classObtained) => {
        //     if (classesPasrOfStud.includes(classObtained._id)) {
        //         console.log("s "+classObtained._id);
        //         dataTemp.push({"class":classObtained,"isInstructor":false})
        //         //dataTemp = [...dataTemp, { ...classObtained._id, isInstructor: false }]
        //       } else if (classesPasrOfInstr.includes(classObtained.id)) {
        //         console.log("I "+classObtained._id);
        //         dataTemp.push({"class":classObtained,"isInstructor":true})
        //        // dataTemp = [...dataTemp, { ...classObtained, uid: classObtained._id, isInstructor: true }]
        //       }
        // })
         
    }
   fetchData();
  }, [userId])
  console.log('before return')
  return (
            <div className='component bg-gray-100'>
                
                <div className='component bg-purple-600 bg-opacity-80 mx-auto h-14 flex justify-between'>
                    <p className='mx-5 pt-3 text-xl text-white font-bold'>GitGrader</p>
                    <button onClick={() => { setIsModalOpen(true) }}><p className='mx-5 pt-3 text-xl text-white '>Add Class</p></button>
                    <p className='text-white text-lg pt-3 mr-3'>{userName}</p>
                </div>
                <ReactModal
                isOpen={isModalOpen}
                contentLabel="Minimal Modal Example"
                className='container w-2/5 mx-auto h-2/3 mt-36 bg-purple-300 border-white focus:border-white'
                >
                    <form onSubmit={handleSubmit} className='container w-1/3 mx-auto h-2/3 py-5 mt-36 bg-purple-300 my-auto border-white '>

                        <div className='my-3 w-4/5'>
                            <label className="text-white">
                                Course id:
                                <input type="text" className="text-gray-500 rounded-lg" value={courseCode} onChange={(event) => { setCourseid(event.target.value) }} />
                            </label>
                        </div>
                        <div className='my-3 w-4/5'>
                            <label className="text-white">
                                Course name:
                                <input value={courseName} className="text-gray-500 rounded-lg w-full" onChange={(event) => { setCoursename(event.target.value) }} />
                            </label >
                        </div>
                        <div className='my-3 w-4/5'>
                            <label className="text-white">
                                Course Semester:
                                <input value={sem} className="text-gray-500 rounded-lg" onChange={(event) => { setSem(event.target.value) }} />
                            </label >
                        </div>
                        <div className='my-3 w-4/5'>
                            <label className="text-white">
                                Course Intro:
                                <textarea value={courseIntro} className="text-gray-500 rounded-lg" onChange={(event) => { setCourseintro(event.target.value) }} />
                            </label >
                        </div>
                        <button className='bg-purple-200 text-purple-700 w-48 h-8 rounded-lg' type="submit" value="Submit">ADD POST</button>
                        <button className='bg-purple-200 text-purple-700 w-48 h-8 rounded-lg mt-3' onClick={() => { setIsModalOpen(false) }}>CANCEL</button>
                    </form>
                </ReactModal>
                <div>
                <ClassList classlist={data} userId={userId} userName={userName}/>
                </div>

            </div>

  )
}

export default ClassesPage
