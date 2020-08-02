import React, { useState, useEffect,useContext } from "react";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import { getBoards } from "../../Funct_Reuse/Functions";
import Loader from "../Modals/Loader/Loader";
import {AuthContext} from '../../Context/Authentication';

function Home() {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [boardData, setBoardData] = useState([]);

  useEffect(() => {
    //Function is defined in Function.js
    getBoards(currentUser.email)
      .then((boardData) => {
        setBoardData(boardData);
        setLoading(false);
      })
      .catch(() => {
        setBoardData([]);
      });
  }, [currentUser]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <p className={styles.para}>Boards</p>
          {boardData.length === 0 && (
            <p className={styles.emptyMsg}>
              You haven't created any boards.Kindly click on the 'Create Board'
              button in the navigation bar to create a board.
            </p>
          )}

          <div className={styles.ctrBoard}>
            {boardData.map((x) => (
              <Link
                className={styles.btnBoard}
                to={{
                  pathname: `/board/${x.id}`,
                  state: {
                    id: x.id,
                    boardName: x.boardName,
                    teamMembers: x.teamMembers,
                  },
                }}
                key={x.id}
              >
                {x.boardName}
                <div className={styles.txt}></div>
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}
export default Home;
