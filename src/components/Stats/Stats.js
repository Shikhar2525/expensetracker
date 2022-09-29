import React from "react";
import { circleColor, categories } from "../../constants.ts";
import { useEffect, useState } from "react";
import "../Stats/Stats.css";


function Stats() {
  const [expenses, setExpenses] = useState([]);
  const fetchDataAPI = () => {
    let allExpenes = [];
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
      });
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
                {Math.round(calcPercent(expense.value) * 10) / 10 || '0'}%
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
