import React,{useState,useContext} from 'react';
import styles from "./Login.module.css";
import {AuthContext} from '../../Context/Authentication';
import { withRouter, Redirect,Link } from "react-router-dom";
import firebase from 'firebase';
import {firebaseApp} from '../../Firebase/config';

function Login({history}) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [isLogin,setLogin]=useState(false);

  //Function to Google Login 
  const googleLoginHandler=()=>{
    const base_provider=new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(base_provider).then(function(result){
      console.log("Success..Google Account Linked");
    }).catch(function(error){
      console.log(error);
      console.log("Error");
    })
  }
  //Function to handle Login 
  const handleLogin=(e)=>{
    e.preventDefault();
    // setLogin(true);
    firebaseApp
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        
        history.push('/');
      })
      .catch((err) => {
        alert('Something wrong with your email or Password. Try again!');
        
      });
  }
  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/" />;
  }
    return (
        <form  className={styles.loginCtr}>
          <p className={styles.heading}>Login</p>
          
          <div className={styles.group}>
            <label htmlFor="email">Email</label>
            <input required  name="email" type="text" onChange={(e)=>setEmail(e.target.value)} value={email}  placeholder="mail@example.com"></input>
          </div>
          <div className={styles.group}>
            <label htmlFor="password">Password</label>
            <input required name="password" type="password" onChange={(e)=>setPassword(e.target.value)} value={password}  placeholder="******"></input>
          </div>
          <div onClick={handleLogin} className={styles.group}>
            <button  type="submit">Login</button>
          </div>
          <div onClick={googleLoginHandler} className={styles.google}>
          <img  style={{marginTop:"7px", marginRight:"8px",width:"20px"}} alt="Google sign-in" 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" />
        
        Login with Google
        
      </div>
          <div className={styles.footer}>
            Don't Have An Account? 
            <Link className={styles.link} to="/signup">
              Sign Up
            </Link>
          </div>
        </form>
      );
}

export default withRouter(Login)

