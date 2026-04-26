import styles from "../../styles/Project.module.css"

const PdfDisplay = ({ pdfUrl }) => {

    const hiddenToolbarUrl = `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`;

    return (
        <div className={styles.imageDisplayContainer}>
            <iframe
                src={hiddenToolbarUrl}
                title="PDF Viewer"
                width="100%"
                height="100%"
                style={{ border: "none", display: "block" }}
            />
        </div>
    );
};

export default PdfDisplay;