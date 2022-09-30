import React from "react";
import { circleColor, categories } from "../../constants.ts";
import { useEffect, useState } from "react";
import "../Stats/Stats.css";
import ExpenseService from "../../services/expense.service";
import { useAuth0 } from "@auth0/auth0-react";

function Stats() {
  const [expenses, setExpenses] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const { user } = useAuth0();

  const fetchDataAPI = async () => {
    setSpinner(true);
    let allExpenses = [];
    const data = await ExpenseService.getAllExpenses(user);
    const json = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    for (let key in json) {
      allExpenses.push(json[key]);
    }
    allExpenses.forEach((value, index) => {
      allExpenses[index].date = new Date(allExpenses[index].date);
    });
    setExpenses(allExpenses);
    setSpinner(false);
  };

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
    let allCategoryTotal = [];
    categories.forEach((category) => {
      let temp = {
        name: category,
        value: getCategoryTotal(category),
      };
      allCategoryTotal.push(temp);
    });
    return allCategoryTotal;
  };

  const calcPercent = (value) => {
    let total = 0;
    categoryExpense().forEach((expense) => {
      total = total + expense.value;
    });
    return (value * 100) / total;
  };

  useEffect(() => {
    fetchDataAPI();
  }, []);

  return (
    <div className="container main">
      <div className="left mb-5 col-6">
        <div className="head">
          <h2>Statistics</h2>
          {spinner ? (
            <div class="spinner-border mt-1" role="status">
              <span class="sr-only"></span>
            </div>
          ) : (
            ""
          )}
        </div>

        {categoryExpense().map((expense) => {
          return (
            <>
              <div className="progress mt-3">
                <div
                  className={`progress-bar ${circleColor[expense.name]}`}
                  role="progressbar"
                  style={{ width: `${calcPercent(expense.value)}%` }}
                ></div>
              </div>
              <label>
                {expense.name}{" "}
                {Math.round(calcPercent(expense.value) * 10) / 10 || "0"}%
              </label>
            </>
          );
        })}
      </div>
      <div className="right  col-6"></div>
    </div>
  );
}

export default Stats;
