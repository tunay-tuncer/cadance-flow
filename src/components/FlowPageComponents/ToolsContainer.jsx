import styles from "../../styles/Project.module.css";
import { useAuth0 } from "@auth0/auth0-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

//REACT ICONS
import { MdOutlineInsertComment } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { ImFolderDownload } from "react-icons/im";
import { BsFillShieldLockFill } from "react-icons/bs";

const ToolsContainer = ({ project, isCommenting, setIsCommenting,
    deleteAllComments, currentImage, setCurrentImage, getPhaseName, canUserComment, canDownloadAsset }) => {

    const { isAuthenticated } = useAuth0();



    const downloadSingleImage = async (imageUrl, fileName) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = fileName || 'cadance-flow-export.jpg';

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("İndirme hatası:", error);
        }
    };

    const handleDownloadAll = async () => {
        const assets = project.project_assets;
        if (!assets || assets.length === 0) return;

        const zip = new JSZip();
        const folder = zip.folder(`${project.project_name || "project"}_assets`);

        try {

            const downloadPromises = assets.map(async (asset, index) => {
                const response = await fetch(asset.url);
                const blob = await response.blob();
                const fileName = `${String(index + 1).padStart(2, '0')}_${asset.file_name || 'image'}.jpg`;
                folder.file(fileName, blob);
            });

            await Promise.all(downloadPromises);

            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, `${project.project_name || "cadance-flow"}_all_assets.zip`);

        } catch (error) {
            console.error("Zip hatası:", error);
            alert("İndirme sırasında bir hata oluştu. Cloudinary CORS ayarlarını kontrol edin.");
        }
    };

    const toolsContainerItems = [
        ...(canUserComment ? [
            {
                id: "comment",
                icon: <MdOutlineInsertComment />,
                name: "Add Comment",
                onclick: () => setIsCommenting((prev) => !prev)
            },
            {
                id: "deleteComment",
                icon: <FaRegTrashAlt />,
                name: "Delete All Comments",
                onclick: () => deleteAllComments()
            }
        ] : []),
        {
            id: "download",
            icon: <FiDownload />,
            name: "Download Selected",
            onclick: () => downloadSingleImage(project.project_assets[currentImage].url, project.project_assets[currentImage].file_name)
        },
        {
            id: "downloadAll",
            icon: <ImFolderDownload />,
            name: "Download All",
            onclick: () => handleDownloadAll()
        },
    ];

    return (
        <div className={styles.rightContainer}>

            <div className={styles.toolsContainer}>
                {toolsContainerItems.map((item) => (
                    <div key={item.id} className={`
                            ${styles.toolsContainerItem} 
                            ${(isCommenting && item.id === "comment") ? styles.activeTool : ""} 
                            ${!isAuthenticated ? styles.disabledTool : ""}`} onClick={!isAuthenticated ? () => alert("Lütfen giriş yapın!") : item.onclick}>
                        {item.icon}
                        <p>{item.name}</p>
                        {!isAuthenticated && <BsFillShieldLockFill className={styles.lockIcon} />}
                    </div>
                ))}
            </div>

            <div className={styles.imageGallery}>
                {project.project_assets.map((asset, index) => (
                    <div key={asset.id} className={styles.imageContainer} onClick={() => setCurrentImage(index)}>

                        <img src={
                            asset.url.endsWith(".pdf")
                                ? asset.url.replace(".pdf", ".jpg")
                                : asset.url
                        }
                            alt={asset.file_name} />

                        <p className={styles.imageName}>{`${asset.file_name} - ${getPhaseName(asset)}`}</p>

                    </div>
                ))}
            </div>

        </div>

    )
}

export default ToolsContainer