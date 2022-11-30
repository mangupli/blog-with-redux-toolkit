import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPostById, updatePost, deletePost } from "./postsSlice";
import { selectAllUsers } from "../users/usersSlice";
import { useParams, useNavigate } from "react-router-dom";

const EditPostForm = () => {

    const { postId } = useParams();
    const navigate = useNavigate();

    const post = useSelector((state) => selectPostById(state, Number(postId)));
    const users = useSelector(selectAllUsers);

    const dispatch = useDispatch();
    
    const [title, setTitle] = useState(post?.title);
    const [content, setContent] = useState(post?.body);
    const [userId, setUserId] = useState(post?.userId);
    const [requestStatus, setRequestStatus] = useState('idle');

    if(!post){
        return (
            <section>
                <h2>Post not found!</h2>
            </section>
        );
    } 

    const onTitleChanged = e => setTitle(e.target.value);
    const onContentChanged = e => setContent(e.target.value);
    const onAuthorChanged = e => setUserId(Number(e.target.value));



    const canSave = [title, content, userId].every(Boolean) && requestStatus === 'idle';

    const onSavePostClicked = () => {
        if(canSave){
            try{
                setRequestStatus('pending');
                dispatch(updatePost({id: post.id, title, body: content, userId, reactions: post.reactions})).unwrap();
                setContent('');
                setTitle('');
                setUserId('');
                navigate(`/post/${post.id}`);
            } catch(err) {
                console.error(`Failed to save post: ${err}`)
            } finally {
                setRequestStatus('idle');
            }         
        }
    }

    const userOptions = users.map(user=> (
        <option value={user.id} key={user.id}>
            {user.name}
        </option>
    ))

    const onDeletePostClicked = () => {
        try {
            setRequestStatus('loading');
            dispatch(deletePost({id: post.id})).unwrap();
            setContent('');
            setTitle('');
            setUserId('');
            navigate('/');
        } catch (error) {
            console.error(`Failed to delete post: ${error}`);
        } finally {
            setRequestStatus('idle');
        }           
    }

    return (
        <section>
            <h2>Edit post</h2>
            <form>
                <label htmlFor="postTitle">Post Title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={onTitleChanged}
                    />
                <label htmlFor="postAuthor">Author:</label>
                <select id="postAuthor" defaultValue={userId} onChange={onAuthorChanged}>
                    <option value=""></option>
                    {userOptions}
                </select>
                <label htmlFor="postContent">Post Content:</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                    />
                <button
                    type="button"
                    onClick={onSavePostClicked}
                    disabled={!canSave}
                >Save post</button>
                <button
                    className="deleteButton"
                    type="button"
                    onClick={onDeletePostClicked}
                >Delete post</button>
            </form>
        </section>
    );




}

export default EditPostForm;