import { useState } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { removeTodo, TodoColors, TodoItem, updateTodo } from "../todoSlice";
import styles from './TodoListItem.module.css'; 

export interface TodoListItemProps {
    todo: TodoItem;
}

const TodoListItem: React.FunctionComponent<TodoListItemProps> = (
    props: TodoListItemProps
) => {
    const [isEditing, setIsEditing] = useState(false);
    const [activeTodo, setActiveTodo] = useState<TodoItem>();

    const dispatch = useAppDispatch(); 

    const todoListItemClassName = props.todo.isComplete ? styles.todoItemComplete : styles.todoItem;

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    }

    const handleSaveClick = () => {
        setIsEditing(false);
        const message = activeTodo?.message ? activeTodo.message : props.todo.message;
        dispatch(updateTodo({
            ...props.todo,
            message: message,
            color: activeTodo?.color,
        }));
    }

    const handleRemoveClick = (id: string) => {
        setIsEditing(false);
        dispatch(removeTodo(id));
    }

    const handleInputChange = (todo: string) => {
        setActiveTodo({
            ...props.todo,
            color: activeTodo?.color,
            message: todo,
        });
    }

    const handleColorChange = (color: string) => {
        const message = activeTodo?.message ? activeTodo.message : props.todo.message;
        setActiveTodo({
            ...props.todo,
            message: message,
            color: color as TodoColors,
        });
    }

    const handleCheckboxClick = (isComplete: boolean) => {
        const message = activeTodo?.message ? activeTodo.message : props.todo.message;
        dispatch(updateTodo({
            ...props.todo,
            message: message,
            color: activeTodo?.color,
            isComplete: isComplete,
        }));
    }

    const setActions = () => {
        if (isEditing) {
            return(
                <div>
                    <select className={styles.todoItemActionSelect} onChange={(e) => handleColorChange(e.target.value)} value={activeTodo?.color}>
                        <option>Select Color</option>
                        {Object.keys(TodoColors).map((color, index) => {
                            return <option key={index}>{color}</option>
                        })}
                    </select>
                    <button className={styles.todoItemActionButton} onClick={() => handleRemoveClick(props.todo.id)}>
                        Remove
                    </button>
                    <button className={styles.todoItemActionButton} onClick={() => handleSaveClick()}>
                        Save
                    </button>
                </div>
            );
        } else {
            return(
                <div>
                    <button className={styles.todoItemActionButton} onClick={() => handleEditClick()}>
                        Edit
                    </button>
                </div>
            );
        }
    }

    const setMessage = (todo: TodoItem) => {
        if (isEditing) {
            return(
                <input onChange={(e) => handleInputChange(e.target.value)} value={activeTodo?.message ? activeTodo?.message : props.todo.message} />
            );
        } else {
            return(
                <p>{todo.message}</p>
            );
        }
    }

    return (
        <li key={props.todo.id} style={{color: props.todo.color}} className={todoListItemClassName}>
            <input className={styles.todoItemCheckbox} type="checkbox" onChange={(e) => handleCheckboxClick(e.target.checked)} />
            <div className={styles.todoItemMessage}>
                {setMessage(props.todo)}
            </div>
            <div className={styles.todoItemActions}>
                {setActions()}
            </div>
       </li>
    );
}

export default TodoListItem;
