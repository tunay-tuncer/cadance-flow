import { useEffect, useState, useRef } from "react";
import styles from "../../styles/Project.module.css"
import { useAuth0 } from "@auth0/auth0-react";
import { v4 as uuidv4 } from 'uuid';
import { useSupabase } from "../../hooks/useSupabase";
import FsImageContainer from "./FsImageContainer";
import ToolsContainer from "./ToolsContainer";


//REACT ICONS
import { MdCheck, MdClose, MdFullscreen, MdFullscreenExit } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { ImFolderDownload } from "react-icons/im";
import { RiUserLine } from "react-icons/ri";

const MediaContainer = ({ project, isPublic }) => {
    const imageRef = useRef(null);       // container div → for pin positioning
    const imgElRef = useRef(null);       // img element → for naturalWidth/naturalHeight
    const textAreaRef = useRef(null);
    const [currentImage, setCurrentImage] = useState(0);
    const [currentImageId, setCurrentImageId] = useState("");
    const [isFsOpen, setIsFsOpen] = useState(false);

    const [previewPos, setPreviewPos] = useState({ x: 0, y: 0 });
    const [isCommenting, setIsCommenting] = useState(false);
    const [openCommentIds, setOpenCommentIds] = useState([]);

    const { user, isAuthenticated } = useAuth0();
    const { getClient } = useSupabase();

    const [isDrafting, setIsDrafting] = useState(false);
    const [draftText, setDraftText] = useState("");

    useEffect(() => {

        if (project.project_assets[currentImage]) {
            setCurrentImageId(project.project_assets[currentImage].id);
        }

    }, [currentImage, project.project_assets]);


    const allComments = project.project_assets.flatMap(asset => asset.project_comments || []);
    const [comments, setComments] = useState(allComments);

    const getPhaseName = (asset) => {
        const phase = project.project_phases.find(p => p.id === asset.phase_id);
        return phase ? phase.name : "Unassigned";
    };

    const deleteAllComments = async () => {
        const confirmDelete = window.confirm("Bu görsele ait TÜM yorumları silmek istediğinize emin misiniz? Bu işlem geri alınamaz.");

        if (!confirmDelete) return;
        try {
            const supabase = await getClient();
            const { error } = await supabase
                .from('project_comments')
                .delete()
                .eq("asset_id", currentImageId)

            if (error) throw error;
            setComments(prev => prev.filter(c => c.asset_id !== currentImageId));
        } catch (err) {
            console.error("Yorumlar silinirken hata oluştu:", error.message);
            alert("Silme işlemi başarısız oldu: " + error.message);
        }
    };

    const getImageRect = () => {
        if (!imageRef.current || !imgElRef.current) return null;

        const container = imageRef.current.getBoundingClientRect();
        const { naturalWidth, naturalHeight } = imgElRef.current;

        const containerAspect = container.width / container.height;
        const imageAspect = naturalWidth / naturalHeight;

        let renderedWidth, renderedHeight, offsetX, offsetY;

        if (imageAspect > containerAspect) {
            // Letterboxed top/bottom
            renderedWidth = container.width;
            renderedHeight = container.width / imageAspect;
            offsetX = 0;
            offsetY = (container.height - renderedHeight) / 2;
        } else {
            // Pillarboxed left/right
            renderedHeight = container.height;
            renderedWidth = container.height * imageAspect;
            offsetX = (container.width - renderedWidth) / 2;
            offsetY = 0;
        }

        return { renderedWidth, renderedHeight, offsetX, offsetY, container };
    };

    const handleMouseMove = (e) => {
        if (!isCommenting || isDrafting) return;
        const result = getImageRect();
        if (!result) return;

        const { renderedWidth, renderedHeight, offsetX, offsetY, container } = result;

        const rawX = e.clientX - container.left - offsetX;
        const rawY = e.clientY - container.top - offsetY;

        const x = Math.min(Math.max((rawX / renderedWidth) * 100, 0), 100);
        const y = Math.min(Math.max((rawY / renderedHeight) * 100, 0), 100);

        setPreviewPos({ x, y });
    };

    const handleImageClick = () => {
        if (!isCommenting || isDrafting) return;

        setIsDrafting(true);
    };

    const getPinStyle = (left, top) => {
        const result = getImageRect();
        if (!result) return { left: `${left}%`, top: `${top}%` };

        const { renderedWidth, renderedHeight, offsetX, offsetY, container } = result;

        return {
            left: `${offsetX + (parseFloat(left) / 100) * renderedWidth}px`,
            top: `${offsetY + (parseFloat(top) / 100) * renderedHeight}px`,
        };
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


    return (
        <div className={styles.mediaContainer}>

            <div className={styles.leftContainer}>
                <p className={styles.assetName}>{`${project.project_assets[currentImage].file_name} - ${getPhaseName(project.project_assets[currentImage])}`}</p>

                <div className={styles.imageDisplayContainer} ref={imageRef} onMouseMove={handleMouseMove}>

                    <img ref={imgElRef} src={project.project_assets[currentImage].url} alt="" onClick={handleImageClick} />

                    <MdFullscreen className={styles.fullscreenIcon} onClick={() => openFullscreen()} />

                    {/* THE GHOST PIN: Only shows when in commenting mode */}
                    {isCommenting && (
                        <div
                            className={styles.draftWrapper}
                            style={{
                                position: 'absolute',
                                ...getPinStyle(previewPos.x, previewPos.y),
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
                                        ...getPinStyle(c.left, c.top),
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

            <ToolsContainer project={project} setIsCommenting={setIsCommenting} isCommenting={isCommenting} deleteAllComments={deleteAllComments} currentImage={currentImage} setCurrentImage={setCurrentImage} getPhaseName={getPhaseName} />

            {isFsOpen && (
                <FsImageContainer image={project.project_assets[currentImage]} isFsOpen={isFsOpen} setIsFsOpen={setIsFsOpen} />
            )}

        </div>
    )
}

export default MediaContainer