import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectPostById } from "./postsSlice";

import PostAuthor from "../users/PostAuthor";
import TimeAgo from "./TimeAgo"
import ReactionButtons from "./ReactionButtons";


const PostsExcerpt = ({ postId }) => {

    const post = useSelector(state => selectPostById(state, postId));

    return (
        <article>
            <h2>{post.title}</h2>
            <p className="excerpt">{post.body.substring(0, 72)}....</p>
            <p className="postCredit">
                <Link to={`/post/${post.id}`}>View post</Link>
                <PostAuthor userId={post.userId}/>
                <TimeAgo timestamp={post.date}/>
            </p>
            <ReactionButtons post={post}/>
        </article>
    );
}

export default PostsExcerpt;