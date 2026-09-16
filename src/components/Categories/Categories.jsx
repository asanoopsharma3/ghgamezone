import React from "react";
import "./Categories.scss";
import { useNavigate } from "react-router-dom";
import { GiRevolver, GiBasketballBasket } from "react-icons/gi";
import { IoExtensionPuzzleOutline, IoGameControllerOutline } from "react-icons/io5";
import { LiaCarSideSolid } from "react-icons/lia";
import { FaRegChessKing } from "react-icons/fa6";
import { AiOutlineCompass } from "react-icons/ai";

const categories = [
  {
    icon: <IoExtensionPuzzleOutline />,
    title: "PUZZLE",
  },
  {
    icon: <LiaCarSideSolid />,
    title: "RACING",
  },
  {
    icon: <GiBasketballBasket />,
    title: "SPORTS",
  },
  {
    icon: <IoGameControllerOutline />,
    title: "ARCADE",
  },
  {
    icon: <FaRegChessKing />,
    title: "STRATEGY",
  },
  {
    icon: <AiOutlineCompass />,
    title: "ADVENTURE",
  },
];

const Categories = () => {
  const navigate = useNavigate();

  return (
    <section className="categories">
      <div className="section-title">
        <h3>CHOOSE YOUR VIBE</h3>
        <span className="title-dash"></span>
      </div>

      <div className="categories-grid">
        {categories.map((item, index) => (
          <div
            className="category-card"
            key={index}
            onClick={() => navigate(`/category/${item.title.toLowerCase()}`)}
          >
            <div className="icon-wrapper">{item.icon}</div>
            <h4>{item.title}</h4>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;