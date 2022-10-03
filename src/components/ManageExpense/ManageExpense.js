import React from "react";
import "./ManageExpense.css";
import { v4 as uuid } from "uuid";
import { useState, useEffect } from "react";
import {
  categories,
  circleColor,
  categoriesIcon,
  iconColors,
} from "../../constants.ts";
import Modal from "../Modal/Modal";
import ExpenseService from "../../services/expense.service";
import { useAuth0 } from "@auth0/auth0-react";
import Card from "../Card/Card";
import ExportCSV from "../ExportCSV/ExportCSV";

function AddExpense() {
  const [createResponse, SetCreateResponse] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [spinner2, setSpinner2] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const [filterValues, setFilterValues] = useState();

  const { isAuthenticated, user, isLoading } = useAuth0();

  const getCategoryTotal = (category) => {
    let total = 0;
    expenses.forEach((expense) => {
      if (expense.category === category) {
        total = total + parseInt(expense.price);
      }
    });
    return total;
  };

  const categoryExpense = () => {
    let allCategoryTotal = {};
    categories.forEach((category) => {
      allCategoryTotal[category] = getCategoryTotal(category)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    });
    return allCategoryTotal;
  };

  const fetchDataAPI = async () => {
    setSpinner2(true);
    let allExpenses = [];

    const data = await ExpenseService.getAllExpenses(user, filterValues);

    const json = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    for (let key in json) {
      allExpenses.push(json[key]);
    }
    console.log(allExpenses);
    allExpenses.forEach((value, index) => {
      allExpenses[index].date = new Date(allExpenses[index].date);
    });
    const sortedAsc = allExpenses.sort(
      (objA, objB) => Number(objA.createdDate) - Number(objB.createdDate)
    );

    setExpenses(sortedAsc);
    setSpinner2(false);
  };

  const addExpenseAPI = async (expense) => {
    setSpinner(true);
    const data = await ExpenseService.addExpense(expense);
    setSpinner(false);
    SetCreateResponse(true);
    setFilterValues(null);
    fetchDataAPI();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById("ExpenseName").value;
    const price = document.getElementById("Price").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;
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
    };
    addExpenseAPI(newExpense);
  };

  const priceWithComma = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const totalExpense = () => {
    let total = 0;
    expenses.forEach((e) => {
      total = total + parseInt(e.price);
    });
    return priceWithComma(total);
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
    var checkBox = document.getElementById("checkbox");
    if (checkBox?.checked === true) {
      document.getElementById("date").value = formatDate(new Date());
    } else {
      document.getElementById("date").value = "";
    }
  };

  function reverseArr(input) {
    var ret = new Array();
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
  useEffect(() => {
    fetchDataAPI();
  }, []);

  useEffect(() => {
    if (refreshList) fetchDataAPI();
  }, [refreshList]);

  useEffect(() => {
    fetchDataAPI();
  }, [filterValues]);

  useEffect(() => {
    setTimeout(() => {
      SetCreateResponse(false);
    }, 3000);
  }, [createResponse]);

  return (
    <div className="main container">
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
            <input
              type="text"
              className="form-control"
              id="ExpenseName"
              aria-describedby="ExpenseName"
              placeholder="Expense Name"
              required
            />
          </div>
          <div class="form-group mt-3">
            <label for="Price">
              Price <span className="redStar">*</span>
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
            <label>
              Date <span className="redStar">*</span>
            </label>
            <input type="date" id="date" className="form-control" required />
          </div>
          <div class="form-group mt-3">
            <div class="form-check">
              <input
                id="checkbox"
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
        <div className="categoryExpense">
          <h5 className="mt-5">Category wise money spent</h5>
          <ul class="list-group mb-3">
            {Object.entries(categoryExpense()).map(([key, value]) => {
              return (
                <>
                  <li class="list-group-item">
                    <span
                      class={`${categoriesIcon[key]} ${iconColors[key]} icon`}
                    ></span>
                    <span>{key}</span>
                    <span class={`badge bg-dark rounded-pill`}>{value} Rs</span>
                  </li>
                </>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="details col-12 col-xl-6 mt-4">
        <div className="headers col-10">
          <button type="button" class="btn  btn-dark  total">
            Total
            <span class="badge bg-secondary ">{totalExpense()} Rs</span>
          </button>
        </div>
        <hr />

        <div className="headers col-10">
          <div class="dropdown">
            <button
              class="btn btn-warning dropdown-toggle"
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
                  setFilterValues({ date: null, category: "Rent" })
                }
              >
                <p class="dropdown-item">Category : Rent</p>
              </li>
              <li
                onClick={() =>
                  setFilterValues({ date: null, category: "Travel" })
                }
              >
                <p class="dropdown-item">Category : Travel</p>
              </li>
              <li
                onClick={() =>
                  setFilterValues({ date: null, category: "Food and dining" })
                }
              >
                <p class="dropdown-item">Category : Food and dining</p>
              </li>
            </ul>
          </div>
          <button
            type="button"
            class="btn btn-primary mb-2 mt-2"
            data-bs-toggle="modal"
            data-bs-target={`#filterModal`}
          >
            <i class="bi bi-funnel"></i> Filter
          </button>
          <button
            type="button"
            class="btn btn-danger mb-2"
            onClick={() => {
              setFilterValues(null);
            }}
            disabled={!filterValues}
          >
            Remove Filters
          </button>
          <ExportCSV data={expenses} canDisable={!(expenses.length > 0)} />
        </div>
        <hr />
        {spinner2 ? (
          <div class="spinner-border" role="status">
            <span class="sr-only"></span>
          </div>
        ) : expenses.length > 0 ? (
          reverseArr(expenses).map((expense, index) => {
            return (
              //       <button
              //         type="button"
              //         class="edit btn btn-primary"
              //         data-bs-toggle="modal"
              //         data-bs-target={`#A${expense.id}Edit`}
              //       >
              //         Edit
              //       </button>
              //   <Modal
              //     id={`A${expense.id}Edit`}
              //     name={expense.name}
              //     type="Edit"
              //   />
              // </div>
              <Card
                expense={expense}
                setRefreshList={(value) => setRefreshList(value)}
                index={index}
              />
            );
          })
        ) : (
          <div class="alert alert-danger col-10" role="alert">
            No Data Available.{" "}
            <strong>Try adding data or changing filter</strong>
          </div>
        )}
      </div>
      <Modal
        id="filterModal"
        type="Filter"
        sendFilterValues={(value) => getFilterValues(value)}
      />
    </div>
  );
}

export default AddExpense;
