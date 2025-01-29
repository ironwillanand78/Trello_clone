import { createContext, useReducer } from 'react';
import CardsList from '../CardsList/CardsList';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styles from './Main.module.css';

// Create the context for the Trello-like app
export const trelloCtx = createContext();

const Main = () => {
    const initialData = {
        todo: [],
        inprogress: [],
        completed: [],
    };

    const reducer = (state, { type, payload }) => {
        switch (type) {
            case "ADD_ITEM": {
                const { typeoflist, val } = payload;
                return {
                    ...state,
                    [typeoflist]: [...state[typeoflist], val],
                };
            }
            case "EDIT_ITEM": {
                const { typeOfList, oldVal, newVal } = payload;
                return {
                    ...state,
                    [typeOfList]: state[typeOfList].map((item) =>
                        item === oldVal ? newVal : item
                    ),
                };
            }
            case "DELETE_ITEM": {
                const { typeOfList, val } = payload;
                return {
                    ...state,
                    [typeOfList]: state[typeOfList].filter((item) => item !== val),
                };
            }
            case "MOVE_ITEM": {
                const { fromList, toList, item } = payload;
                return {
                    ...state,
                    [fromList]: state[fromList].filter((task) => task !== item),
                    [toList]: [...state[toList], item],
                };
            }
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(reducer, initialData);

    return (
        <trelloCtx.Provider value={{ state, dispatch }}>
            <DndProvider backend={HTML5Backend}>
                <div className={styles.main}>
                    <h2 className={styles.head}>Trello Clone</h2>
                    <div className={styles.cardListContainer}>
                        <CardsList typeOfList="todo" heading="To Do" />
                        <CardsList typeOfList="inprogress" heading="In Progress" />
                        <CardsList typeOfList="completed" heading="Completed" />
                    </div>
                </div>
            </DndProvider>
        </trelloCtx.Provider>
    );
};

export default Main;
