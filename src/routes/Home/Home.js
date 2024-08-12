import React, { useState, useEffect } from "react";
import "./Home.css";
import Navbar from "../Navbar/Navbar";
import NavbarDoctor from "../../DoctorRoutes/NavbarDoctor/NavbarDoctor";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { Element, animateScroll as scroll } from "react-scroll";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import doctor1 from "../../assets/doctor1.jpg";
import incubator from "../../assets/incubator.jpg";
import baby from "../../assets/baby.jpg";

const slides = [
  { id: 1, title: "Meet Our Dedicated Team of Neonatal Specialists", image: doctor1, link: "/doctorPage" },
  { id: 2, title: "Read about the Specialized Incubator Unit", image: incubator, link: "/incubator" },
  { id: 3, title: "How does this program help babies?", image: baby, link: "/baby" }
];

function Home() {
  const [role, setRole] = useState(""); // State to store user's role

  // Assume role is set upon login, you can replace this with actual logic
  useEffect(() => {
    const userRole = localStorage.getItem("role"); // Get role from localStorage or wherever you store it
    console.log(userRole)
    setRole(userRole);
  }, []);

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
      {role === "doctor" ? <NavbarDoctor /> : <Navbar />} 
      <div className="container-home">
        <div className="background-container-home">
          <div className="background-image-4">
          <div className="gif-background"></div>
            <span className="pulse-text">every pulse matters</span>
          </div>
          <div className="background-image-5">
            <Slider {...settings} className="slider-container">
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
        </div>
      </div>
    </>
  );
}

export default Home;
