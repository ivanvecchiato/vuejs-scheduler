import Firebase from "../firebase.js";

export default class Log {
    constructor() {
        this.timestamp = 0,
        this.operatorId = 0,
        this.event = {
            type: 0,
            description: '',
            comment: ''
        },
        this.bookingId = 0     // se applicabile
    }

    writeLog() {

        Firebase.db.collection("logs").add(Object.assign({}, this))
          .then((docRef) => {
            console.log("Document written with ID: ", docRef.id)
          })
          .catch((error) => {
            console.error("Error adding document: ", error)
          })
    }
}