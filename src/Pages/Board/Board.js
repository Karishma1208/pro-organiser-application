import React, { useState,useEffect } from 'react';
import styles from './Board.module.css';
import {addColumn,getBoard,getColumns,deleteBoard,deleteColumn,deepCopy,updateColumn} from '../../Funct_Reuse/Functions'; 
import Loader from '../Modals/Loader/Loader';
import * as shortid from 'shortid';
import CreateColumnModal from '../Modals/CreateColumnModal/CreateColumnModal'
import CreateCard from '../Modals/CreateCard/CreateCard';
import IndividualCard from '../Modals/IndividualCard/IndividualCard';


export default function Board (props){
    
    const [loading, setLoading] = useState(true);
    const [boardDetails,setBoardDetails]=useState([]);
    const [columns, setColumns] = useState([]);
    const [columnModal,setColumnModal]=useState(false);
    const [cardModal,setCardModal]=useState(false);
    const [selectedColumn, setSelectedColumn] = useState(null);
    const [editCard,setEditCard]=useState(null);
    const [isCardAdd,setCardAdd]=useState(true);
   
    useEffect(() => {
        (async function () {
          
          const boardId = await getBoard(props.match.params.boardid);
          setBoardDetails(boardId);
          await getAllColumns(boardId.id, setColumns);
          setLoading(false);
        })();
      }, [props.match.params.boardid]);

    //Function to close Modals
    const closeColumnModal=()=>{
        setColumnModal(false);
        
    }
    const closeCardModal=()=>{
        setCardModal(false);
    }
    //Function to Add column in Firestore
    const handleAddCloumn=(columnName) =>{
        const newColumn = {
          boardId: boardDetails.id,
          name: columnName,
          cards: [],
          created: Date.now(),
        };
        addColumn(newColumn)
        .then((output)=>{
          newColumn['id'] = output;
          setColumns([...columns, newColumn]);
          setColumnModal(false);
        })
        
      }
      function openAddCard(selectedColumn) {
        
        setCardModal(true);
        setSelectedColumn(selectedColumn);
        setEditCard(null);
        setCardAdd(true);
        
      }
     //Function to Add Card in Firestore
    async function handleAddCard(card){
      try
      {
        card['id'] = shortid();
        const cards = [...selectedColumn.cards, card];
        const columnCopy = deepCopy(selectedColumn);
        columnCopy.cards=cards;
        const addColumnStatus = await updateColumn(columnCopy.id, columnCopy);
        if(addColumnStatus){
          afterUpdateColumn(columns,selectedColumn,columnCopy,setColumns)
          setCardModal(false);
          
        }
      }
      catch(error)
      {
        alert(error);
      }

    }  
     //Function to delete Board from Firestore
     async function deleteBoardHandler() {
        if (window.confirm('Are you sure you want to delete the board?'))
         {
          setLoading(true);
          const status = await deleteBoard(boardDetails.id);
          if(status){
              props.history.push('/');
          }
        }
      } 
    //Function to delete column from Firestore
    async function deleteColumnHandler(column){
      const newColumnAfterDelete=columns
      .filter(x=>x.id!==column.id)
      .sort((a,b)=>a.created-b.created);
      deleteColumn(column.id)
      .then(()=>{
        setColumns(newColumnAfterDelete);
      })
      .catch(error=>alert(error))
    }
    //Function to perform Edit Card
    function cardEdit(card,column){
      setSelectedColumn(column);
      setCardModal(true);
      setEditCard(card);
      setCardAdd(false);
    }
    //Function to card Edit
    async function handleCardEdit(x){
      try {
        const card = { id: editCard.id, ...x };
        const uColumn = deepCopy(selectedColumn);
        const cards = selectedColumn.cards.filter((c) => c.id !== editCard.id);
        const newCards = [...cards, card];
        uColumn.cards = newCards;
        const val = await updateColumn(selectedColumn.id, uColumn);
        if (val) {
          afterUpdateColumn(columns, selectedColumn, uColumn, setColumns);
          setCardModal(false);
          setSelectedColumn(null);
          setEditCard(null);
          setCardAdd(true);
        }
      } catch (error) {
        alert(error);
      }

    }
    //Function to Card Handle Archive 
    async function cardArchive(card, column) {
      try {
        card.isArchive = true;
        const newCards = column.cards.filter((c) => c.id !== card.id);
        const upColumn = deepCopy(column);
        upColumn.cards = [...newCards, card];
        const val = await updateColumn(column.id, upColumn);
        if (val) {
          afterUpdateColumn(columns, column, upColumn, setColumns);
        }
      } catch (error) {
        alert(error);
      }
    }
    //Function for Drag and Drop of Cards
    async function dragFunc(ev,newColumn){
      try {
        const card = JSON.parse(ev.dataTransfer.getData('card'));
        const oldColumn = JSON.parse(ev.dataTransfer.getData('columnFrom'));
        if (oldColumn.id === newColumn.id) {
          return;
        }
        oldColumn.cards = oldColumn.cards.filter((c) => c.id !== card.id);
        const val = await updateColumn(oldColumn.id, oldColumn);
        newColumn.cards = [...newColumn.cards, card];
        const val1 = await updateColumn(newColumn.id, newColumn);
        if (val && val1) {
          const newCols = columns.filter(
            (col) => col.id !== oldColumn.id && col.id !== newColumn.id
          );
          const sortedCols = [...newCols, oldColumn, newColumn].sort(
            (a, b) => a.created - b.created
          );
          setColumns(sortedCols);
        }
      } catch (error) {
        alert(error)
      }
    }
    return(
        <>
        {loading ? (
        <Loader />
            ) :
        (<>
        { (columnModal)&&<CreateColumnModal addColumn={handleAddCloumn} closeColumnModal={closeColumnModal} />}
          { (cardModal)&&<CreateCard card={editCard} isAdd={isCardAdd} handleEdit={handleCardEdit} addCard={handleAddCard} teamMembers={props.location.state.teamMembers}  closeCardModal={closeCardModal}/>}
            <div className={styles.container}>
              <div className={styles.containerHeader}>
                <h1 className={styles.headingtxt}>{props.location.state.boardName}</h1>
                <button onClick={deleteBoardHandler}  className={styles.deleteBoard}>Delete Board</button>
              </div>            
             <div className={styles.ui}>
                <div className={styles.columns}>
                {columns.map(x=>(
                <div onDrop={(e)=>dragFunc(e,x)} onDragOver={(e)=>e.preventDefault()} key={x.name} className={styles.column}>
                <header>
                {x.name}
                <div className={styles.trash}>
                <i onClick={()=>deleteColumnHandler(x)} id="trash" className="fa fa-trash fa-lg" aria-hidden="true"></i>
                </div>
                </header>
                
                 <ul>
                  {x.cards.map(y=>(
                  !y.isArchive && (  
                  <IndividualCard
                  
                  card={y}
                  board={props.location.state.boardName}
                  key={y.id}
                  column={x}
                  handleEdit={()=>cardEdit(y,x)}
                  handleArchive={() =>cardArchive(y, x)}
                  />)
                   )) }    
                  </ul>   
                 <footer><button onClick={()=>openAddCard(x)} className={styles.add}>Add a Card</button></footer>
                </div>
                
            ))}
            
                 <button onClick={()=>setColumnModal(true)}  className={styles.addButton}>Add a column</button>
                 </div>   
            </div>
        </div>
        
        </>)
}  
        </>
    )
}


//Function to get All Columns
async function getAllColumns(id, setColumns) {
    const resultColumns = await getColumns(id);
    setColumns(resultColumns);
  }

//Function to have Updated Column
function afterUpdateColumn(columns, selectedColumn, upColumn, setColumns) {
  const nullColumns = columns.filter((x) =>x.id !== selectedColumn.id);
  const newColumnsAfterCardAdd = [...nullColumns, upColumn];
  newColumnsAfterCardAdd.sort((a, b) => a.created - b.created);
  console.log(newColumnsAfterCardAdd);
  setColumns(newColumnsAfterCardAdd);
}  