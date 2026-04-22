import { useEffect, useState, useRef } from "react";
import styles from "../../styles/Project.module.css"
import { useAuth0 } from "@auth0/auth0-react";
import { v4 as uuidv4 } from 'uuid';
import { useSupabase } from "../../hooks/useSupabase";
import FsImageContainer from "./FsImageContainer";


//REACT ICONS
import { MdOutlineInsertComment, MdCheck, MdClose, MdFullscreen, MdFullscreenExit } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { ImFolderDownload } from "react-icons/im";
import { RiUserLine } from "react-icons/ri";
import { BsFillShieldLockFill } from "react-icons/bs";

const MediaContainer = ({ project, isPublic }) => {
    const imageRef = useRef(null);
    const textAreaRef = useRef(null);
    const [currentImage, setCurrentImage] = useState(0);
    const [currentImageId, setCurrentImageId] = useState("");
    const [isFsOpen, setIsFsOpen] = useState(false);

    const [previewPos, setPreviewPos] = useState({ x: 0, y: 0 });
    const [isCommenting, setIsCommenting] = useState(false);
    const [openCommentIds, setOpenCommentIds] = useState([]);

    const { user, isAuthenticated } = useAuth0();
    const { getClient } = useSupabase();

    useEffect(() => {

        if (project.project_assets[currentImage]) {
            setCurrentImageId(project.project_assets[currentImage].id);
        }

    }, [currentImage, project.project_assets]);


    const toolsContainerItems = [
        { id: "comment", icon: <MdOutlineInsertComment />, name: "Add Comment", onclick: () => setIsCommenting((prev) => !prev) },
        { id: "deleteComment", icon: <FaRegTrashAlt />, name: "Delete All Comments", onclick: () => deleteAllComments() },
        { id: "download", icon: <FiDownload />, name: "Download Selected", onclick: () => downloadSingleImage(project.project_assets[currentImage].url, project.project_assets[currentImage].file_name) },
        { id: "downloadAll", icon: <ImFolderDownload />, name: "Download All", onclick: () => handleElse() },
    ]

    const [isDrafting, setIsDrafting] = useState(false);
    const [draftText, setDraftText] = useState("");

    const allComments = project.project_assets.flatMap(asset => asset.project_comments || []);
    const [comments, setComments] = useState(allComments);

    const getPhaseName = (asset) => {
        const phase = project.project_phases.find(p => p.id === asset.phase_id);
        return phase ? phase.name : "Unassigned";
    };

    const deleteAllComments = () => {
        const remainingComments = comments.filter(c => c.image !== currentImageId);
        setComments(remainingComments);

    };

    const handleElse = () => {
        return
    }

    const handleMouseMove = (e) => {
        if (!isCommenting || !imageRef.current || isDrafting) return;

        const rect = imageRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setPreviewPos({ x, y });
    };

    const handleImageClick = () => {
        if (!isCommenting || isDrafting) return;

        setIsDrafting(true);
    };

    const confirmComment = async (e) => {
        e.stopPropagation();
        if (!draftText.trim()) return;
        if (!isAuthenticated) return;

        try {
            const supabase = await getClient();

            const newComment = {
                id: uuidv4(),
                created_at: new Date().toISOString(),
                left: `${previewPos.x}`,
                top: `${previewPos.y}`,
                content: draftText,
                asset_id: currentImageId,
                profile_id: user.sub,
                is_resolved: false,
            };
            console.log(newComment)

            const { data, error } = await supabase
                .from('project_comments')
                .insert([newComment])
                .select('*, profiles(avatar_url, full_name)')
                .single();

            if (error) throw error;

            setComments((prev) => [...prev, data]);

            setDraftText("");
            setIsDrafting(false);
            setIsCommenting(false);
        }

        catch (err) {
            console.error("Yorum eklenirken hata oluştu:", err.message);
            alert("Yorum gönderilemedi!");
        }
    };

    const cancelComment = (e) => {
        e.stopPropagation()
        setIsDrafting(false);
        setDraftText("");

    };


    const toggleComment = (id) => {
        setOpenCommentIds((prev) =>
            prev.includes(id)
                ? prev.filter(favId => favId !== id) // Close it
                : [...prev, id]                      // Open it
        );
    };

    const deleteSelectedComment = async (id) => {
        const filteredComments = comments.filter(comment => comment.id !== id);
        setComments(filteredComments);
        try {
            const supabase = await getClient();
            const { error } = await supabase
                .from('project_comments')
                .delete()
                .eq("id", id)

            if (error) throw error;
        }
        catch (err) {
            console.error("Yorum silinirken hata oluştu:", err.message);
            alert("Yorum silinemedi!");

        }
    }

    const openFullscreen = () => {
        setIsFsOpen(true);

        document.body.style.overflow = 'hidden';
    }

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


    return (
        <div className={styles.mediaContainer}>

            <div className={styles.leftContainer}>
                <p className={styles.assetName}>{`${project.project_assets[currentImage].file_name} - ${getPhaseName(project.project_assets[currentImage])}`}</p>

                <div className={styles.imageDisplayContainer} onMouseMove={handleMouseMove}>

                    <img ref={imageRef} src={project.project_assets[currentImage].url} alt="" onClick={handleImageClick} />

                    <MdFullscreen className={styles.fullscreenIcon} onClick={() => openFullscreen()} />

                    {/* THE GHOST PIN: Only shows when in commenting mode */}
                    {isCommenting && (
                        <div
                            className={styles.draftWrapper}
                            style={{
                                position: 'absolute',
                                left: `${previewPos.x}%`,
                                top: `${previewPos.y}%`,
                                pointerEvents: isDrafting ? 'auto' : 'none',
                                flexDirection: previewPos.x > 65 ? "row-reverse" : "row",
                                transform: previewPos.x > 65 ? "translateX(-100%)" : "",
                            }}
                        >
                            {user?.picture ? <img className={styles.commentProfilePic} src={user.picture} alt={user?.name} referrerPolicy="no-referrer" /> : <RiUserLine className={styles.commentProfilePic} />}

                            {isDrafting && (
                                <div className={styles.commentInputPopUp}>
                                    <textarea
                                        ref={textAreaRef}
                                        autoFocus
                                        placeholder="Add comment..."
                                        value={draftText}
                                        onChange={(e) => {
                                            setDraftText(e.target.value);
                                            e.target.style.height = "inherit";
                                            e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
                                        }}
                                        className={styles.commentTextArea}
                                    />
                                    <div className={styles.inputActions}>
                                        <button onClick={(e) => confirmComment(e)}><MdCheck /></button>
                                        <button onClick={(e) => cancelComment(e)}><MdClose /></button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {isAuthenticated && comments.
                        filter((c) => c.asset_id === currentImageId)
                        .map((c) => {
                            const isOpen = openCommentIds.includes(c.id); // Check the array
                            const isRightEdge = parseFloat(c.left) > 75;

                            return (
                                <div
                                    key={c.id}
                                    className={styles.comment}
                                    style={{
                                        left: `${c.left}%`,
                                        top: `${c.top}%`,
                                        flexDirection: isRightEdge ? "row-reverse" : "row",
                                        zIndex: isOpen ? 90 : 10,
                                        pointerEvents: 'auto',
                                        transform: isRightEdge ? "translateX(-100%)" : "",
                                    }}
                                >
                                    {c.profiles?.avatar_url ? (<img
                                        className={styles.commentProfilePic}
                                        src={c.profiles?.avatar_url}
                                        alt="user"
                                        referrerPolicy="no-referrer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleComment(c.id);
                                        }}
                                    />) : (<RiUserLine className={styles.commentProfilePic} onClick={(e) => {
                                        e.stopPropagation();
                                        toggleComment(c.id);
                                    }} />)}


                                    {isOpen && (
                                        <div
                                            className={styles.commentBubble}
                                            onClick={(e) => e.stopPropagation()}

                                        >
                                            <div className={styles.commentControls}>
                                                <FaRegTrashAlt className={styles.deleteComment} onClick={() => deleteSelectedComment(c.id)} />
                                            </div>
                                            <p>{c.content}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                </div>
            </div>

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

                            <img src={asset.url} alt="" />

                            <p className={styles.imageName}>{`${project.project_assets[currentImage].file_name} - ${getPhaseName(project.project_assets[index])}`}</p>

                        </div>
                    ))}
                </div>

                {isFsOpen && (
                    <FsImageContainer image={project.project_assets[currentImage]} isFsOpen={isFsOpen} setIsFsOpen={setIsFsOpen} />
                )}

            </div>

        </div>
    )
}

export default MediaContainer