import { parseISO, formatDistanceToNow } from "date-fns/esm";

const TimeAgo = ({ timestamp }) => {
    let timeAgo = '';
    if(timestamp){
        const date = parseISO(timestamp);
        const timePeroid = formatDistanceToNow(date);
        timeAgo = `${timePeroid} ago`;
    }
    return(
        <span title={timestamp}>
            &nbsp; <i>{timeAgo}</i>
        </span>
    )
}

export default TimeAgo;