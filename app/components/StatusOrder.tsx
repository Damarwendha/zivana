interface StatusOrderProps{
    text: string,

    bg: string,
    color: string
}

const StatusOrder: React.FC<StatusOrderProps> = ({text, bg, color}) => {
    return ( 
        <div className={`
        ${bg}
        ${color}
        px-1
        rounded
        flex
        items-center
        gap-1
        `}>
            {text}
        </div>
     );
}
 
export default StatusOrder;