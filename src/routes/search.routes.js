import {Router} from 'express'
const router = Router()

import {findTeams,test,deleteEvent,updateEvent,getEvents, createEvent, updateCategory, addTeams,  addWods, addCategory, deleteCategory, deleteTeam,updateTeam, updateWods, getEventsHome, getEventsPlusTeams, toggleUpdating, editTeams, createAdmin, deleteAdmin, loginAdmin, searchTeam} from '../controllers/search'

// wtf
router.get('/test', test)

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

router.post('/addTeams', addTeams)
router.post('/addWods', addWods)
router.post('/deleteTeam', deleteTeam)
router.post('/editTeams', editTeams)
// router.post('/updateTeam', updateTeam)

router.post('/toggleUpdating', toggleUpdating)

router.post('/createAdmin',createAdmin)
router.post('/deleteAdmin',deleteAdmin)
router.post('/loginAdmin',loginAdmin)

router.post('/searchTeam',searchTeam)


export default router
// module.exports = router
// XRH7J5O2OZJ6T1EGNTONG8PG30PIXJJA