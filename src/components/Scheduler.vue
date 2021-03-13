<template>
<div>
    <b-modal size="xl" v-model="bookingEdit" ref="bookingModal" title="Prenotazione">
      <booking-form
        :start="rangeStart"
        :end="rangeEnd"
        :room='selectedRoom'
        :bookId='bookId'
        @closeEvent="closeBookingForm">
      </booking-form>
      <template #modal-footer="{}">
      <span>&nbsp;</span>
      </template>
    </b-modal>
  <DayPilotScheduler id="dp" :config="config" ref="scheduler" />
</div>
</template>

<script>
import { DayPilot, DayPilotScheduler } from "daypilot-pro-vue";
import Firebase from "../firebase.js";
import Status from "../data/Status.js";
import BookingForm from './BookingForm.vue'

function updateBooking (id, newStart, newEnd, newRoom) {
  
  var objUdpdate = {
      checkin: newStart.toString().split("T")[0],
      checkout: newEnd.toString().split("T")[0]
  }
  if(newRoom != undefined)
    objUdpdate.room = newRoom

  Firebase.db.collection("bookings").doc(id).update(objUdpdate)
    .then(function() {
      alert(id + ' updated')
    })
    .catch(function(error) {
      console.error("Error updating document: ", error);
    });
}

export default {
  name: "Scheduler",
  data: function () {
    var self = this;
    return {
      bookingEdit: false,
      rangeStart: '',
      rangeEnd: '',
      selectedRoom: '',
      bookId: 0,
      config: {
        locale: "it-it",
        timeHeaders: [
          {
            groupBy: "Month",
          },
          {
            groupBy: "Day",
            format: "d",
          },
        ],
        scale: "Day",
        days: DayPilot.Date.today().daysInYear(),
        startDate: DayPilot.Date.today().addDays(-5),
        businessBeginsHour: 8,
        businessEndsHour: 24,
        timeRangeSelectedHandling: "Enabled",
        onTimeRangeSelected: function (args) {
          self.showBookingDialog(args.start, args.end, args.resource)
        },
        eventMoveHandling: "Update",
        onEventMoved: function (args) {
          this.message("Event moved: " + args.e.text());
          updateBooking(args.e.data.id, args.newStart, args.newEnd, args.newResource)
        },
        eventResizeHandling: "Update",
        onEventResized: function (args) {
          updateBooking(args.e.data.id, args.newStart, args.newEnd)
          this.message("Event resized: " + args.e.text());
        },
        eventDeleteHandling: "Update",
        onEventDeleted: function (args) {
          this.message("Event deleted: " + args.e.text());
        },
        eventClickHandling: "Select",
        onEventClick: function (args) {
          //this.message("Event selected: " + args.e.text());
          self.editBooking(args.e.data.id)
        },
        eventHoverHandling: "Bubble",
        bubble: new DayPilot.Bubble({
          onLoad: function (args) {
            // if event object doesn't specify "bubbleHtml" property
            // this onLoad handler will be called to provide the bubble HTML
            args.html = "Event details";
          },
        }),
        contextMenu: new DayPilot.Menu({
          items: [
            {
              text: "Delete",
              image: "delete.png",
              onClick: function (args) {
                var dp = args.source.calendar;
                dp.events.remove(args.source);
              },
            },
          ],
        }),
        treeEnabled: true,
      },
      bookings: [],
    };
  },
  props: {},
  components: {
    DayPilotScheduler,
    BookingForm
  },
  computed: {
    // DayPilot.Scheduler object - https://api.daypilot.org/daypilot-scheduler-class/
    scheduler: function () {
      return this.$refs.scheduler.control;
    },
  },
  methods: {
    closeBookingForm: function() {
      this.$refs['bookingModal'].hide()
      this.scheduler.clearSelection()
    },
    editBooking: function (id) {
      this.bookId = id
      this.bookingEdit = true
    },
    showBookingDialog: function (s, e, r) {
      this.rangeStart = s.toString().split("T")[0]
      this.rangeEnd = e.toString().split("T")[0]
      this.selectedRoom = r
      this.bookingEdit = true
    },
    loadReservations: function () {
      Firebase.db.collection("bookings").onSnapshot((snapshotChange) => {
        this.bookings = [];
        snapshotChange.forEach((doc) => {
          var record = doc.data();
          this.bookings.push({ id: doc.id, data: record });
        });

        //console.log("Scheduler", this.bookings);
        this.handleBookings();
        //this.scheduler.scrollTo(new DayPilot.Date());
      });
    },
    handleBookings: function () {
      var data = [];

      for (var j = 0; j < this.bookings.length; j++) {
        var obj = {
          id: this.bookings[j].id,
          resource: parseInt(this.bookings[j].data.room),
          start: DayPilot.Date(this.bookings[j].data.checkin),
          end: DayPilot.Date(this.bookings[j].data.checkout),
          text: this.bookings[j].data.name,
          color: this.getStatusColor(this.bookings[j].data.status),
        };
        //console.log("Booking", obj);

        data.push(obj);
      }

      this.scheduler.update({ events: data });
    },
    loadRooms() {
      var floor = 0
      var data = []
      var currentIndex = -1

      var roomsRef = Firebase.db.collection("rooms").orderBy('floor').orderBy('name')
      roomsRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if(doc.data().floor != floor) {
              // new group
              data.push({
                name: "Piano " + doc.data().floor,
                id: "P" + doc.data().floor,
                expanded: true,
                children: []
              })
              currentIndex++
              floor = doc.data().floor
          }

          data[currentIndex].children.push({
            name: doc.data().name,
            id: parseInt(doc.data().name)
          })
        })
        //console.log('scheduler data', data)
        this.scheduler.update({ resources: data });

        this.loadReservations();
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
    },
    updateColor(e, color) {
      var dp = this.scheduler;
      e.data.color = color;
      dp.events.update(e);
      dp.message("Color updated");
    },
    getStatusColor: function (status) {
      return new Status(status).getColor();
    },
  },
  mounted: function () {
    this.loadRooms();

    this.scheduler.message("Welcome!");
  },
};
</script>
