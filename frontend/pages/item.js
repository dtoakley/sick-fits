import ItemDetails from '../components/ItemDetails'

const Item = props => (

    <div>
        <ItemDetails id={props.query.id} />
    </div>
)

export default Item
