import { Router } from 'express'
const router = Router()

import *as guest from '../controllers/guest'

// router.get('/uri', guest.uri)
router.get('/', guest.test)
router.get('/getEvents', guest.getEvents)
router.get('/getEventPlusWods', guest.getEventPlusWods)
router.get('/getLatestEvent', guest.getLatestEvent)

router.post('/getWods', guest.getWods)

export default router
// XRH7J5O2OZJ6T1EGNTONG8PG30PIXJJA