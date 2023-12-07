import {Router} from 'express'
const router = Router()

import {findTeams,test,deleteEvent,updateEvent,getEvents, createEvent, updateCategory, addTeam,  addWods, addCategory, deleteCategory, deleteTeam,updateTeam, updateWods, getEventsHome, getEventsPlusTeams} from '../controllers/search'


router.get('/', test)

router.post('/createEvent', createEvent)
router.post('/deleteEvent', deleteEvent)
router.post('/updateEvent', updateEvent)

router.get('/getEvents', getEvents)
router.get('/getEventsHome', getEventsHome)
router.get('/getEventsPlusTeams', getEventsPlusTeams)
router.post('/findTeams',findTeams)

// router.get('/getStart', getStart)

router.post('/addCategory', addCategory)
router.post('/updateCategory', updateCategory)
router.post('/deleteCategory', deleteCategory) 
router.post('/updateWods', updateWods)

router.post('/addTeam', addTeam)
router.post('/addWods', addWods)
router.post('/deleteTeam', deleteTeam)
router.post('/updateTeam', updateTeam)

export default router
// module.exports = router
// XRH7J5O2OZJ6T1EGNTONG8PG30PIXJJA