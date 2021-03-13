export default class Booking {
    constructor() {
        this.pax = 2,
        this.phone = '',
        this.email = '',
        this.code = '',
        this.board = {
            label: 'BB',
            id: 1,
            description: 'Camera e colazione'
        },
        this.status = 0,
        this.name = '',
        this.checkin = '',
        this.checkout = ''
        this.days = 0,
        this.room = 0,
        this.id_cliente = 0
        this.note = '',
        this.creation = {
            insTime: {},
            insOperatorId: 0
        },
        this.modification = {
            lastModifyTime: {},
            lastOperatorId: 0
        }
    }
}
