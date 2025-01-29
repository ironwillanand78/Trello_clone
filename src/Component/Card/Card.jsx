import { trelloCtx } from '../Main/Main';
import styles from './Card.module.css';
import { useDrag } from 'react-dnd';
import { useContext, useState } from 'react';

const Card = (props) => {
    const [properties, dragRef] = useDrag(() => ({
        type: "CARD",
        item: () => ({
            taskContent: editedContent.trim(),
            index: props.index,
            fromList: props.typeoflist,
        }),
        collect: (monitor) => ({
            opacity: monitor.isDragging() ? 0.5 : 1,
        }),
    }));

    const { dispatch } = useContext(trelloCtx);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(props.content);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        if (editedContent.trim() !== "") {
            dispatch({
                type: "EDIT_ITEM",
                payload: {
                    typeOfList: props.typeoflist,
                    oldVal: props.content,
                    newVal: editedContent.trim(),
                },
            });
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditedContent(props.content);
        setIsEditing(false);
    };

    const handleDelete = () => {
        dispatch({
            type: "DELETE_ITEM",
            payload: {
                typeOfList: props.typeoflist,
                val: props.content,
            },
        });
    };

    return (
        <div ref={dragRef} className={styles.card} style={{ opacity: properties.opacity }}>
            {isEditing ? (
                <div className={styles.editContainer}>
                    <input
                        type="text"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className={styles.editInput}
                    />
                    <div className={styles.btns}>
                        <button onClick={handleSave} className={styles.save}>
                            Save
                        </button>
                        <button className={styles.cancel} onClick={handleCancel}>
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <span>{props.content}</span>
                    <div className={styles.btns}>
                        <button onClick={handleEdit} className={styles.edit}>
                            <img src="/edit.png" alt="Edit this card" />
                        </button>
                        <button onClick={handleDelete} className={styles.dlt}>
                            <img src="/delete.png" alt="Delete this card" />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Card;
