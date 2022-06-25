import {
    Request, Response, Router
  } from 'express'
import agora from 'agora-access-token'
import dotenv from 'dotenv'; const { RtcTokenBuilder, RtcRole } = agora

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` })
const appID = process.env.APP_ID || ''
const appCertificate = process.env.APP_CERTIFICATE || ''
const role = RtcRole.PUBLISHER
const expirationTimeInSeconds = 3600
const currentTimestamp = Math.floor(Date.now() / 1000)
const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds

class VideocallRoutes {
    public router: Router

    constructor () {
        this.router = Router()
        this.routes() // This has to be written here so that the method can actually be configured when called externally.
    }

    public async getAgoraToken (req: Request, res: Response) : Promise<void> {
        const { channelName } = req.params
        console.log(channelName)
        const tokenAg = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, 0, role, privilegeExpiredTs)
        res.status(200).send({ rtcToken: tokenAg })
        console.log(tokenAg)
    }

    routes () {
        this.router.get('/:channelName', this.getAgoraToken)
    }
}
const videocallRoutes = new VideocallRoutes()

export default videocallRoutes.router
