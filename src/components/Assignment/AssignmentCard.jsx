import React from 'react'
import { Link } from 'react-router-dom'
import AssignmentDetailPage from '../AssignmentDetailPage/AssignmentDetailPage'
function AssignmentCard (props) {

  return (
       <div className='component rounded lg-shadow flex-col bg-white  my-4 pl-10 '>

          <div className='w-20 pb-1 pt-1  mt-4 bg-pink-700 h-10 rounded-xl'>
                <p className='text-white text-md'>{props.assignment.courseCode}</p>
           </div>
           <div className='w-64 pt-3 pb-2  mt-4 align-right'>
                <p className='text-gray-600 font-bold text-lg'>{props.assignment.title}</p>
           </div>

           <div className='w-3/4 pt-2 pb-4'>
                <p className='text-gray-500 text-md'>{props.assignment.description.substring(0, 80)}</p>
           </div>
           <Link className='rounded-lg w-48 py-1 bg-purple-500 hover:bg-purple-400 ' to={
    {
      pathname: '/assignmentDetailPage/' + props.userId + '/' + props.userName,
      state: { assignment: props.assignment }
    } } onClick={AssignmentDetailPage}> Go to Assignment </Link>

           <div className='grid grid-cols-6 gap-4'>
                <div className='col-end-7 col-span-2 pr-2 max-w-2xl h-10 md:max-w-lg'>
                    <p className='text-right text-gray-400'>{'Submit by:  ' + props.assignment.dueDate.toString().substring(0, 16)}</p>
                </div>
           </div>
       </div>
  )
}
export default AssignmentCard
