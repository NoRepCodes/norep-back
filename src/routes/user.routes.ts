import { Router } from 'express'
const router = Router()

import *as usr from '../controllers/user'


// router.post('/registerTeam', usr.registerTeam)


// router.post('/createAdmin', usr.createAdmin)
// router.post('/deleteAdmin', usr.deleteAdmin)

// router.get('/getUserRecords', usr.getUserRecords)

// router.get('/sendEmail', usr.sendEmail)

router.post('/updateUserInfo', usr.updateUserInfo)
router.post('/checkUsers', usr.checkUsers)
router.post('/pushTicket', usr.pushTicket)
router.post('/registerTicket', usr.registerTicket)
export default router