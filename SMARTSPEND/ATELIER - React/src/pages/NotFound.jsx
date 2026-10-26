import {Link} from "react-router-dom";

export default function NotFound(){
    return <main className="not-found">
        <p>404</p>
        <h1>Page not found</h1>
        <Link to="/">
            RETURN HOME
        </Link>
    </main>
}
