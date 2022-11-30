import { useSelector } from "react-redux";
import { selectPostsIds, getPostsError, getPostsStatus } from "./postsSlice";
import PostsExcerpt from "./PostsExcerpt";

const PostsList = () => {

    const orderedPostsIds = useSelector(selectPostsIds);
    const postsStatus = useSelector(getPostsStatus);
    const error = useSelector(getPostsError);

    let content;
    if(postsStatus === 'loading'){
        content = <p>Loading...</p>;
    } else if (postsStatus === 'succeeded'){
        content = orderedPostsIds.map(postId => <PostsExcerpt key={postId} postId={postId}/>)
    }
    else if (postsStatus === 'failed'){
        content = <p>{error}</p>
    }

    return(
        <section>
            {content}
        </section>
    );
}

export default PostsList;

