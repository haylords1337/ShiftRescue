import React from "react";
import "../../styles/style.css";
import { useGather } from "../../utils/getemploy";
import { Paper } from "@material-ui/core";
import {
  Scheduler,
  WeekView,
  AllDayPanel
} from "@devexpress/dx-react-scheduler-material-ui";

const Schedule = () => {
  const { employee } = useGather();
  const chkavail = "";
  return (
    <div className="container round">
      <h1 className="left-25px">Employee Schedules:</h1>
      <ul className="list-group list-group-flush round">
        {employee &&
          employee.map(employ => (
            <li className="list-group-item" key={employ.email}>
              <h3 className="name">{employ.name}</h3>
              <h5>Email:</h5>
              <p>{employ.email}</p>
              <h5>Phone Number:</h5>
              <p>{employ.phone}</p>
              <Paper>
                <Scheduler>
                  <WeekView startDayHour={""} endDayHour={1} />
                  <AllDayPanel />
                </Scheduler>
              </Paper>
            </li>
          ))}
      </ul>
      <button className="btn btn-success" onClick={chkavail}>
        Check Availble Employees
      </button>
    </div>
  );
};

export default Schedule;
