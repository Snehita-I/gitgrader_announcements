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
import AnnouncementCard from './AnnouncementCard'

function AnnouncementList (props) {
  //assignmentsOfClass
  const announcements = props.announcements;
  
  const announcementItems = announcements.map((announcement) =>
      <AnnouncementCard
        announcement={announcement}
        key={announcement._id}
        userName={props.userName}
        userId={props.userId}
       
      />
  )
  return (
      <ul>{announcementItems}</ul>
  )
}
function AnnouncementsPage (props) {
  
  const [data, setData] = useState([])
  const { userId, userName, classId, isInstructor, name, courseCode } = useParams()
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  
  const [announcementCode, setAnnouncementCode] = useState('')
  const [announcementText, setAnnouncementText] = useState('')
  
  useEffect(() => {
    async function fetchData(){
    let dataTemp = []
     
      const response = await axios.get('http://localhost:5000/classes/'+classId);
      console.log(response.data);
      response.data.announcements.map(async (announcement)=>{
       
      const response1 = await axios.get('http://localhost:5000/announcements/'+announcement);
      console.log("res1: ",response1);
      dataTemp.push(response1.data);
      setData([...dataTemp])
      }
      )
   //dataTemp.push({"assignments":response.data.assignments,"id":response.data._id})
      
    }
    fetchData();
  }, [classId])
  
  const handleSubmit = () => {
    //setSelectedTab(newValue)
    console.log("classID",classId);
    axios({
      method: 'post',
      url: 'http://localhost:5000/classes/'+classId+'/addAnnouncement',
      data: {
        announcementCode:announcementCode,
        announcementText:announcementText,
        courseCode:courseCode
      }
    }).then(()=>
    alert("Announcement added")
    ).catch((err)=>
    alert("Annoucement not added"+err)
    )
  }
    
  return (
    <div>
      <div>
         <div className='component bg-purple-600 bg-opacity-80 mx-auto h-14 flex justify-between'>
              <p className='mx-5 pt-3 text-xl text-white font-bold'>GitGrader</p>
             
                {isInstructor &&
                <button className='border-white shadow-none focus:shadow-none focus:border-white' onClick={() => { setIsModalOpen(true) }}>
                  <p className='text-white text-lg mb-4 h-full'>Post an Announcement</p>
                </button>
                }

                  <p className='text-white text-lg pt-3 mr-3'>{userName}</p>
                </div>
          
        

        <ReactModal
            scrollable={true}
            isOpen={isModalOpen}
            contentLabel="Minimal Modal Example"
            className='container w-2/5 mx-auto h-4/5 bg-purple-300 border-white focus:border-white'
            >
                <form onSubmit={handleSubmit} className='container w-1/3 mx-auto h-full py-5 mt-10 bg-purple-300 my-auto border-white '>

                    <div className='my-3 w-4/5'>
                        <label className="text-white">
                        AnnouncementCode
                            <input type="text" className="text-gray-500 rounded-lg" value={announcementCode} onChange={(event) => { setAnnouncementCode(event.target.value) }} />
                        </label>
                    </div>
                  
                    <div className='my-3 w-4/5'>
                        <label className="text-white">
                        Announcement
                            <textarea value={announcementText} className="text-gray-500 rounded-lg" onChange={(event) => { setAnnouncementText(event.target.value)}} />
                        </label >
                    </div>

                    <button className='bg-purple-200 text-purple-700 w-48 h-8 rounded-lg' type="submit" value="Submit">ADD POST</button>
                    <button className='bg-purple-200 text-purple-700 w-48 h-8 rounded-lg mt-3' onClick={() => { setIsModalOpen(false) }}>CANCEL</button>
                </form>
            </ReactModal>
      </div>
       <div className='component bg-gray-200 w-full h-screen'>

            <div className='component rounded h-24 mt-4 mx-32 bg-purple-600 bg-opacity-80'>
                <p className='text-white text-lg pt-2 font-bold'>{name}</p>
               
                <div className='w-64 mt-2'>
                  <p className='text-white'>{courseCode}</p>
                </div>
            </div>
            
            <div className='container mx-auto self-center flex-row items-center justify-center w-4/5'>
                <AnnouncementList announcements={data} userName={userName} userId={userId}/>

            </div>
     </div>
    
      </div>
  )
}

  
export default AnnouncementsPage

