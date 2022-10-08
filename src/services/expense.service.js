import { db } from "../firebase";
import {
  collection,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  where,
  query,
  Query,
} from "firebase/firestore";
import { useAuth0 } from "@auth0/auth0-react";

const expenseRef = collection(db, "allexpenses");
const monthlyLimitRef = collection(db, "monthlyLimit");
class ExpenseService {
  addExpense = (newExpense) => {
    return addDoc(expenseRef, newExpense);
  };

  getAllExpenses = (user, filterValues) => {
    const email = where("user", "==", user.email);
    const month = where("month", "==", new Date(filterValues?.date).getMonth());
    const year = where(
      "year",
      "==",
      new Date(filterValues?.date).getFullYear()
    );
    const thisYear = where("year", "==", new Date().getFullYear());
    const category = where("category", "==", filterValues?.category);
    let queryRef = query(
      expenseRef,
      email,
      filterValues?.date ? month : email,
      filterValues?.date ? year : email,
      filterValues?.category ? category : email,
      filterValues?.thisYear ? thisYear : email
    );

    return getDocs(queryRef);
  };

  updateExpense = (id, updateExpense) => {
    const expenseDoc = doc(db, "allexpenses", id);
    return updateDoc(expenseDoc, updateExpense);
  };

  deleteExpense = (id) => {
    const expense = doc(db, "allexpenses", id);
    return deleteDoc(expense);
  };

  getMonthlyLimit = async (user,id) => {
    const email = where("user", "==", user.email);
    let monthLimitRef = query(
      monthlyLimitRef,
      email
    );
    return getDocs(monthLimitRef);
  };

  updateLimit = (id, newLimitObject) => {
    const m = doc(db, "monthlyLimit", id);
    return updateDoc(m, newLimitObject);
  };

  
  addMonthlyLimit = (newObject) => {
    return addDoc(monthlyLimitRef, newObject);
  };
}
export default new ExpenseService();
