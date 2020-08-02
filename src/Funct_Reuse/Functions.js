import db from "../Firebase/config";

//Function to Add board details in Firestore
export const addBoard = async (board) => {
  try {
    await db.collection("boardDetails").add(board);
    return true;
  } catch (error) {
    return error;
  }
};

//Function to Add Column details in Firstore
export const addColumn = async (column) => {
  try {
    const columnRef = await db.collection("columnDetails").add(column);
    return columnRef.id;
  } catch (error) {
    return error;
  }
};
//---------------------------------------------------------------------------------------------------
//Function to get all getBoards Details from FireStore(Like API CALL)
export const getBoards = async (email) => {
  try {
    const snapshot = await db.collection("boardDetails")
    .where('user', '==', email)
    .get();
    const boards = snapshot.docs.map((x) =>({ ...x.data(), id: x.id }));
    return boards;
  } catch (error) {
    return [];
  }
};

//Function to single board using board id from FireStore(Like API CALL)
export const getBoard = async (id) => {
  try {
    const board = await db.collection("boardsDetails").doc(id).get();
    return { ...board.data(), id: board.id };
  } catch (error) {
    return error;
  }
};

//Function to get all columns details from FireStore(Like API CALL)
export const getColumns = async (boardId) => {
  try {
    const snapshot = await db
      .collection("columnDetails")
      .where("boardId", "==", boardId)
      .get();
    const boards = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
    return boards;
  } catch (error) {
    return [];
  }
};
//-------------------------------------------------------------------------------------------------------------------
//UPDATE FUNCTIONS
//
export const updateColumn = async (id, column) => {
  try 
  {
    await db.collection('columnDetails').doc(id).update(column);
    return true;
  } 
  catch (error)
  {
    return error;
  }
};
//-------------------------------------------------------------------------------------------------------------------
//Function to Delete Board from FireStore Database
export const deleteBoard = async (id) => {
  try {
    await db.collection("boardDetails").doc(id).delete();
    return true;
  } catch (error) {
    return error;
  }
};

//Function to delete Column from FireStore Database

export const deleteColumn=async(id)=>{
    try{
        await db.collection('columnDetails').doc(id).delete();
        return true;
    }
    catch(error){
        return error;

    }
}
//

export const deepCopy = obj => JSON.parse(JSON.stringify(obj));