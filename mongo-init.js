db.auth('root', 'example')

exemploimagem = db.getSiblingDB('exemploimagem')

exemplimagem.createCollection('base')

exemploimagem.createUser({
  user: 'root',
  pwd: 'example',
  roles: [
    {
      role: 'root',
      db: 'exemploimagem',
    },
  ],
})

eventosgrupo2 = db.getSiblingDB('eventosgrupo2')

eventosgrupo2.createCollection('base')

eventosgrupo2.createUser({
  user: 'root',
  pwd: 'example',
  roles: [
    {
      role: 'root',
      db: 'eventosgrupo2',
    },
  ],
})

