// it is just a wrapper
export default function EditorPanel({ children, className }) {
    return (
        <div className={`editor-panel col-12 col-md-6 mb-5 ${className || ""}`}>
            {children}
        </div>
    )
}