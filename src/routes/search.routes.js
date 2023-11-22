import {Router} from 'express'
const router = Router()

import {test,deleteEvent,updateEvent,getEvents, createEvent, updateCategory, addTeam,  addPoints, addCategory, deleteCategory, deleteTeam,updateTeam, updateWods} from '../controllers/search'


router.get('/', test)

router.post('/createEvent', createEvent)
router.post('/deleteEvent', deleteEvent)
router.post('/updateEvent', updateEvent)

router.get('/getEvents', getEvents)

router.post('/addCategory', addCategory)
router.post('/updateCategory', updateCategory)
router.post('/deleteCategory', deleteCategory) 
router.post('/updateWods', updateWods)

router.post('/addTeam', addTeam)
router.post('/addPoints', addPoints)
router.post('/deleteTeam', deleteTeam)
router.post('/updateTeam', updateTeam)

export default router
// module.exports = router
// XRH7J5O2OZJ6T1EGNTONG8PG30PIXJJA