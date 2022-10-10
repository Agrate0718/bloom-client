import { useParams, Link, useNavigate } from 'react-router-dom' 
import { useEffect, useState } from 'react'
import axios from 'axios'
import CommentList from '../partials/CommentList'

export default function Course(props){

    const [form, setForm] = useState({
        content: '',
        commenter: props.currentUser.id
    })
    const [course, setCourse] = useState({comments:[],
                                            title:'',
                                            createdBy:'',
                                            price: 0,
                                            photoLink: '',
                                            _id:'',
                                            description: ''})

    const [errorMessage, setErrorMessage] = useState('')

    const { courseId } = useParams()
    const navigate = useNavigate()
    console.log(course.comments)
    


    useEffect(() => {
        const getCourse = async () => {
            try {
                //axios to the back end to get course
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api-v1/courses/${courseId}`)
                console.log(response.data)
                setCourse(response.data)
            } catch (err) {
                console.warn(err)
                if (err.response) {
                    setErrorMessage(err.response.data.message)
                }
            }
        }
        
        getCourse() 
        console.log(course)
    }, [])
    
    const handleDelete = async () => {
        try {
            // axios to the backend to delete this Course
            await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api-v1/courses/${courseId}`)
            // after deletion, navigate back to /courses
            navigate('/courses')
        } catch(err) {
            console.warn(err)
            if (err.response) {
                setErrorMessage(err.response.data.message)
            }
        }
    }

    const addToCart = async () => {
        try { 
            await axios.put(`${process.env.REACT_APP_SERVER_URL}/api-v1/users/${props.currentUser.id}/cart/${courseId}` )
            navigate(`/users/${props.currentUser.id}/cart`)
            
        } catch(err) {
            console.warn(err)
            if (err.response) {
                setErrorMessage(err.response.data.message)
            }
        }
    }

    const handleSubmit = async e => {
        try {
            e.preventDefault()
            await axios.post(`${process.env.REACT_APP_SERVER_URL}/api-v1/courses/${courseId}/comments`, form)
            navigate('/courses')
        } catch(err) {
            console.warn(err)
            if (err.response) {
                setErrorMessage(err.response.data.message)
            }
        }
    }

    return(
        <div>
            <h1>Course Details</h1>

            <p>{errorMessage}</p>

            <div>
                <Link to={`/courses/${courseId}/edit`}>
                    <button>Edit</button>
                </Link>

                {" | "}

                <button onClick={handleDelete}>
                    Delete
                </button>

                { " | " } 

                <button onClick={addToCart}>Add to cart</button>
            </div>

            <div>
                <h1><strong>Title:</strong> {course.title}</h1>

                <p><img src={course.photoLink} alt={course.title} width="200"
                height="80"/></p>

                <p><strong>Price:</strong> {course.price}</p>

                <p><strong>Description:</strong> {course.description}</p>

                
                
                    <div> <CommentList comments={course.comments} /> </div>
                           
         <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor='content'>comment:</label>
                <input 
                    type="text"
                    id='content'
                    placeholder='Comment here'
                    onChange={e => setForm({...form, content: e.target.value})} />
            </div>
            <button type='submit'>Comment</button>
         </form>
            </div>

        </div>

    )
}

