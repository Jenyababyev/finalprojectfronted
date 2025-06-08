import { Link } from 'react-router'
const Error = () => {
    return (
        <div>
            404

            <p>not found</p><Link to="/products">products</Link>
            <p>not found</p><Link to="/login">login</Link>
        </div>
    )
}

export default Error