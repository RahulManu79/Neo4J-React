import { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import Button from 'react-bootstrap/Button'
import { useParams, useNavigate } from 'react-router-dom'
import Spinner from '../spinner/Spinner';
import './Course.css';

const Course = () => {

  let params = useParams();
  let id = params.identifier;
  const [courseData, setCourseData] = useState();
  const axiosPrivate = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState(false);
  const {auth,setAuth} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {

    const fetchCourse = async () => {


      setIsLoading(true);

      const response = await axiosPrivate.get(`/api/course/${id}`);

      const cData = response.data;

      setCourseData(cData.courses);

      setIsLoading(false);

    }

    fetchCourse();



  }, [])

  const enroll = async (identifier, courseTitle) => {

    const postEnrollData = {
      "courseIdentifier": identifier,
      "username": auth.user.user.username
    };
    const resp = await axiosPrivate.post('/api/course/enroll', postEnrollData);

    if (resp.status === 200) {
      alert(`Thank you for enrolling in our ${courseTitle} course`);

      navigate("/EnrolledCourses");
    }

  }

  return (
    <>
      <Spinner loadSpinner={isLoading}></Spinner>
      <main>{
        (courseData) ?
          <div key={courseData.identifier} className="card mt-2">
            <div className="card-header-layout">
              <p className="card-header text-secondary bg-white">
                <span className='course-title'>

                  {courseData[0].title}

                </span> &nbsp;&nbsp; <span className="instructor">Instructor:{courseData[0].teacher}</span>
              </p>
              {
                (!courseData.enrolled) ?
                  <Button variant='info' onClick={() => { enroll(id, courseData[0].title) }} >Enroll</Button>
                  :
                  null
              }

            </div>
            <div>
              <hr />
              {
                courseData[0].lessons?.map((l) => {
                  return (
                    <div key={l.identifier} className="mt-2 text-center">
                      <h5 className="card-title m t-2">
                        <span className="text-dark">{l.title}</span>
                      </h5>
                    </div>
                  )
                })
              }
            </div>
            <hr />

          </div>
          : null
      }
      </main>
    </>)
}

export default Course
