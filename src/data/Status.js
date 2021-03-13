const State = {
    UNCONFIRMED: 0,
    CONFIRMED: 1,
    CHECKIN: 2,
    CHECKOUT: 3,
    GROUP: 4,
    LOCKED: 5,
    SUSPENDED: 6,
}
Object.freeze(State)

export default class Status {

    constructor(id) {
        this.id = id
        this.setFields(id)
    }

    setFields(Id) {
      var id = parseInt(Id)

      if (id === State.UNCONFIRMED) {
        this.color = '#F38181'
        this.description = 'non confermata'
      }
      else if (id === State.CONFIRMED) {
        this.color = '#0099CC'
        this.description = 'confermata'
      }
      else if (id === State.CHECKIN) {
        this.color = '#00C581'
        this.description = 'checkin'
      }
      else if (id === State.CHECKOUT) {
        this.color = '#757575'
        this.description = 'checkout'
      }
      else if (id === State.LOCK) {
        this.color = '#FFD24F'
        this.description = 'riservata'
      }
      else if (id === State.SUSPENDED) {
        this.color = '#FFCA28'
        this.description = 'sospesa'
      }
    }

    getColor() {
        return this.color
    }
}
