import React from "react";
import { Carousel } from "react-bootstrap";
import carousel01 from "../../assets/img/carousel01.png";
import carousel02 from "../../assets/img/carousel02.png";
import carousel03 from "../../assets/img/carousel03.png";

const CarouselComponent = () => {
  return (
    <div className="carousel-container">
      <Carousel>
        <Carousel.Item interval={2500}>
          <img className="d-block w-100 carousel-image" src={carousel02} alt="First slide" />
        </Carousel.Item>
        <Carousel.Item interval={2500}>
          <img className="d-block w-100 carousel-image" src={carousel01} alt="Second slide" />
        </Carousel.Item>
        <Carousel.Item interval={2500}>
          <img className="d-block w-100 carousel-image" src={carousel03} alt="Third slide" />
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default CarouselComponent;
