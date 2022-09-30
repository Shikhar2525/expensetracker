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

function AddExpense() {
  const [createResponse, SetCreateResponse] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [spinner2, setSpinner2] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const [filterValues, setFilterValues] = useState();

  const { isAuthenticated, isLoading } = useAuth0();

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

    const data = await ExpenseService.getAllExpenses();

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
    let filteredValue = [];
    if (filterValues) {
      sortedAsc.forEach((value) => {
        if (value.category === filterValues) {
          filteredValue.push(value);
        }
      });
    }
    setExpenses(filterValues ? filteredValue : sortedAsc);
    setSpinner2(false);
  };

  const addExpenseAPI = async (expense) => {
    setSpinner(true);
    const data = await ExpenseService.addExpense(expense);
    setSpinner(false);
    SetCreateResponse(true);
    fetchDataAPI();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById("ExpenseName").value;
    const price = document.getElementById("Price").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;
    let newDate = new Date(date);
    let newExpense = {
      id: uuid(),
      name: name,
      price: price,
      category: category,
      dateString: newDate.toDateString(),
      date: date,
      createdDate: new Date(),
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

  const totalExpenseThisMonth = () => {
    const currentDate = new Date();
    let total = 0;
    expenses.forEach((e) => {
      if (currentDate.getMonth() === e.date.getMonth())
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

  const getFilterValues = (category) => {
    setFilterValues(category);
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
      <div className="details col-12 col-xl-6 mt-5">
        <div className="headers col-10">
          <button type="button" class="btn btn-dark mb-2  total">
            Total
            <span class="badge bg-secondary ">{totalExpense()} Rs</span>
          </button>
          <button type="button" class="btn btn-dark mb-2  col-sm-12 total">
            This Month
            <span class="badge bg-secondary">{totalExpenseThisMonth()} Rs</span>
          </button>
        </div>
        <div className="subHeaders col-10">
          <button
            type="button"
            class="btn btn-primary mb-2  filter col-12"
            data-bs-toggle="modal"
            data-bs-target={`#filterModal`}
          >
            <i class="bi bi-funnel"></i> Filter
          </button>
        </div>

        {spinner2 ? (
          <div class="spinner-border" role="status">
            <span class="sr-only"></span>
          </div>
        ) : (
          reverseArr(expenses).map((expense, index) => {
            return (
              <div className={`card  mb-3 col-10`}>
                <div
                  class={`card-header fontWhite ${
                    circleColor[expense.category]
                  }`}
                >
                  {expense.name}
                  {index === 0 && <span class="badge bg-dark new">New</span>}
                </div>
                <div class="card-body">
                  <p class="card-text">
                    <b>Category : </b>
                    {expense.category}
                  </p>
                  <p class="card-text">
                    <b>Price : </b>
                    {priceWithComma(expense.price)} Rs
                  </p>
                  <p class="card-text">
                    <b>Date :</b> {expense.dateString}
                  </p>
                </div>

                <div className="buttons ">
                  <div className="iconDiv">
                    <span
                      class={`${categoriesIcon[expense.category]} ${
                        iconColors[expense.category]
                      } icon`}
                    ></span>
                  </div>
                  <div>
                    <button
                      type="button"
                      class="edit btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target={`#A${expense.id}Edit`}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      class="delete btn btn-danger"
                      data-bs-toggle="modal"
                      data-bs-target={`#A${expense.id}Delete`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <Modal
                  id={`A${expense.id}Delete`}
                  idToDelete={expense.id}
                  name={expense.name}
                  type="Delete"
                  refreshList={(value) => setRefreshList(value)}
                />
                <Modal
                  id={`A${expense.id}Edit`}
                  name={expense.name}
                  type="Edit"
                />
              </div>
            );
          })
        )}
      </div>
      <Modal
        id="filterModal"
        type="Filter"
        sendFilterValues={(category) => getFilterValues(category)}
      />
      
    </div>
  );
}

export default AddExpense;
