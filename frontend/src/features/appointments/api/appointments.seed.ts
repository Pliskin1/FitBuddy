import { SEED_CLIENT_IDS } from '@/features/clients/api/clients.seed'
import { addDays, startOfDay } from '@/shared/lib/date'
import type { Appointment, AppointmentStatus, AppointmentType } from '../types'

/*
 * Demo termini za ±3 sedmice oko današnjeg dana, po stalnom sedmičnom rasporedu klijenata.
 * Današnji dan ima ručno složen raspored (uključujući jedan termin na čekanju i jedan otkazan),
 * da kontrolna tabla uvijek ima šta da pokaže.
 */

interface WeeklySlot {
  clientId: string
  /** 1 = ponedjeljak … 6 = subota (kao Date.getDay()). */
  weekdays: number[]
  hour: number
  programDays: string[]
}

const WEEKLY: WeeklySlot[] = [
  {
    clientId: SEED_CLIENT_IDS.ana,
    weekdays: [1, 4],
    hour: 18,
    programDays: ['Dan A – Gornji dio tijela', 'Dan B – Noge i leđa'],
  },
  {
    clientId: SEED_CLIENT_IDS.marko,
    weekdays: [2, 5],
    hour: 8,
    programDays: ['Full body A', 'Full body B'],
  },
  {
    clientId: SEED_CLIENT_IDS.jelena,
    weekdays: [1, 3],
    hour: 9,
    programDays: ['Čučanj – teški dan', 'Mrtvo dizanje – teški dan'],
  },
  {
    clientId: SEED_CLIENT_IDS.stefan,
    weekdays: [2, 4],
    hour: 10,
    programDays: ['Intervali', 'Kondiciona snaga'],
  },
  {
    clientId: SEED_CLIENT_IDS.milica,
    weekdays: [3],
    hour: 12,
    programDays: ['Mobilnost i lagana snaga'],
  },
  { clientId: SEED_CLIENT_IDS.luka, weekdays: [1, 4], hour: 17, programDays: ['Push', 'Pull'] },
  {
    clientId: SEED_CLIENT_IDS.ivana,
    weekdays: [2, 5],
    hour: 19,
    programDays: ['Kondicija A', 'Kondicija B'],
  },
]

interface TodaySlot {
  clientId: string
  hour: number
  type: AppointmentType
  status: AppointmentStatus
  programDay: string
  note?: string
}

const TODAY: TodaySlot[] = [
  {
    clientId: SEED_CLIENT_IDS.jelena,
    hour: 9,
    type: 'training',
    status: 'confirmed',
    programDay: 'Čučanj – teški dan',
  },
  {
    clientId: SEED_CLIENT_IDS.stefan,
    hour: 10,
    type: 'training',
    status: 'confirmed',
    programDay: 'Intervali',
  },
  {
    clientId: SEED_CLIENT_IDS.milica,
    hour: 12,
    type: 'assessment',
    status: 'confirmed',
    programDay: 'Kontrolno mjerenje',
  },
  {
    clientId: SEED_CLIENT_IDS.luka,
    hour: 17,
    type: 'training',
    status: 'pending',
    programDay: 'Push',
  },
  {
    clientId: SEED_CLIENT_IDS.ivana,
    hour: 19,
    type: 'training',
    status: 'cancelled',
    programDay: 'Kondicija A',
    note: 'Otkazano juče – obaveze na poslu.',
  },
]

function at(day: Date, hour: number): Date {
  const d = new Date(day)
  d.setHours(hour, 0, 0, 0)
  return d
}

function make(
  id: string,
  clientId: string,
  start: Date,
  fields: Partial<Appointment>,
): Appointment {
  const created = addDays(start, -7).toISOString()
  return {
    id,
    clientId,
    startsAt: start.toISOString(),
    durationMin: 60,
    type: 'training',
    status: 'confirmed',
    programDay: '',
    note: '',
    createdAt: created,
    updatedAt: created,
    ...fields,
  }
}

export function seedAppointments(now = new Date()): Appointment[] {
  const today = startOfDay(now)
  const items: Appointment[] = []
  let counter = 0

  for (let offset = -21; offset <= 21; offset++) {
    if (offset === 0) continue
    const day = addDays(today, offset)
    for (const slot of WEEKLY) {
      if (!slot.weekdays.includes(day.getDay())) continue
      counter++
      const start = at(day, slot.hour)
      let status: AppointmentStatus = offset < 0 ? 'completed' : 'confirmed'
      if (offset < 0 && counter % 13 === 5) status = 'no_show'
      if (offset < 0 && counter % 17 === 9) status = 'cancelled'
      // Luka šalje zahtjeve za naredne termine – trener ih tek treba da potvrdi.
      if (offset > 0 && offset <= 7 && slot.clientId === SEED_CLIENT_IDS.luka) status = 'pending'

      items.push(
        make(`a-${offset}-${slot.clientId}`, slot.clientId, start, {
          status,
          programDay: slot.programDays[counter % slot.programDays.length],
        }),
      )
    }
  }

  for (const slot of TODAY) {
    const start = at(today, slot.hour)
    // Termini koji su danas već prošli računaju se kao završeni.
    const passed = slot.status === 'confirmed' && start.getTime() + 60 * 60_000 <= now.getTime()
    items.push(
      make(`a-0-${slot.clientId}`, slot.clientId, start, {
        type: slot.type,
        status: passed ? 'completed' : slot.status,
        programDay: slot.programDay,
        note: slot.note ?? '',
      }),
    )
  }

  return items.sort((a, b) => a.startsAt.localeCompare(b.startsAt))
}
