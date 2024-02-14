<template>
<v-container class="h-100 d-flex justify-center align-center">
  <h1>AppointmentView</h1>
  <div class="container">
    <v-row class="fill-height">
    <v-col>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="today"
          color="primary"
          type="month"
          :events="events"
        ></v-calendar>
      </v-sheet>
    </v-col>
  </v-row>
  </div>
</v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDate } from 'vuetify'

const focus = ref('')
const events = ref([])
const colors = [
  'blue',
  'indigo',
  'deep-purple',
  'cyan',
  'green',
  'orange',
  'grey darken-1'
]
const names = [
  'Meeting',
  'Holiday',
  'PTO',
  'Travel',
  'Event',
  'Birthday',
  'Conference',
  'Party'
]

onMounted(() => {
  const { startOfDay, startOfMonth, endOfDay, endOfMonth } = useDate()
  fetchEvents({
    start: startOfDay(startOfMonth(new Date())),
    end: endOfDay(endOfMonth(new Date()))
  })
})

function fetchEvents ({ start, end }) {
  const eventsArray = []

  const min = start
  const max = end
  const days = (max.getTime() - min.getTime()) / 86400000
  const eventCount = rnd(days, days + 20)

  for (let i = 0; i < eventCount; i++) {
    const allDay = rnd(0, 3) === 0
    const firstTimestamp = rnd(min.getTime(), max.getTime())
    const first = new Date(firstTimestamp - (firstTimestamp % 900000))
    const secondTimestamp = rnd(2, allDay ? 288 : 8) * 900000
    const second = new Date(first.getTime() + secondTimestamp)

    eventsArray.push({
      title: names[rnd(0, names.length - 1)],
      start: first,
      end: second,
      color: colors[rnd(0, colors.length - 1)],
      allDay: !allDay
    })
  }

  events.value = eventsArray
}

function rnd (a, b) {
  return Math.floor((b - a + 1) * Math.random()) + a
}
</script>
