import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Admin, News, School, Student, Teacher } from "../types/types";
import { listNewsBySchool } from "../redux/slicer/newsSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import Slider, { Settings } from "react-slick";
import { uri } from "../utils/uri";
import { Card, Loading } from "../components";
import { IoAddOutline } from "react-icons/io5";
import { PiGlobeHemisphereWestFill, PiUser } from "react-icons/pi";

interface HomeProps {
  student: Student[];
  teacher: Teacher[];
  user: Admin;
  schools: School;
  handleDashboardClick: () => void;
  handleNewsClick: () => void;
  setActiveMenu: Dispatch<SetStateAction<string>>;
  isCollapsed?: boolean;
}

function SampleNextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} absolute right-3`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} absolute left-3 z-50`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
}

export const Home: React.FC<HomeProps> = ({
  student,
  teacher,
  user,
  schools,
  setActiveMenu,
  handleNewsClick,
  isCollapsed,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user?.schoolId) {
      fetchNews();
    }
  }, [user?.schoolId]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await dispatch(
        listNewsBySchool({ id: Number(user?.schoolId) })
      ).unwrap();

      setNews(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const settings: Settings = {
    className: "center",
    lazyLoad: "ondemand",
    centerMode: true,
    infinite: true,
    centerPadding: "170px",
    slidesToShow: 2,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 5000,
    dots: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const getLastUpdateTime = (data: News[]): string | null => {
    if (!data || data.length === 0) return null;

    const dataWithUpdate = data.filter((news) => news.updatedAt);

    if (dataWithUpdate.length === 0) return null;

    const sortedData = [...dataWithUpdate].sort((a, b) => {
      const dateA = new Date(a.updatedAt!).getTime();
      const dateB = new Date(b.updatedAt!).getTime();
      return dateB - dateA;
    });

    return sortedData[0].updatedAt || null;
  };

  const lastUpdated = getLastUpdateTime(news);
  const now = new Date() as any;
  let timeSinceUpdate = "No data available";

  if (lastUpdated) {
    const lastUpdatedDate = new Date(lastUpdated);
    const timeDifference = Math.floor(
      (now.getTime() - lastUpdatedDate.getTime()) / 1000
    );

    if (timeDifference !== null) {
      const days = Math.floor(timeDifference / 86400);
      const hours = Math.floor((timeDifference % 86400) / 3600);
      const minutes = Math.floor((timeDifference % 3600) / 60);
      const seconds = timeDifference % 60;

      if (days > 0) {
        timeSinceUpdate = `${days} day${days > 1 ? "s" : ""}, ${hours} hour${
          hours > 1 ? "s" : ""
        } ago`;
      } else if (hours > 0) {
        timeSinceUpdate = `${hours} hour${
          hours > 1 ? "s" : ""
        }, ${minutes} minute${minutes > 1 ? "s" : ""} ago`;
      } else if (minutes > 0) {
        timeSinceUpdate = `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
      } else {
        timeSinceUpdate = `${seconds} second${seconds > 1 ? "s" : ""} ago`;
      }
    }
  }
  return (
    <div className="overflow-auto h-full bg-white rounded-md flex flex-col gap-3 border border-slate-200">
      <div className="border-b-2 border-slate-200 px-5 py-2 flex justify-between items-center">
        <div className="text-sm">
          <ul className="flex gap-3 items-center">
            <li className="">
              <IoAddOutline size={20} color="#4c637d" />
            </li>
            <div className="w-[2px] rounded-full bg-slate-200 h-4" />
            <li className="flex items-center gap-2">
              <PiGlobeHemisphereWestFill size={20} color="#0D9485" />
              <p className="text-sm text-custom-green-2">Home</p>
            </li>
          </ul>
        </div>
        <div className="p-[1.5px] flex gap-2 items-center">
          <PiUser size={20} className="text-custom-green-2" />
          <p className="capitalize">{user?.name ? user?.name : "Guest"}</p>
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="px-10 pt-5 w-full flex justify-between items-center border-b-2 border-slate-200 pb-4">
            <div className="">
              <h1 className="mb-2 card-title text-custom-green-2 font-bold text-[36px] pb-3">
                {schools?.name}
              </h1>
            </div>

            <div>
              <Card
                teacher={teacher.length}
                student={student.length}
                setActiveMenu={setActiveMenu}
              />
            </div>
          </div>
          <div className="flex justify-between items-center px-10">
            <button
              onClick={handleNewsClick}
              className="border rounded-lg border-slate-300 flex flex-row gap-1 items-center px-2 bg-white py-[7px]"
            >
              <IoAddOutline size={15} color="#0d9485" />
              <p className="text-xs">Add News</p>
            </button>
            <p className="text-xs flex justify-end gap-2">
              <span>last updates,</span>
              <span className="text-custom-green-2"> {timeSinceUpdate}</span>
            </p>
          </div>
          <div
            className={`w-full mx-auto rounded-lg ${
              isCollapsed
                ? "max-w-[1270px] 2xl:max-w-[1825px]"
                : "max-w-[1075px] 2xl:max-w-[1630px]"
            } transition-all ease-in-out duration-300`}
          >
            <Slider {...settings}>
              {Array.isArray(news) &&
                news.map((item) => (
                  <div
                    className="relative shadow-md rounded-xl mb-3"
                    key={item.id}
                  >
                    <img
                      src={`${uri}${item.image}`}
                      alt=""
                      className="w-full rounded-xl mb-1 h-64 2xl:h-[30rem]"
                    />
                    <div className="px-2 pb-2">
                      <p className="font-bold">{item.title}</p>
                      <p className="text-xs">{item.description}</p>
                    </div>
                  </div>
                ))}
            </Slider>
          </div>
        </>
      )}
    </div>
  );
};
