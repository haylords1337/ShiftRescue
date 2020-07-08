import * as React from "react";
import Paper from "@material-ui/core/Paper";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { ViewState, EditingState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  Appointments,
  AppointmentForm,
  AppointmentTooltip,
  DateNavigator,
  TodayButton,
  Toolbar,
  WeekView,
  MonthView,
  EditRecurrenceMenu,
  AllDayPanel,
  ConfirmationDialog
} from "@devexpress/dx-react-scheduler-material-ui";
import { appointments } from "../src/demo-data/appointments";
import { Link } from "react-router-dom";
import Axios from "axios";
const ExternalViewSwitcher = ({ currentViewName, onChange }) => (
  <RadioGroup
    aria-label="Views"
    style={{ flexDirection: "row" }}
    name="views"
    value={currentViewName}
    onChange={onChange}
  >
    <FormControlLabel value="Week" control={<Radio />} label="Week" />
    {/* <FormControlLabel value="Work Week" control={<Radio />} label="Work Week" /> */}
    <FormControlLabel value="Month" control={<Radio />} label="Month" />
  </RadioGroup>
);
export default class Demo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      currentViewName: "Month",
      addedAppointment: {},
      appointmentChanges: {},
      editingAppointmentId: undefined
    };

    this.currentViewNameChange = e => {
      this.setState({ currentViewName: e.target.value });
    };
    this.currentDateChange = currentViewName => {
      this.setState({ currentViewName });
    };
    this.currentDateChange = currentDate => {
      this.setState({ currentDate });
    };
    this.commitChanges = this.commitChanges.bind(this);
    this.changeAddedAppointment = this.changeAddedAppointment.bind(this);
    this.changeAppointmentChanges = this.changeAppointmentChanges.bind(this);
    this.changeEditingAppointmentId = this.changeEditingAppointmentId.bind(
      this
    );
  }
  appointment = async () => {
    const companycode = "E2H1";
    const getShift = await Axios.post("/api/grabshift", { companycode })
      .then(res => {
        console.log(res.data[0]);
        const initialState = res.data[0];
        const appointment = initialState.map(appt => {
          console.log(appt);
          const enddate = appt.ed;
          const startdate = appt.sd;
          appt.startDate = new Date(
            startdate.year,
            startdate.month,
            startdate.day,
            startdate.hour,
            startdate.min
          );
          appt.endDate = new Date(
            enddate.year,
            enddate.month,
            enddate.day,
            enddate.hour,
            enddate.min
          );
          delete appt.sd;
          delete appt.ed;
          return appt;
        });
        console.log(appointment);
        this.setState({ data: appointment });
      })
      .catch(err => {
        console.log(err);
      });
    return getShift;
  };
  componentDidMount() {
    this.appointment();
  }

  changeAddedAppointment(addedAppointment) {
    this.setState({ addedAppointment });
  }
  changeAppointmentChanges(appointmentChanges) {
    this.setState({ appointmentChanges });
  }
  changeEditingAppointmentId(editingAppointmentId) {
    this.setState({ editingAppointmentId });
  }
  commitChanges({ added, changed, deleted }) {
    this.setState(state => {
      let { data } = state;
      if (added) {
        const startingAddedId =
          data.length > 0 ? data[data.length - 1].id + 1 : 0;
        data = [...data, { id: startingAddedId, ...added }];
      }
      if (changed) {
        data = data.map(appointment =>
          changed[appointment.id]
            ? { ...appointment, ...changed[appointment.id] }
            : appointment
        );
      }
      if (deleted !== undefined) {
        data = data.filter(appointment => appointment.id !== deleted);
      }
      return { data };
    });
  }
  render() {
    const { currentViewName } = this.state;
    const {
      currentDate,
      data,
      addedAppointment,
      appointmentChanges,
      editingAppointmentId
    } = this.state;
    return (
      <div className="container">
        <React.Fragment>
          <ExternalViewSwitcher
            currentViewName={currentViewName}
            onChange={this.currentViewNameChange}
          />
          <Paper>
            <Scheduler data={data} height={660}>
              <ViewState
                currentViewName={currentViewName}
                currentDate={currentDate}
                onCurrentDateChange={this.currentDateChange}
              />
              <EditingState
                onCommitChanges={this.commitChanges}
                addedAppointment={addedAppointment}
                onAddedAppointmentChange={this.changeAddedAppointment}
                appointmentChanges={appointmentChanges}
                onAppointmentChangesChange={this.changeAppointmentChanges}
                editingAppointmentId={editingAppointmentId}
                onEditingAppointmentIdChange={this.changeEditingAppointmentId}
              />
              <WeekView startDayHour={""} endDayHour={24} />
              <MonthView />
              <Toolbar />
              <DateNavigator />
              <TodayButton />
              <AllDayPanel />
              <EditRecurrenceMenu />
              <ConfirmationDialog />
              <Appointments />
              <AppointmentTooltip showOpenButton showDeleteButton />
              <AppointmentForm />
            </Scheduler>
          </Paper>
        </React.Fragment>
        <div>
          {console.log(this.state.data)}
          <Link to="/boss">Home Page</Link>
        </div>
      </div>
    );
  }
}
