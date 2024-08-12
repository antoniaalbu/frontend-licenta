import React, { useState, useEffect } from "react";
import "../../routes/Home/Home.css";
import './HomeDoctor.css';
import NavbarDoctor from "../NavbarDoctor/NavbarDoctor";
import NavbarParent from "../../ParentRoutes/NavbarParent/NavbarParent";
import Slider from "react-slick";
import { Link, useNavigate } from "react-router-dom";
import { Element, animateScroll as scroll } from "react-scroll";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import doctor1 from "../../assets/parents.jpg";
import incubator from "../../assets/ecg3.jpg";
import baby from "../../assets/baby.jpg";
import Cookies from "js-cookie";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client'; 
import NotificationService from "../../NotificationService/NotificationService";


const slides = [
  { id: 1, title: "Manage Parents", image: doctor1, link: "/manageParents" },
  { id: 2, title: "Manage Babies", image: baby, link: "/registerBaby" },
  { id: 3, title: "Sensor Dashboard", image: incubator, link: "/sensors" }
];

function HomeDoctor() {
  const [role, setRole] = useState(""); 
  const [doctorName, setDoctorName] = useState("");
  const [babies, setBabies] = useState([]); 
  
  const navigate = useNavigate();

  useEffect(() => {
    
    const userRole = Cookies.get("userRole"); 
    const doctorName = Cookies.get("doctorName");
    const supervisorId = Cookies.get("supervisorId");
    console.log(userRole);
    setRole(userRole);
    
    
    fetchDoctors(supervisorId);
    fetchBabies(supervisorId);
  }, []);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8081/ws'); 
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Connected to WebSocket');
        client.subscribe('/topic/sensorData', message => {
          const data = JSON.parse(message.body);
          console.log('Received data from WebSocket:', data);
        });
      },
      onDisconnect: () => {
        console.log('Disconnected from WebSocket');
      }
    });

    client.activate();
    return () => {
      client.deactivate();
    };

  }, []);

  const fetchDoctors = async (supervisorId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/supervisors/${supervisorId}`);
      if (response.ok) {
        const data = await response.text();
        setDoctorName(data);
        console.log(doctorName);
      } else {
        console.error('Error fetching data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchBabies = async (supervisorId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/baby/supervisor/${supervisorId}`);
      if (response.ok) {
        const data = await response.json();
        setBabies(data);
        console.log(babies);
      } else {
        console.error('Error fetching data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const updateDoctorName = (newName) => {
    Cookies.set("doctorName", newName);
    setDoctorName(newName);
  };

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

  const redirectToBabyProfile = (babyId, babyName) => {
    console.log(babyId);
    navigate(`/babyProfile/${babyId}/${babyName}`);
  };

  return (
    <>
      {role === "doctor" ? <NavbarDoctor /> : <NavbarParent />}
      <NotificationService />
      <div className="container-home">
        <div className="background-container-home">
          <div className="background-image-doctor">
            <span className="custom-text-doctor">{`Welcome back, ${doctorName}`}</span> 
            <div className="gif-background"></div>
            <span className="pulse-text">Tiny Life Sentinel</span>
          </div>
          <div className="background-image-doctor2">
            <Slider {...settings} className="slider-container-doctor">
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
          </div>
          <div className="baby-names-container">
            <h2>Assigned Babies</h2>
            <ul>
              {babies.map((baby) => (
                <li key={baby.babyId}>
                  <button className="baby-redirect" onClick={() => redirectToBabyProfile(baby.babyId, baby.babyName)}>
                    {baby.babyName}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomeDoctor;
