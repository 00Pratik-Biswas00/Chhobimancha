import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import axiosInstance from "../../config/axiosInstance";
import HomeCardSlider from "./homeCardSlider.jsx";
import SkeletonLoaderHeader from "./Skeletons/SkeletonLoaderHeader";
import { FaCommentDots, FaTimes } from "react-icons/fa"; // Chatbot icon and close icon
import "react-loading-skeleton/dist/skeleton.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./custom-slick.css";

const NextArrow = ({ className, style, onClick }) => {
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "black",
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        fontSize: "50px",
      }}
      onClick={onClick}
    />
  );
};

const PrevArrow = ({ className, style, onClick }) => {
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "black",
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        fontSize: "50px",
      }}
      onClick={onClick}
    />
  );
};

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [oldSlide, setOldSlide] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeSlide2, setActiveSlide2] = useState(0);
  const [recentMovies, setRecentMovies] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [showsLoading, setShowsLoading] = useState(true);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false); // Chatbot state

  const GetAllMovies = async () => {
    try {
      const response = await axiosInstance.get("/movies");
      const movies = response.data;
      const recent = movies.slice(Math.max(movies.length - 4, 0));
      const latest = movies
        .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
        .slice(0, 8);
      const popular = movies
        .sort((a, b) => b.numberOfReviews - a.numberOfReviews)
        .slice(0, 8);
      setRecentMovies(recent);
      setLatestMovies(latest);
      setPopularMovies(popular);
    } catch (error) {
      console.error(error);
    } finally {
      setMoviesLoading(false);
    }
  };

  const GetAllShows = async () => {
    try {
      const response = await axiosInstance.get("/shows");
      const shows = response.data;

      const currentDate = new Date();

      const upcomingShows = shows
        .map((show) => {
          const [hours, minutes] = show.time.split(":");
          const [year, month, day] = show.date.split("T")[0].split("-");
          const showDateTime = new Date(year, month - 1, day, hours, minutes);
          return { ...show, showDateTime };
        })
        .filter((show) => show.showDateTime >= currentDate);

      const sortedUpcomingShows = upcomingShows.sort(
        (a, b) => a.showDateTime - b.showDateTime
      );

      const nearestsevenShows = sortedUpcomingShows.slice(0, 7);

      setShows(nearestsevenShows);
    } catch (error) {
      console.error(error);
    } finally {
      setShowsLoading(false);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 2000,
    cssEase: "linear",
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (current, next) => {
      setOldSlide(current);
      setActiveSlide(next);
    },
    afterChange: (current) => setActiveSlide2(current),
  };

  useEffect(() => {
    GetAllMovies();
    GetAllShows();
  }, []);

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <div
      id="Home"
      className="w-screen h-fit flex flex-col items-center bg-background1 text-primary_text font-semibold font-montserrat">
      {/* Movie Sliders */}
      {moviesLoading ? (
        <SkeletonLoaderHeader />
      ) : (
        <header className="h-full w-full my-5 min-h-[60vw] md:min-h-[30vw]">
          <div id="headerMovies" className="w-full h-full">
            <Slider {...settings} className="mx-6 md:mx-14 object-center">
              {recentMovies.map((movie) => (
                <Link key={movie.slug} to={`explore/movies/${movie.slug}`}>
                  <div className="w-[100%] min-w-[60%] min-h-[35vw] md:min-h-[30vw]">
                    {(
                      <div className="w-[95%] sm:w-full h-[50vw] md:h-[30vw]" />
                    ) && (
                      <img
                        src={`${movie.coverImage}`}
                        alt=""
                        className="w-full h-[60vw] md:h-[30vw] object-center rounded-lg"
                      />
                    )}
                  </div>
                </Link>
              ))}
            </Slider>
          </div>
        </header>
      )}

      {/* Latest, Popular Movies and Shows */}
      <div className="w-screen h-full flex justify-center items-center min-h-5 pb-10">
        <div className="w-full h-full">
          <HomeCardSlider
            elements={latestMovies}
            title="Latest Movies"
            what="movies"
            isLoading={moviesLoading}
          />
          <HomeCardSlider
            elements={popularMovies}
            title="Popular Movies"
            what="movies"
            isLoading={moviesLoading}
          />
          <HomeCardSlider
            elements={shows.slice(0, 7)}
            title="Upcoming Shows"
            what="shows"
            isLoading={showsLoading}
          />
        </div>
      </div>

      {/* Floating Chatbot Button */}
      <div
        className="fixed bottom-6 right-6 z-50 cursor-pointer"
        onClick={toggleChatbot}>
        <div
          className="bg-highlight text-primary_text w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-highlight_hover transition duration-300"
          title={isChatbotOpen ? "Close Chatbot" : "Open Chatbot"}>
          {isChatbotOpen ? (
            <FaTimes className="text-3xl" />
          ) : (
            <FaCommentDots className="text-3xl" />
          )}
        </div>
      </div>

      {/* Chatbot Iframe Modal */}
      {isChatbotOpen && (
        <div className="fixed bottom-20 right-6 w-80 h-96 md:w-[400px] md:h-[600px] bg-black shadow-lg border rounded-lg z-40 transition-transform duration-500">
          <iframe
            src="https://www.chatbase.co/chatbot-iframe/tfI7e7vG9V_CBNIf-gYjk"
            width="100%"
            height="100%"
            frameBorder="0"
            title="Chatbot"
            className="rounded-lg"></iframe>
        </div>
      )}
    </div>
  );
};

export default Home;
