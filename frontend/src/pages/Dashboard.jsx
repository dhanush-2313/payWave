import { useEffect, useState } from "react";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  if (token) {
    const [balance, setBalance] = useState(0);
    useEffect(() => {
      axios
        .get("https://paywave-mjsr.onrender.com/api/v1/account/balance", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((response) => {
          setBalance(response.data.balance);
        })
        .catch((error) => {
          console.error("Error fetching balance:", error);
          setBalance();
        });
    }, []);
    return (
      <>
        <Appbar />
        <div className="m-8">
          <Balance value={balance} />
          <Users />
        </div>
      </>
    );
  } else {
    {
      setTimeout(() => navigate("/signin"), 1000);
    }
    return (
      <>
        <h1>Login/Signup first</h1>
        <h2>Redirecting you to signin page...</h2>
      </>
    );
  }
}
