import { useState } from "react";
import Sidebar from "../Components/Coordinator/Sidebar";
import Header from "../Components/Coordinator/Header";
import ProgramYearCard from "../Components/Coordinator/ProgramYearCard";
import AddCourseCard from "../Components/Coordinator/AddCourseCard";
import CoursesTable from "../Components/Coordinator/CoursesTable";
import DashboardOverview from "../Components/Coordinator/DashboardOverview";
import Batches from "../Components/Coordinator/Batches";
import StudentList from "../Components/Coordinator/StudentList";

export default function CoordinatorDashboard() {
  const [programId, setProgramId] = useState("");
  const [yearId, setYearId] = useState("");
  const [refresh, setRefresh] = useState(false);

  const [active, setActive] = useState("dashboard"); // navigation state

  const refreshCourses = () => {
    setRefresh(!refresh);
  };

  return (
    <div className="d-flex bg-light" style={{ minHeight: "100vh" }}>
      <Sidebar active={active} setActive={setActive} />

      <div className="flex-grow-1 p-4">
        <div className="container-fluid">
          <Header />

          {/* DASHBOARD */}
          {active === "dashboard" && <DashboardOverview />}

          {/* PROGRAMS */}
          {active === "programs" && (
            <ProgramYearCard setProgramId={setProgramId} setYearId={setYearId} />
          )}

          {/* COURSES */}
          {active === "courses" && (
            <>
              <ProgramYearCard setProgramId={setProgramId} setYearId={setYearId} />
              <AddCourseCard yearId={yearId} refreshCourses={refreshCourses} />
              <CoursesTable yearId={yearId} refresh={refresh} />
            </>
          )}

          {/* STUDENTS */}
          {active === "students" && <StudentList />}

          {/* BATCHES */}
          {active === "batches" && <Batches />}
        </div>
      </div>
    </div>
  );
}