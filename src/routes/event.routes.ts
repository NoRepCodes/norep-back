import {Router } from 'npm:express'
const router = Router()

import *as evn from '../controllers/event.ts'

router.get('/deleteAll',evn.deleteAll)
router.post('/mergeEvent',evn.mergeEvent)
router.post('/mergeWods',evn.mergeWods)
router.post('/deleteEvent', evn.deleteEvent)

router.post('/createEvent', evn.createEvent)
router.get('/getEventsAdmin',evn.getEventsAdmin)
// router.post('/updateEvent', evn.updateEvent)

// router.post('/updateWods', evn.updateWods)
// router.post('/updateResults', evn.updateResults)
// router.post('/updateTeams', evn.updateTeams)

// router.post('/toggleUpdating', evn.toggleUpdating)

export default router