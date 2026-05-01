export default function Step({stepNum, heading, body}){
    return (
        <div className="container hover bg-trans border-light-2 text-light-2 flex-column" style={{'gap': '1rem'}}>
            <p className="ff-serif fs-425">Step - {stepNum}</p>
            <p className="ff-serif fs-450">{heading}</p>
            <p>{body}</p>
        </div>
    )
}