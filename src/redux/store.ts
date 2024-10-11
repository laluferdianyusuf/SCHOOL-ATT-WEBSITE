import { configureStore } from "@reduxjs/toolkit";
import AdminSlice from "./slicer/adminSlice";
import SchoolSlice from "./slicer/schoolSlice";
import StudentSlice from "./slicer/studentSlice";
import TeacherSlice from "./slicer/teacherSlice";
import NewsSlice from "./slicer/newsSlice";
import AttendanceSlice from "./slicer/attendanceSlice";
import NotificationSlice from "./slicer/notificationSlice";
import CourseSlice from "./slicer/courseSlice";
import CalendarSlice from "./slicer/calendarSlice";
import ActivitySlice from "./slicer/activitySlice";

export const store = configureStore({
  reducer: {
    auth: AdminSlice,
    school: SchoolSlice,
    student: StudentSlice,
    teacher: TeacherSlice,
    news: NewsSlice,
    notification: NotificationSlice,
    attendance: AttendanceSlice,
    course: CourseSlice,
    calendar: CalendarSlice,
    activity: ActivitySlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
