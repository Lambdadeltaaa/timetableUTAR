import styles from './TextButton.module.css';

export default function TextButton({ text, performAction, className }) {
    return (
        <button className={`btn main-body-text fs-5 fw-semibold ${styles.textButton} ${className || ""}`} onClick={performAction}>{text}</button>
    )
}