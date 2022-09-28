import React from "react";
import "./AddExpense.css";
import { v4 as uuid } from "uuid";
import { useState, useEffect } from "react";
function AddExpense() {
  const categories = [
    "Rent",
    "Transportation",
    "Groceries",
    "Home and utilities",
    "Insurance",
    "Bills & emis",
    "Education",
    "Health and personal care",
    "Shopping and entertainment",
    "Food and dining",
    "Travel",
    "Memberships",
  ];

  const circleColor = {
    Rent: "red",
    Transportation: "yellow",
    Groceries: "purpule",
    "Home and utilities": "green",
    Insurance: "violet",
    "Bills & emis": "orange",
    Education: "black",
    "Health and personal care": "lime",
    "Shopping and entertainment": "naviblue",
    "Food and dining": "grey",
    Travel: "brown",
    Memberships: "indian",
  };

  const [createResponse, SetCreateResponse] = useState();

  const [expenses, setExpenses] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [spinner2, setSpinner2] = useState(false);
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

  const fetchDataAPI = () => {
    let allExpenes = [];
    setSpinner2(true)
    fetch(
      "https://expensetracker-3cb3c-default-rtdb.firebaseio.com/expenses.json"
    )
      .then((res) => res.json())
      .then((json) => {
        for (let key in json) {
          allExpenes.push(json[key]);
        }
        allExpenes.forEach((value, index) => {
          allExpenes[index].date = new Date(allExpenes[index].date);
        });
        setExpenses(allExpenes);
        setSpinner2(false)
      });
  };

  const addExpenseAPI = async (expense) => {
    const { id, name, price, category, dateString, date } = expense;
    setSpinner(true);
    const response = await fetch(
      "https://expensetracker-3cb3c-default-rtdb.firebaseio.com/expenses.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          price,
          category,
          dateString,
          date,
        }),
      }
    ).then((data) => {
      setSpinner(false);
      SetCreateResponse(data);
      fetchDataAPI();
    });
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
      date: newDate,
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

  useEffect(() => {
    fetchDataAPI();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      SetCreateResponse("");
    }, 3000);
  }, [createResponse]);

  return (
    <div className="main container">
      <div className="formContainer col-6">
        {createResponse?.status === 200 ? (
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
            <label for="ExpenseName">
              Expense Name <span className="redStar">*</span>
            </label>
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
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    <span class={`dot ${circleColor[key]}`}></span>
                    {key}
                    <span class="badge bg-dark rounded-pill">{value} Rs</span>
                  </li>
                </>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="details col-12 col-xl-6 mt-5">
        <div className="headers col-10">
          <button type="button" class="btn btn-dark mb-2 col-5 total">
            Total Expense{" "}
            <span class="badge bg-secondary">{totalExpense()} Rs</span>
          </button>
          <button type="button" class="btn btn-dark mb-2 col-5 col-sm-12 total">
            This Month{" "}
            <span class="badge bg-secondary">{totalExpenseThisMonth()} Rs</span>
          </button>
        </div>
        {spinner2 ? (
          <div class="spinner-border" role="status">
            <span class="sr-only"></span>
          </div>
        ) : (
          expenses.map((expense) => {
            return (
              <div className={`card  mb-3 col-10`}>
                <div
                  class={`card-header fontWhite ${
                    circleColor[expense.category]
                  }`}
                >
                  {expense.name}
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
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default AddExpense;
