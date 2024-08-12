import React, { useState, useEffect } from "react";
import "../../routes/Home/Home.css";
import './HomeParent.css'
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { Element, animateScroll as scroll } from "react-scroll";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ecg from "../../assets/ecg3.jpg";
import termometru from "../../assets/termometru.jpg"
import humidity from "../../assets/humidity.jpg";
import scutec from "../../assets/diaper.jpeg";
import microphone from "../../assets/microphone.jpg";
import doctor1 from "../../assets/doctor1.jpg";
import incubator from "../../assets/incubator.jpg";
import baby from "../../assets/baby.jpg";
import NavbarParent from "../NavbarParent/NavbarParent";
import NavbarDoctor from "../../DoctorRoutes/NavbarDoctor/NavbarDoctor";
import Cookies from 'js-cookie'; 
import NotificationService from "../../NotificationService/NotificationService";

const slides = [
  { id: 1, title: "View ECG", image: ecg, link: "/ps5" },
  { id: 2, title: "View Temperature", image: termometru, link: "/temperature" },
  { id: 3, title: "View Air Humidity", image: humidity, link: "/humidity" },
  { id: 4, title: "View Diaper Humidity", image: scutec, link: "/pampersHumidity" },
  { id: 5, title: "View Crying Chart", image: microphone, link: "/microphone" }
];

const slides2 = [
    { id: 1, title: "Meet Our Dedicated Team of Neonatal Specialists", image: doctor1, link: "/doctorPage" },
    { id: 2, title: "Read about the Specialized Incubator Unit", image: incubator, link: "/incubator" },
    { id: 3, title: "How does this program help babies?", image: baby, link: "/baby" }
  ];

 




function HomeParent() {
  const [role, setRole] = useState(""); 
  const [parentName, setParentName] = useState(""); 
  const [parentId, setParentId] = useState("");
  const [babies, setBabies] = useState([]); 
  

  const fetchUserRole = () => {
    const userRole = Cookies.get("userRole");
    setRole(userRole);
};



  useEffect(() => {
    const userRole = localStorage.getItem("userRole"); 
    const parentName = Cookies.get('parentName');
    
    console.log(parentId)
    setRole(userRole);
    setParentId(parentId);
    setParentName(parentName);
    fetchParentBabies();
    fetchParentDetails();
  }, []);

  useEffect(() => {
    fetchUserRole();
  }, []);

  const fetchParentBabies = async () => {
    try {
      const parentId = Cookies.get('parentId');
      const response = await fetch(`http://localhost:8081/api/parents/myBabies/${parentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setBabies(data); 
      } else {
        console.error('Failed to fetch babies');
      }
    } catch (error) {
      console.error('Error fetching babies:', error);
    }
  };

  const fetchParentDetails = async () => {
    const userId = Cookies.get('userId');
    const userRole = Cookies.get('userRole');

    if (!userId || userRole !== 'parent') {
        console.error('Invalid user or role');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8081/api/details/${userId}`); 
        if (response.ok) {
            const data = await response.json();
            setParentName(data.firstName + ' ' + data.lastName);
        } else {
            console.error('Failed to fetch parent details');
        }
    } catch (error) {
        console.error('Error fetching parent details:', error);
    }
};
  
const slides = [
  { id: 1, title: "View ECG", image: ecg, link: `/1/${baby.incubatorId}` },
  { id: 2, title: "View Air Temperature", image: termometru, link:`/4/${baby.incubatorId}`  },
  { id: 3, title: "View Air Humidity", image: humidity, link: `/5/${baby.incubatorId}` },
  { id: 4, title: "View Diaper Humidity", image: scutec, link: `/2/${baby.incubatorId}` },
  { id: 5, title: "View Crying Chart", image: microphone, link: `/3/${baby.incubatorId}` },
  { id: 6, title: "View Body Temperature Chart", image: termometru, link: `/6/${baby.incubatorId}` }
];


  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <div className="slick-prev"></div>,
    nextArrow: <div className="slick-next"></div>
  };

  const scrollToSection = (id) => {
    scroll.scrollTo(`section${id}`, {
      duration: 800,
      smooth: "easeInOutQuart"
    });
  };

  return (
    <>
      {role === "parent" ? <NavbarParent /> : <NavbarDoctor />}
      <NotificationService />
      <div className="container-home">
      <div className="babies-container">
            {babies.length > 0 ? (
              <ul style={{ listStyleType: 'none' }}> 
                {babies.map(baby => (
                  <li key={baby.id}>
                    <span>Parent of: {baby.babyName}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No babies found.</p>
            )}
          </div>
        <div className="background-container-home">
          <div className="background-image-parent">
          
            <span className="custom-text-parent">{`welcome back ${parentName}`}</span> 
          </div>
        
            <Slider {...settings} className="slider-container-parent">
              {slides.map((slide) => (
                <div key={slide.id}>
                  <Link
                    to={slide.link}
                    onClick={() => scrollToSection(slide.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <Element name={`section${slide.id}`}>
                      <div className="image-container">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "10px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                          }}
                        />
                      </div>
                    </Element>
                  </Link>
                  <h3>{slide.title}</h3>
                </div>
              ))}
            </Slider>
            <Slider {...settings} className="slider-container-parent-2">
              {slides2.map((slide) => (
                <div key={slide.id}>
                  <Link
                    to={slide.link}
                    onClick={() => scrollToSection(slide.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <Element name={`section${slide.id}`}>
                      <div className="image-container">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "10px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                          }}
                        />
                      </div>
                    </Element>
                  </Link>
                  <h3>{slide.title}</h3>
                </div>
              ))}
            </Slider>
          </div>
        </div>
     
    </>
  );
}

export default HomeParent;
