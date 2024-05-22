import Card from '../components/Card';
import './Forge.css';

function Forge({ id, name }) {
    return (
        <Card>
            <h2>{name}</h2>
            <h3>{id}</h3>
        </Card>
    );
}
export default Forge;