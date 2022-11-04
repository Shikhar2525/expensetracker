import React from "react";
import "./ManageExpense.css";
import { v4 as uuid } from "uuid";
import { useState, useEffect } from "react";
import { categories } from "../../constants.ts";
import Modal from "../Modal/Modal";
import ExpenseService from "../../services/expense.service";
import { useAuth0 } from "@auth0/auth0-react";
import Card from "../Card/Card";
import ExportCSV from "../ExportCSV/ExportCSV";

export const priceWithComma = (price) => {
  return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const totalExpense = (expenses) => {
  let total = 0;
  expenses.forEach((e) => {
    total = total + parseInt(e.price);
  });
  return total;
};
function ManageExpense() {
  const [createResponse, SetCreateResponse] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [spinner2, setSpinner2] = useState(false);
  const [spinner3, setSpinner3] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const [filterValues, setFilterValues] = useState();
  const [copyOfAllData, setCopyOfAllData] = useState([]);
  const [monthlyLimit, setMonthlyLimit] = useState();
  const [copyMonthData, setCopyMonthData] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [disableReport, setDisableReport] = useState(false);
  const { user } = useAuth0();

  const fetchDataAPI = async (mode) => {
    setSpinner2(true);
    let allExpenses = [];

    const data = await ExpenseService.getAllExpenses(
      user,
      mode === "ADD" ? null : filterValues
    );

    const json = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    for (let key in json) {
      allExpenses.push(json[key]);
    }
    allExpenses.forEach((value, index) => {
      allExpenses[index].date = new Date(allExpenses[index].date);
    });
    const sortedAsc = allExpenses.sort(
      (objA, objB) => Number(objA.createdDate) - Number(objB.createdDate)
    );

    if (mode === "ADD") {
      setCopyOfAllData(sortedAsc);
    }

    setExpenses(sortedAsc);
    setSpinner2(false);
  };

  const addExpenseAPI = async (expense) => {
    setSpinner(true);
    await ExpenseService.addExpense(expense);
    setSpinner(false);
    SetCreateResponse(true);
    setFilterValues(null);
    fetchDataAPI("ADD");
    document
      .getElementById("focusElement")
      .scrollIntoView({ behavior: "smooth" });
  };

  function categoryFreq(key) {
    let arr2 = [];
    copyOfAllData.forEach((x) => {
      if (
        arr2.some((val) => {
          return val[key] === x[key];
        })
      ) {
        arr2.forEach((k) => {
          if (k[key] === x[key]) {
            k["occurrence"]++;
          }
        });
      } else {
        let a = {};
        a[key] = x[key];
        a["occurrence"] = 1;
        arr2.push(a);
      }
    });
    const sortedDesc = arr2.sort(
      (objA, objB) => Number(objB.occurrence) - Number(objA.occurrence)
    );
    return sortedDesc;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById("ExpenseName").value;
    const price = document.getElementById("Price").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;
    const desc = document.getElementById("desc").value;
    let newDate = new Date(date);
    let today = new Date();
    let newExpense = {
      id: uuid(),
      user: user.email,
      name: name,
      price: price,
      category: category,
      dateString: newDate.toDateString(),
      date: date,
      createdDate: today,
      month: newDate.getMonth(),
      year: newDate.getFullYear(),
      desc,
    };
    addExpenseAPI(newExpense);
    document.getElementById("ExpenseName").value = "";
    document.getElementById("Price").value = "";
    document.getElementById("category").value = "";
    document.getElementById("date").value = "";
    document.getElementById("checkbox").checked = false;
    document.getElementById("checkboxdate").checked = false;
    document.getElementById("desc").value = "";
  };

  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  const handleCheckChange = () => {
    var checkBox = document.getElementById("checkboxdate");
    if (checkBox?.checked === true) {
      document.getElementById("date").value = formatDate(new Date());
    } else {
      document.getElementById("date").value = "";
    }
  };

  function reverseArr(input) {
    var ret = [];
    for (var i = input.length - 1; i >= 0; i--) {
      ret.push(input[i]);
    }
    return ret;
  }

  const getFilterValues = (valueObj) => {
    setFilterValues({
      category: valueObj.category,
      date: valueObj.startDate,
    });
  };

  const fetchMonthlyLimit = async (id) => {
    let data = await ExpenseService.getMonthlyLimit(user);
    const json = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setMonthlyLimit(json);
    return json;
  };

  const createMonthlyLimit = async (e) => {
    e.preventDefault();
    const limit = document.getElementById("limit").value;
    setSpinner3(true);
    if (monthlyLimit.length === 0) {
      await ExpenseService.addMonthlyLimit({
        id: uuid(),
        user: user.email,
        limit: limit,
      });
      fetchMonthlyLimit();
    } else {
      await ExpenseService.updateLimit(monthlyLimit[0].id, {
        id: monthlyLimit[0].id,
        user: user.email,
        limit: limit,
      });
      fetchMonthlyLimit();
    }
    setSpinner3(false);
  };

  const isLimitReached = () => {
    return totalExpense(copyMonthData) >= monthlyLimit?.[0]?.limit;
  };

  const copyFilterByMonthData = async () => {
    const data = await ExpenseService.getAllExpenses(user, {
      date: new Date(),
      category: null,
    });
    const json = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setCopyMonthData(json);
  };

  const getSearchData = () => {
    return reverseArr(expenses).filter((val) => {
      if (searchString === "") {
        return val;
      } else if (val.name.toLowerCase().includes(searchString.toLowerCase())) {
        return val;
      }
    });
  };

  useEffect(() => {
    fetchDataAPI("ADD");
    fetchMonthlyLimit();
    copyFilterByMonthData();
  }, []);

  useEffect(() => {
    if (refreshList) {
      fetchDataAPI("ADD");
      copyFilterByMonthData();
    }
  }, [refreshList]);

  useEffect(() => {
    fetchDataAPI();
    copyFilterByMonthData();
  }, [filterValues]);

  useEffect(() => {
    setTimeout(() => {
      SetCreateResponse(false);
    }, 3000);
  }, [createResponse]);

  return (
    <>
      <div className="main1 container">
        <div className="formContainer col-6">
          {createResponse ? (
            <div
              class="alert alert-success alert-dismissible show"
              role="alert"
              id="successAlert"
            >
              <strong>New Expense Added</strong>
            </div>
          ) : (
            ""
          )}
          <form className="mt-4" onSubmit={handleSubmit} method="POST">
            <div className="form-group">
              <label for="Price">
                Expense Name <span className="redStar">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="ExpenseName"
                aria-describedby="ExpenseName"
                placeholder="Expense Name"
                maxLength={20}
                required
              />
            </div>
            <div class="form-group mt-3">
              <label for="Price">
                Price (Rs)<span className="redStar">*</span>
              </label>
              <input
                type="number"
                className="form-control"
                id="Price"
                aria-describedby="Price"
                placeholder="Amount in rupee"
                required
              />
            </div>
            <div class="form-group mt-3">
              <label>
                Category <span className="redStar">*</span>
              </label>
              <select
                className="form-select"
                aria-label="Default select example"
                id="category"
                required
              >
                <option value="">Select Category </option>
                {categories.map((category) => {
                  return <option value={category}>{category}</option>;
                })}
              </select>
            </div>
            <div class="form-group mt-3">
              <label for="exampleFormControlTextarea1">
                Description (Optional)
              </label>
              <textarea
                class="form-control"
                id="desc"
                rows="2"
                maxLength={50}
                placeholder="Short Description"
              ></textarea>
            </div>
            <div class="form-group mt-3">
              <label>
                Date <span className="redStar">*</span>
              </label>
              <input
                type="date"
                id="date"
                className="form-control"
                onChange={() =>
                  (document.getElementById("checkboxdate").checked = false)
                }
                required
              />
            </div>
            <div class="form-group mt-3">
              <div class="form-check">
                <input
                  id="checkboxdate"
                  class="form-check-input"
                  type="checkbox"
                  value=""
                  onClick={() => handleCheckChange()}
                />
                <label class="form-check-label" for="flexCheckChecked">
                  Today's Date
                </label>
              </div>
            </div>
            <div class="form-group mt-3  d-flex align-items-center">
              <input type="submit" className="btn btn-dark " value="Add" />
              {spinner ? (
                <div class="spinner-border" role="status">
                  <span class="sr-only"></span>
                </div>
              ) : (
                ""
              )}
            </div>
          </form>
        </div>
        <div className="details col-12 col-xl-6 mt-5">
          <div className="headers col-10">
            <button type="button" class="btn  btn-dark  total">
              Total
              <span class="badge bg-secondary ">
                {priceWithComma(totalExpense(expenses))} Rs
              </span>
            </button>
          </div>

          <hr className="container-fluid col-10" />
          <div className="headers1 col-10 ">
            <button
              class="btn btn-danger"
              type="button"
              data-toggle="collapse"
              data-target="#collapseExample"
              aria-expanded="false"
              aria-controls="collapseExample"
            >
              Set Monthly Limit
            </button>
            {monthlyLimit?.[0]?.limit !== 0 && (
              <button
                type=""
                class={`btn  ${
                  isLimitReached() ? "limitbutton btn-danger" : "bg-success"
                }`}
              >
                Current Monthly Limit : {"  "}
                <strong className="">
                  {priceWithComma(monthlyLimit?.[0]?.limit) || "0"} Rs{" "}
                </strong>
              </button>
            )}
          </div>
          <div className="headers1 col-10 ">
            <div class="collapse mt-3" id="collapseExample">
              <div class="card card-body">
                <form onSubmit={createMonthlyLimit} method="POST">
                  <div className="form-group">
                    <label for="Price">
                      Set Limit (Rs)<span className="redStar">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control mt-2"
                      id="limit"
                      aria-describedby="limit"
                      placeholder="Enter monthly limit"
                      defaultValue={monthlyLimit?.[0]?.limit}
                      required
                    />
                  </div>
                  <div className="limitButtons">
                    <input
                      type="submit"
                      className="btn btn-dark mt-3 "
                      value="Add"
                    />
                    {spinner3 ? (
                      <div class="spinner-border mt-3" role="status">
                        <span class="sr-only"></span>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
          {isLimitReached() && (
            <div class="alert alert-danger col-10 mt-3" role="alert">
              You have reached monthly limit
            </div>
          )}

          <hr className="container-fluid col-10" />
          <div className="headers col-10 ">
            <div class="dropdown">
              <button
                class="btn btn-warning dropdown-toggle menuButtons"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Quick Filters{" "}
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li
                  onClick={() =>
                    setFilterValues({ date: new Date(), category: null })
                  }
                >
                  <p class="dropdown-item">This Month</p>
                </li>
                <li
                  onClick={() =>
                    setFilterValues({
                      date: null,
                      category: null,
                      thisYear: true,
                    })
                  }
                >
                  <p class="dropdown-item">This Year</p>
                </li>
                {categoryFreq("category")
                  .slice(0, 3)
                  .map((value) => {
                    return (
                      <li
                        onClick={() =>
                          setFilterValues({
                            date: null,
                            category: value.category,
                          })
                        }
                      >
                        <p class="dropdown-item">
                          Category : {value.category} ({value.occurrence})
                        </p>
                      </li>
                    );
                  })}
              </ul>
            </div>
            <div class="vr"></div>
            <button
              type="button"
              class="btn btn-primary menuButtons "
              data-bs-toggle="modal"
              data-bs-target={`#filterModal`}
            >
              <i class="bi bi-funnel"></i> Filter
            </button>
            <div class="vr"></div>
            <button
              type="button"
              class="btn btn-danger menuButtons "
              onClick={() => {
                setFilterValues(null);
              }}
              disabled={!filterValues}
            >
              Remove Filters
            </button>
            <div class="vr"></div>
            <ExportCSV
              data={expenses}
              canDisable={!(expenses.length > 0) || disableReport}
            />
          </div>
          <hr className="container-fluid col-10" />
          <div className="headers col-10">
            {filterValues && (
              <div
                class="alert alert-primary col-12  filterApplied"
                role="alert"
              >
                Filter applied on{" "}
                <u>
                  {filterValues?.date?.toString() || filterValues?.thisYear
                    ? "Date"
                    : ""}
                  {filterValues?.date?.toString() && filterValues?.category
                    ? " & "
                    : ""}
                  {filterValues?.category
                    ? `Category: ${filterValues?.category}`
                    : ""}
                </u>
              </div>
            )}
          </div>
          {filterValues && <hr className="container-fluid col-10 mt-1" />}
          <div className="headers col-10 ">
            <input
              type="text"
              className="form-control searchE "
              placeholder="Search expense"
              onChange={(event) => {
                setSearchString(event.target.value);
                if (event.target.value !== "") {
                  setDisableReport(true);
                } else {
                  setDisableReport(false);
                }
              }}
            />
          </div>
          <span id="focusElement"></span>
          {spinner2 ? (
            <div class="spinner-border mt-3" role="status">
              <span class="sr-only"></span>
            </div>
          ) : expenses.length > 0 ? (
            getSearchData()?.length > 0 ? (
              getSearchData()
                .filter((val) => {
                  if (searchString === "") {
                    return val;
                  } else if (
                    val.name.toLowerCase().includes(searchString.toLowerCase())
                  ) {
                    return val;
                  }
                })
                .map((expense, index) => {
                  return (
                    <Card
                      expense={expense}
                      setRefreshList={(value) => setRefreshList(value)}
                      index={index}
                    />
                  );
                })
            ) : (
              <>
                <hr className="container-fluid col-10" />
                <div class="alert alert-danger alert-dismissible d-flex align-items-center fade show">
                  <i class="bi-exclamation-octagon-fill"></i>
                  <strong class="mx-2">No Search Results Found</strong>
                </div>
              </>
            )
          ) : (
            <div class="alert alert-danger col-10 mt-3" role="alert">
              No Data Available.{" "}
              <strong>Try adding data or changing filter</strong>
            </div>
          )}
        </div>
      </div>
      <Modal
        id="filterModal"
        type="Filter"
        sendFilterValues={(value) => getFilterValues(value)}
      />
    </>
  );
}

export default ManageExpense;
