import { Router } from 'express'
import *as adm from '../controllers/admin'

const router = Router()


router.get('/getTeamInfo',adm.getTeamInfo)
router.post('/updateTeamInfo',adm.updateTeamInfo)
router.post('/loginAdmin',adm.loginAdmin)
router.get('/getAllEventUsers',adm.getAllEventUsers)


router.post('/getTickets', adm.getTickets)
router.post('/approveTicket', adm.approveTicket)
router.post('/rejectTicket', adm.rejectTicket)
router.get('/getUserInfo', adm.getUserInfo)
router.get('/getUserSearch', adm.getUserSearch)

router.post('/userSearchDB', adm.userSearchDB)

export default router