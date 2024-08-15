import { useState } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signin() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign in"} />
          <SubHeading label={"Enter your credentials to access your account"} />
          <InputBox
            placeholder="john123"
            label={"username"}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
          />
          <InputBox
            placeholder="123456"
            label={"Password"}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <div className="pt-4">
            <Button
              label={"Sign in"}
              onClick={async () => {
                if (!username || !password) {
                  setError("All fields are required.");
                  setInterval(() => setError(null), 3000);
                  return;
                }
                try {
                  const response = await axios.post(
                    "https://paywave-gaty.onrender.com/api/v1/user/signin",
                    {
                      username,
                      password,
                    }
                  );
                  localStorage.setItem("token", response.data.token);
                  navigate("/dashboard");
                } catch (error) {
                  if (error.response) {
                    setError(error.response.data.message);
                  } else {
                    setError("An unexpected error occurred.");
                  }
                }
              }}
            />
          </div>
          {error && <div className="text-red-500">{error}</div>}

          <BottomWarning
            label={"Don't have an account?"}
            buttonText={"Sign up"}
            to={"/signup"}
          />
        </div>
      </div>
    </div>
  );
}
