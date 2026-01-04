import { FaArrowCircleRight, FaSearch } from "react-icons/fa";
import banner from "../assets/homeBanner.png";
import background from "../assets/background.jpg";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

const Root = () => {
  const [value, setValue] = useState("");

  const navigate = useNavigate();

  const changeInput = (e) => {
    setValue(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?keyword=${value}`);
  };
  return (
    <div className="h-[100dvh] bg-black">
      <div className=" bg-black">
        <Navbar />
        <div
          className="box relative py-3 px-2 md:p-5 mt-4 bg-black rounded-lg bg-cover bg-center"
          style={{ backgroundImage: `url(${background})` }}
        >
          <div className="box-content relative">
            <div className="flex justify-center items-center">
              {/* <img className="h-8 md:h-10 w-auto" src={logo} alt="logo" /> */}
              <Logo />
            </div>
            <div className="searchBox mt-5">
              <form
                onSubmit={handleSubmit}
                action={`/search?keyword=${value}`}
                className="flex h-10 justify-center items-center"
              >
                <input
                  value={value}
                  onChange={changeInput}
                  type="text"
                  placeholder="search anime..."
                  className="w-full text-lg md:w-1/2 px-3 bg-white text-black input h-full"
                />
                <button
                  type="submit"
                  className="px-3 bg-primary text-black btn w-11  h-full"
                >
                  <FaSearch />
                </button>
              </form>
              <div className="banner flex justify-center items-center">
                <img
                  className="banner-img h-auto w-[400px]"
                  src={banner}
                  alt="banner"
                />
              </div>
              <div className="explore w-full flex justify-center items-center mt-5 ">
                <Link
                  to="/home"
                  className="font-bold bg-primary px-4 py-2 rounded-xl w-full md:w-1/2"
                >
                  <h1 className="flex text-black font-extrabold justify-center items-center gap-2 text-base">
                    <p> Explore Animes</p>
                    <FaArrowCircleRight />
                  </h1>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Root;
