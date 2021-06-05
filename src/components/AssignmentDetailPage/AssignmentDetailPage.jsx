/* eslint-disable array-callback-return */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { useForm } from 'react-hook-form'
import axios from 'axios'

import bg from '../Images/bg_assignment_detail.jpg'
function AssignmentDetailPage (props) {
  const { userId, userName } = useParams()
  const [isInstructor, setIsInstructor] = useState(false)
  const { register, handleSubmit } = useForm()
  alert(userName)
  useEffect(() => {
    async function fetchData(){
      const courseId = props.location.state.assignment.courseCode.trim();
      console.log("user"+userId)
      console.log("here"+courseId)
      const response = await axios.get('http://localhost:5000/classes/'+courseId);
     console.log(response.data);
        response.data.instructors.map((instructorId) => {
          //alert(instructorId);
          if (instructorId.trim()=== userId) {
            alert('In');
            setIsInstructor(true)
          }
        })
      }
    alert(isInstructor);
    fetchData();
  }, [isInstructor, props.location.state.assignment, props.location.state.assignment.classId, userId])
  
  return (
    <div className='container'>
    <div className='w-full bg-white'>
        <div className=' mr-0 bg-white  w-full h-14 flex justify-between'>
           <text className='mx-5 pt-3 text-xl text-gray-600 font-bold'>GitGrader</text>
            <text className='text-gray-600 text-lg pt-3 mr-3'>{userName}</text>
        </div>
        <div className='mx-40  flex-col my-5 '>
                    <div className=' rounded-lg h-52 flex ' style={{ backgroundColor: '#390069' }}>
                        <div className='flex-col'>
                            <div className='mx-10 pt-8'>
                                <text className='text-4xl text-white font-bold '>{props.location.state.assignment.title}</text>
                            </div>
                            <div className='mx-10 pt-8'>
                                <text className='text-xl text-white'>Due Date: {props.location.state.assignment.dueDate.toString().substring(0, 15)}</text>
                            </div>
                        </div>
                        <div className='h-48 w-56 ml-32'>
                             <img src={bg} className='h-48 w-56'/>
                        </div>
                    </div>
          </div>
          <div className='flex'>
                        <div className='container w-64 h-56 shadow-lg my-7 mr-5 rounded-lg border-gray-300 border-2 flex-row justify-items-center '>
                            
                            <form className='m-5'>
                                <input  required type ='file'/>
                                <button type='submit' value='submit'  onSubmit={()=>alert("ok")}>Share</button>
                            </form>
                        </div>
                        <div className='container flex-3 w-4/5  shadow-inner my-7  rounded-lg border-gray-300 border-2 p-5'>
                           <text>{props.location.state.assignment.description}</text>
                        </div>
             </div>
    </div>
    </div>

  )
}
export default AssignmentDetailPage
