import Item from '../../components/Item'
import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'

const testItem = {
    id: 'ABC123',
    title: 'A Cool Item',
    price: 4000,
    description: 'This item is really cool!',
    image: 'dog.jpg',
    largeImage: 'largedog.jpg',
}


describe('<Item />', () => {
    it('Renders and matches the snapshot', () => {
        const wrapper = shallow(<Item item={testItem} />)
        expect(toJSON(wrapper)).toMatchSnapshot()
    })

    it('renders the image properly', () => {
        const wrapper = shallow(<Item item={testItem} />)
        const img = wrapper.find('img')
        expect(img.props().src).toBe(testItem.image)
        expect(img.props().alt).toBe(testItem.title)
    })

    it('renders the pricetag and title', () => {
        const wrapper = shallow(<Item item={testItem} />)
        const PriceTag = wrapper.find('PriceTag')
        expect(PriceTag.children().text()).toBe('$40')
        expect(wrapper.find('Title a').text()).toBe(testItem.title)
    })

    it('renders out the buttons properly', () => {
        const wrapper = shallow(<Item item={testItem} />)
        const buttonList = wrapper.find('.buttonList')
        expect(buttonList.children()).toHaveLength(3)
        expect(buttonList.find('Link')).toHaveLength(1)
        expect(buttonList.find('AddToCart').exists()).toBe(true)
        expect(buttonList.find('DeleteItem').exists()).toBeTruthy()
    })
})
