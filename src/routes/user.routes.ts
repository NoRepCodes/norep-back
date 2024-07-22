import { Router } from 'express'
const router = Router()

import *as usr from '../controllers/user'


router.post('/login', usr.login)
router.post('/registerUser', usr.registerUser)
router.post('/registerTeam', usr.registerTeam)
router.post('/registerTicket', usr.registerTicket)
router.post('/checkUsers', usr.checkUsers)

router.get('/getTickets', usr.getTickets)
router.post('/approveTicket', usr.approveTicket)
router.post('/rejectTicket', usr.rejectTicket)

router.post('/createAdmin', usr.createAdmin)
router.post('/deleteAdmin', usr.deleteAdmin)
router.post('/loginAdmin', usr.loginAdmin)

router.get('/getUserRedcords', usr.getUserRedcords)

export default router