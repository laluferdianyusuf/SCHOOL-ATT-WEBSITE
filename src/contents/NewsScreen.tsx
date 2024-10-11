import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { IoAddOutline } from "react-icons/io5";
import {
  PiArrowLeftLight,
  PiCheckCircleFill,
  PiGlobeHemisphereWestFill,
  PiNewspaperFill,
  PiUploadSimpleLight,
  PiUser,
  PiWarningFill,
} from "react-icons/pi";
import { Admin, News, School, Student, Teacher } from "../types/types";
import { SingleValue } from "react-select";
import { InputField, NotificationAlert, SelectOptions } from "../components";
import { AppDispatch } from "../redux/store";
import { useDispatch } from "react-redux";
import { createNews, listNewsBySchool } from "../redux/slicer/newsSlice";

interface SelectOption {
  value: string;
  label: string;
}

interface NewsProps {
  student: Student[];
  teacher: Teacher[];
  user: Admin;
  schools: School;
  handleDashboardClick: () => void;
  setActiveMenu: Dispatch<SetStateAction<string>>;
}

export const NewsScreen: React.FC<NewsProps> = ({
  user,
  handleDashboardClick,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [news, setNews] = useState<News[]>([]);
  const [input, setInput] = useState<News>({
    title: "",
    description: "",
  });
  const [selectedCategory, setSelectedCategory] =
    useState<SingleValue<SelectOption> | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (user?.schoolId) {
      fetchNews();
    }
  }, [user?.schoolId]);

  const fetchNews = async () => {
    try {
      const res = await dispatch(
        listNewsBySchool({ id: Number(user?.schoolId) })
      ).unwrap();

      setNews(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeNews = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeCategory = (value: SingleValue<SelectOption>) => {
    setSelectedCategory(value);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  const options = [
    { label: "Academic", value: "Academic" },
    { label: "Education", value: "Education" },
    { label: "Extracurricular", value: "Extracurricular" },
    { label: "Announcements", value: "Announcements" },
    { label: "Achievements", value: "Achievements" },
    { label: "Activities", value: "Activities" },
    { label: "Events", value: "Events" },
    { label: "Technology", value: "Technology" },
  ];

  const handleSaveChanges = async () => {
    setSuccess("");
    setError("");
    try {
      await dispatch(
        createNews({
          id: Number(user.schoolId),
          title: input.title,
          description: input.description,
          category: selectedCategory?.value,
          image: selectedImage,
        })
      ).unwrap();

      setSuccess("News created");
      setInput({ title: "", description: "" });
      setSelectedCategory(null);
      setSelectedImage(null);
      setImagePreview(null);

      fetchNews();
    } catch (error: any) {
      setError("Error creating news");
    }
  };

  return (
    <div className="h-[97vh] 2xl:h-[98.2vh] bg-white rounded-md flex flex-col gap-4 border border-slate-200">
      <div className="border-b-2 border-slate-200 px-5 py-2 flex justify-between items-center">
        <div className="text-sm">
          <ul className="flex gap-3 items-center">
            <li>
              <IoAddOutline size={20} color="#4c637d" />
            </li>
            <div className="w-[2px] rounded-full bg-slate-200 h-4" />
            <li className="m-0 p-0">
              <div className="breadcrumbs py-0 text-sm">
                <ul>
                  <li
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={handleDashboardClick}
                  >
                    <PiGlobeHemisphereWestFill size={20} color="#4c637d" />
                    <p className="text-sm text-slate-500">Home</p>
                  </li>
                  <li className="flex items-center gap-2">
                    <PiNewspaperFill size={20} color="#0D9485" />
                    <p className="text-sm text-custom-green-2">News</p>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <div className="p-[1.5px] flex gap-2 items-center">
          <PiUser size={20} className="text-custom-green-2" />
          <p className="capitalize">{user?.name ? user?.name : "Guest"}</p>
        </div>
      </div>

      <div className="px-5 flex flex-row gap-3 overflow-auto">
        <div className="items-baseline flex flex-col gap-3 w-1/3">
          <div className="flex items-center gap-3">
            <button onClick={handleDashboardClick}>
              <PiArrowLeftLight size={15} />
            </button>
            <h2>Add News</h2>
          </div>
          <InputField
            label="Title"
            labelStyle="text-xs font-semibold text-gray-700"
            name="title"
            placeholder="Enter title"
            value={input.title}
            onChange={handleChangeNews}
          />
          <SelectOptions
            values={selectedCategory}
            handleChange={handleChangeCategory}
            label="Categories"
            placeholder="Select categories"
            options={options}
          />

          <InputField
            label="Descriptions"
            labelStyle="text-xs font-semibold text-gray-700"
            name="description"
            placeholder="Enter description"
            value={input.description}
            onChange={handleChangeNews}
          />

          <div className="flex items-center gap-2 justify-between w-full">
            <div className="flex-1">
              <label
                htmlFor="image-upload"
                className="flex items-center justify-center w-full px-4 py-2 bg-blue-500 text-white rounded-md shadow-md cursor-pointer hover:bg-blue-600 transition-colors duration-200"
              >
                <PiUploadSimpleLight className="mr-2" /> Choose Image
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden flex-1"
              />
            </div>
            <button
              onClick={handleSaveChanges}
              className="bg-custom-green-2 text-white px-4 py-2 rounded-md hover:bg-custom-green-1 transition duration-200"
            >
              Save News
            </button>
          </div>

          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Selected Preview"
                className="w-32 h-32 object-cover border border-gray-300 rounded-md"
              />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-auto no-scrollbar">
          {news.length > 0 ? (
            news.map((item, index) => (
              <div
                key={index}
                className="border p-4 rounded-md mb-2 bg-custom-green-3"
              >
                <h3 className="font-semibold text-lg text-custom-green-2">
                  {item.title}
                </h3>
                <p className="text-gray-700">{item.description}</p>
                {item.image && (
                  <img
                    src={`http://localhost:2500${item.image}`}
                    alt="News"
                    className="w-full h-96 mt-2 rounded-md"
                  />
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No news available.</p>
          )}
        </div>
      </div>
      {success && (
        <NotificationAlert
          icon={<PiCheckCircleFill size={15} color="#47a855" />}
          text={success}
        />
      )}
      {error && (
        <NotificationAlert
          icon={<PiWarningFill size={15} color="#de5757" />}
          text={error}
        />
      )}
    </div>
  );
};
