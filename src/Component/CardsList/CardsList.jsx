/* eslint-disable react/prop-types */
import { useRef, useState, useContext, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import Card from '../Card/Card';
import styles from './CardsList.module.css';
import { trelloCtx } from '../Main/Main';

const CardsList = (props) => {
    const { state, dispatch } = useContext(trelloCtx);
    const [addCardFormVisible, setAddCardFormVisible] = useState(false);
    const inputValue = useRef();

    // Enable drop functionality
    const [, dropRef] = useDrop(() => ({
        accept: "CARD",
        drop: (item) => {
            if (item.fromList !== props.typeOfList) {
                dispatch({
                    type: "MOVE_ITEM",
                    payload: {
                        fromList: item.fromList,
                        toList: props.typeOfList,
                        item: item.taskContent,
                    },
                });
            }
        },
    }));

    const addToCart = () => {
        if (inputValue.current.value.trim() === "") {
            setAddCardFormVisible(false);
        } else {
            dispatch({
                type: "ADD_ITEM",
                payload: { typeoflist: props.typeOfList, val: inputValue.current.value.trim() },
            });
            inputValue.current.value = "";
            setAddCardFormVisible(false);
        }
    };

    const AddCard = () => {
        setAddCardFormVisible(true);
    };

    const onCancelForm = () => {
        setAddCardFormVisible(false);
    };

    useEffect(() => {
        if (addCardFormVisible) {
            inputValue.current.focus();
        }
    }, [addCardFormVisible]);

    const addCardForm = () => {
        if (addCardFormVisible) {
            return (
                <>
                    <input ref={inputValue} placeholder="Add Text" className={styles.ip} type="text" />
                    <div className={styles.btns}>
                        <button onClick={addToCart} className={styles.addbtn}>Add Card</button>
                        <button className={styles.cancelbtn} onClick={onCancelForm}>Cancel</button>
                    </div>
                </>
            );
        } else {
            return <button className={styles.addcardbtn} onClick={AddCard}>+ Add Another Card</button>;
        }
    };

    return (
        <div ref={dropRef} className={styles.container}>
            <h2>{props.heading}</h2>
            {state[props.typeOfList].map((ele, idx) => (
                <Card key={idx} index={idx} typeoflist={props.typeOfList} content={ele} />
            ))}
            {addCardForm()}
        </div>
    );
};

export default CardsList;
