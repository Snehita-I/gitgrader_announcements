import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import AssignmentCard from './AssignmentCard'
import axios from 'axios'
function AssignmentList (props) {
  const assignments = props.assignments
 //console.log('assignments: ', assignments)
  const assignmentItems = assignments.map((assignment) =>
      <AssignmentCard
        assignment={assignment}
        userName={props.userName}
        userId={props.userId}
        key={assignment._id.toString()}
      />
  )
  return (
      <ul>{assignmentItems}</ul>
  )
}

function AssignmentPage (props) {
 // console.log("hh");
  const [data, setData] = useState([])
  const userId = "60b4960b558c5556e85ca1bf";
  const userName = "saakshi";
  //const { userId, userName } = useParams()
  
  useEffect(() => {
    
      async function fetchData(){
      
      const response = await axios.get('http://localhost:5000/assignments');
     console.log(response.data);
    let dataTemp = []
      let isPartOfAssignment = false
      // eslint-disable-next-line no-undef
     
      const len =  response.data.length;
      console.log("len",len);
      let i;
      for(i=0;i<len;i++){
      // eslint-disable-next-line no-loop-func
      response.data[i].users.forEach((user) => {
        console.log("res",response.data[i].users);
        console.log("user",user);
        if (userId === user) {
          isPartOfAssignment = true
          dataTemp = [...dataTemp,response.data[i]]
        }
      })
    }
    
   console.log("dataTemp",dataTemp);
    dataTemp.sort(function (a, b) {
      const keyA = a.dueDate.toDate()
      const keyB = b.dueDate.toDate()
      // Compare the 2 dates
      if (keyA < keyB) return 1
      if (keyA > keyB) return -1
      return 0
    })
    //console.log('firebase')
    setData([...dataTemp])
    //console.log("data"+data);
   }
    fetchData();

  }, [userId])
  return (
      <div className='component bg-gray-200'>
            <div className='component bg-purple-600 bg-opacity-80 mx-auto h-14 flex justify-between'>
              <p className='mx-5 pt-3 text-xl text-white font-bold'>GitGrader</p>
              <button className='mx-5 pt-3 text-xl text-white '>
                <a href={'/classesPage/' + userId + '/' + userName}>Classes</a>
               </button>
              <p className='text-white text-lg pt-3 mr-3'>{userName}</p>
            </div>
            <div className='container mx-auto self-center flex-row items-center justify-center w-4/5'>
                <AssignmentList assignments={data} userId={userId} userName={userName}/>

            </div>
     </div>
  )
}
export default AssignmentPage
