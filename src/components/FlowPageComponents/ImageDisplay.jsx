import styles from "../../styles/Project.module.css"

const ImageDisplay = ({ children, containerRef, imgElRef, handleMouseMove, handleImageClick, imageUrl }) => {
    return (
        <div
            ref={containerRef}
            className={styles.imageDisplayContainer}
            onMouseMove={handleMouseMove}
        >
            <img
                ref={imgElRef}
                src={imageUrl}
                onClick={handleImageClick}
            />

            {children}
        </div>
    )
}

export default ImageDisplay