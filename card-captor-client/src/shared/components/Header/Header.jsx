import { Form } from "react-router";

export default function Header(){
    return (
        <header className="fixed-top bg-dark-1 flex-row align-center justify-space-between padding-1 padding-inline-2">
            <p className="text-white">Logo</p>
            <nav>
                <ul>
                    <Form action='/logout' method="POST">
                        <li><button type="submit" className="large-button">Logout</button></li>
                    </Form>
                </ul>
            </nav>
        </header>
    )
}