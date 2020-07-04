let filterOne = ({ Employees }, prop, value) => {
  const employee = Employees.map(employee => {
    switch (prop) {
      case "email":
        if (employee.email === value) {
          return employee;
        }
        break;
      case "id":
        if (employee.id === value) {
          return employee;
        }
        break;
    }
  });
  var filtered = employee.filter(function(el) {
    return el != null;
  });
  let user = filtered[0];
  return user;
};

module.exports = { filterOne };
