import formatMoney from '../../lib/formatMoney'


describe('formatMoney test', () => {
    it('Works with fractional dollars', () => {
        expect(formatMoney(1)).toEqual('$0.01')
        expect(formatMoney(10)).toEqual('$0.10')
        expect(formatMoney(100)).toEqual('$1')
    })

    it('Leaves cents off for whole dollars', () => {
        expect(formatMoney(100)).toEqual('$1')
        expect(formatMoney(5000)).toEqual('$50')
        expect(formatMoney(10000)).toEqual('$100')
    })

    it('Works with negative numbers', () => {
        expect(formatMoney(-100)).toEqual('-$1')
        expect(formatMoney(-5000)).toEqual('-$50')
        expect(formatMoney(-12345)).toEqual('-$123.45')
    })
})
