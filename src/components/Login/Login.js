import React, {
   useEffect,
   useState,
   useReducer,
   useContext,
   useRef,
} from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../store/auth-context";
import Input from "../UI/Input/Input";

const emailReducer = (state, action) => {
   if (action.type === "USER_INPUT") {
      return { value: action.val, isValid: action.val.includes("@") };
   }
   if (action.type === "INPUT_BLUR") {
      return { value: state.value, isValid: state.value.includes("@") };
   }

   return { value: "", isValid: false };
};

const passwordReducer = (state, action) => {
   if (action.type === "USER_INPUT") {
      return { value: action.val, isValid: action.val.trim().length > 6 };
   }
   if (action.type === "INPUT_BLUR") {
      return { value: state.value, isValid: state.value.trim().length > 6 };
   }
   return { value: "", isValid: false };
};

const Login = (props) => {
   //  const [enteredEmail, setEnteredEmail] = useState("");
   //  const [emailIsValid, setEmailIsValid] = useState();
   //  const [enteredPassword, setEnteredPassword] = useState("");
   //  const [passwordIsValid, setPasswordIsValid] = useState();
   const [formIsValid, setFormIsValid] = useState(false);

   const [emailState, dispatchEmail] = useReducer(emailReducer, {
      value: "",
      isValid: null,
   });

   const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
      value: "",
      isValid: null,
   });

   useEffect(() => {
      console.log("EFFECT RUNNING");

      return () => {
         console.log("CLEANING UP");
      };
   }, []);

   const { isValid: emailIsValid } = emailState;
   const { isValid: passwordIsValid } = passwordState;

   useEffect(() => {
      const identifier = setTimeout(() => {
         console.log("Check validity");
         setFormIsValid(emailIsValid && passwordIsValid);
      }, 500);

      return () => {
         console.log("Clean Up");
         clearTimeout(identifier);
      };
   }, [emailIsValid, passwordIsValid]);

   const authCtx = useContext(AuthContext);

   const emailChangeHandler = (event) => {
      dispatchEmail({ type: "USER_INPUT", val: event.target.value });

      setFormIsValid(event.target.value.includes("@") && passwordState.isValid);
   };

   const passwordChangeHandler = (event) => {
      dispatchPassword({ type: "USER_INPUT", val: event.target.value });

      setFormIsValid(
         event.target.value.trim().length > 6 && emailState.isValid
      );
   };

   const validateEmailHandler = () => {
      dispatchEmail({ type: "INPUT_BLUR" });
   };

   const validatePasswordHandler = () => {
      dispatchPassword({ type: "INPUT_BLUR" });
   };

   const submitHandler = (event) => {
      event.preventDefault();
      if (formIsValid) {
         authCtx.onLogin(emailState.value, passwordState.value);
      } else if (!emailIsValid) {
         emailRef.current.focus();
      } else {
         passwordRef.current.focus();
      }
   };

   const emailRef = useRef();
   const passwordRef = useRef();

   return (
      <Card className={classes.login}>
         <form onSubmit={submitHandler}>
            <Input
               ref={emailRef}
               label="E-Mail"
               isValid={emailIsValid}
               type="email"
               id="email"
               value={emailState.value}
               onChange={emailChangeHandler}
               onBlur={validateEmailHandler}
            />
            <Input
               ref={passwordRef}
               label="Password"
               isValid={passwordIsValid}
               type="password"
               id="password"
               value={passwordState.value}
               onChange={passwordChangeHandler}
               onBlur={validatePasswordHandler}
            />
            <div className={classes.actions}>
               <Button type="submit" className={classes.btn}>
                  Login
               </Button>
            </div>
         </form>
      </Card>
   );
};

export default Login;
