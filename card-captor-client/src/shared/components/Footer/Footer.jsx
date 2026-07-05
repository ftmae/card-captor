export default function Footer(){
    const year = new Date().getFullYear()

    return (
        <footer className="bg-dark-1 flex-container-center flex-column gap-07"> 
            <a href="mailto:moaiyadi.fatemaabbas@gmail.com" className="ff-serif ff-350 text-white  padding-03 border-bottom-white">Contact Me At -  moaiyadi.fatemaabbas@gmail.com</a>
            <p className="ff-serif ff-350 text-white-trans">CardCaptor, {year} — All Rights Reserved </p>
        </footer>
    )
}