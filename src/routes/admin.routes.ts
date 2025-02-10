import { Router } from 'express'
const router = Router()

import *as adm from '../controllers/admin'


router.get('/getTeamInfo',adm.getTeamInfo)
router.post('/updateTeamInfo',adm.updateTeamInfo)
router.post('/loginAdmin',adm.loginAdmin)
router.get('/getAllEventUsers',adm.getAllEventUsers)


export default router