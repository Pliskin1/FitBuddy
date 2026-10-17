import { addDays, toISODate } from '@/shared/lib/date'
import type { Client } from '../types'

/*
 * Demo klijenti. ID-jevi su fiksni jer ih koriste i seed termina i seed mjerenja.
 * Datumi su relativni u odnosu na danas, da demo uvijek izgleda "živo".
 */

export const SEED_CLIENT_IDS = {
  ana: 'c-ana',
  marko: 'c-marko',
  jelena: 'c-jelena',
  stefan: 'c-stefan',
  milica: 'c-milica',
  luka: 'c-luka',
  ivana: 'c-ivana',
  mila: 'c-mila',
} as const

type SeedClient = Omit<Client, 'createdAt' | 'updatedAt' | 'startDate'> & { startedDaysAgo: number }

const CLIENTS: SeedClient[] = [
  {
    id: SEED_CLIENT_IDS.ana,
    firstName: 'Ana',
    lastName: 'Petrović',
    email: 'ana.petrovic@primjer.com',
    phone: '+382 67 123 456',
    birthDate: '1997-05-12',
    heightCm: 168,
    goal: 'fat_loss',
    status: 'active',
    startedDaysAgo: 46,
    injuries: 'Lijevo koljeno (2024) – bez skokova',
    allergies: 'Kikiriki',
    notes: 'Cilj 75 kg do kraja godine. Trenira i sama, dva puta sedmično.',
  },
  {
    id: SEED_CLIENT_IDS.marko,
    firstName: 'Marko',
    lastName: 'Jovanović',
    email: 'marko.jovanovic@primjer.com',
    phone: '+382 69 222 333',
    birthDate: '1990-11-03',
    heightCm: 182,
    goal: 'fat_loss',
    status: 'active',
    startedDaysAgo: 40,
    injuries: '',
    allergies: '',
    notes: 'Radi u smjenama – termini ujutru.',
  },
  {
    id: SEED_CLIENT_IDS.jelena,
    firstName: 'Jelena',
    lastName: 'Kovačević',
    email: 'jelena.kovacevic@primjer.com',
    phone: '+382 68 444 101',
    birthDate: '1994-02-21',
    heightCm: 171,
    goal: 'strength',
    status: 'active',
    startedDaysAgo: 120,
    injuries: '',
    allergies: 'Laktoza',
    notes: 'Priprema za takmičenje u powerliftingu.',
  },
  {
    id: SEED_CLIENT_IDS.stefan,
    firstName: 'Stefan',
    lastName: 'Marković',
    email: 'stefan.markovic@primjer.com',
    phone: null,
    birthDate: '1988-07-30',
    heightCm: 185,
    goal: 'conditioning',
    status: 'active',
    startedDaysAgo: 75,
    injuries: 'Povremeni bol u donjem dijelu leđa',
    allergies: '',
    notes: '',
  },
  {
    id: SEED_CLIENT_IDS.milica,
    firstName: 'Milica',
    lastName: 'Radović',
    email: 'milica.radovic@primjer.com',
    phone: '+382 67 909 808',
    birthDate: '1979-09-14',
    heightCm: 164,
    goal: 'health',
    status: 'active',
    startedDaysAgo: 21,
    injuries: 'Povišen pritisak – umjeren intenzitet',
    allergies: '',
    notes: 'Kontrolno mjerenje jednom mjesečno.',
  },
  {
    id: SEED_CLIENT_IDS.luka,
    firstName: 'Luka',
    lastName: 'Ivanović',
    email: 'luka.ivanovic@primjer.com',
    phone: '+382 69 765 432',
    birthDate: '2001-01-08',
    heightCm: 179,
    goal: 'muscle_gain',
    status: 'active',
    startedDaysAgo: 60,
    injuries: '',
    allergies: '',
    notes: '',
  },
  {
    id: SEED_CLIENT_IDS.ivana,
    firstName: 'Ivana',
    lastName: 'Nikolić',
    email: 'ivana.nikolic@primjer.com',
    phone: '+382 68 111 222',
    birthDate: '1992-12-01',
    heightCm: 166,
    goal: 'conditioning',
    status: 'active',
    startedDaysAgo: 90,
    injuries: '',
    allergies: 'Gluten',
    notes: '',
  },
  {
    id: SEED_CLIENT_IDS.mila,
    firstName: 'Mila',
    lastName: 'Kovač',
    email: 'mila.kovac@primjer.com',
    phone: null,
    birthDate: '1985-04-17',
    heightCm: 170,
    goal: 'health',
    status: 'archived',
    startedDaysAgo: 200,
    injuries: '',
    allergies: '',
    notes: 'Pauza zbog selidbe.',
  },
]

export function seedClients(): Client[] {
  return CLIENTS.map(({ startedDaysAgo, ...client }) => {
    const started = addDays(new Date(), -startedDaysAgo)
    return {
      ...client,
      startDate: toISODate(started),
      createdAt: started.toISOString(),
      updatedAt: started.toISOString(),
    }
  })
}
