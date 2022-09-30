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
  query
} from "firebase/firestore";
import { useAuth0 } from "@auth0/auth0-react";

const expenseRef = collection(db, "allexpenses");

class ExpenseService {
  addExpense = (newExpense) => {
    return addDoc(expenseRef, newExpense);
  };
  getAllExpenses = (user) => {
    const queryRef = query(expenseRef, where("user", "==", user.email));
    return getDocs(queryRef);
  };
  deleteExpense = (id) => {
    const expense = doc(db, "allexpenses", id);
    return deleteDoc(expense);
  };
}
export default new ExpenseService();
