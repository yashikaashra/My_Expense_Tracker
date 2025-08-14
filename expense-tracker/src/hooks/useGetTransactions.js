import { useEffect, useState } from "react";
import {
  query,
  collection,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase-config";
import { useGetUserInfo } from "./useGetUserInfo";

export const useGetTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [transactionsTotal, setTransactionsTotal] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
  });

  const { userID } = useGetUserInfo();

  useEffect(() => {
    const transactionCollectionRef = collection(db, "transactions");

    const queryTransactions = query(
      transactionCollectionRef,
      where("userID", "==", userID),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(queryTransactions, (snapshot) => {
      let docs = [];
      let income = 0;
      let expenses = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        const id = doc.id;

        docs.push({ ...data, id });

        if (data.transactionType === "income") {
          income += Number(data.transactionAmount);
        } else {
          expenses += Number(data.transactionAmount);
        }
      });

      setTransactions(docs);
      setTransactionsTotal({
        balance: income - expenses,
        income,
        expenses,
      });
    });

    return () => unsubscribe();
  }, [userID]);

  return { transactions, transactionsTotal };
};