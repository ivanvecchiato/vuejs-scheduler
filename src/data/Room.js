import Firebase from "../firebase.js";

let rooms = []

export default class Room {
    constructor() {
        this.id = 0
        this.name = '',
        this.floor = '',
        this.type = [],
        this.services = [],
        this.area = '',
        this.attendance = '',
        this.accessibility = '',
        this.note = ''
    }

    getId() {
        return this.id
    }

    static loadRooms() {
  
        var roomsRef = Firebase.db.collection("rooms").orderBy('floor').orderBy('name')
        roomsRef.get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            rooms.push(doc.data())
          })
          console.log('loadRooms', rooms)
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }

    static loadRoomsGroupByFloor() {
        var floor = 0
        var data = []
        var currentIndex = -1

        var roomsRef = Firebase.db.collection("rooms").orderBy('floor').orderBy('name')
        roomsRef.get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if(doc.data().floor != floor) {
                // new group
                data.push({
                    'floor': floor,
                    'rooms': []
                })
                currentIndex++
                floor = doc.data().floor
            }
            data[currentIndex].rooms.push(doc.data())
          })
          //console.log('loadRooms', data)
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }

    static get rooms() {return rooms}
}
