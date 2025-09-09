import { Router } from 'express'
const router = Router()

import *as guest from '../controllers/guest'


router.get('/', guest.isOn)
router.get('/test', guest.test)

router.get('/getEvents', guest.getEvents)
router.get('/getEventTable', guest.getEventTable)
router.get('/getLatestEvent', guest.getLatestEvent)
router.get('/getEmailExist', guest.getEmailExist)


router.post('/login', guest.login)
router.post('/registerUser', guest.registerUser)
router.post('/changePassword', guest.changePassword)
router.post('/version', guest.version)




// router.post('/getWods', guest.getWods)
// router.post('/eventsWithInfo', guest.eventsWithInfo)
// router.get('/getEventPlusWods', guest.getEventPlusWods)
// router.post('/cleanDupl', guest.cleanDupl)

export default router
// XRH7J5O2OZJ6T1EGNTONG8PG30PIXJJA