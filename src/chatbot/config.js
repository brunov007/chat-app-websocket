import AssistantV2 from 'ibm-watson/assistant/v2.js'
import {IamAuthenticator} from 'ibm-watson/auth/index.js'

export default class Chatbot{
    constructor(){
        this.assistant = new AssistantV2({
            version: '2022-03-24',
            authenticator: new IamAuthenticator({ 
                apikey: String(process.env.IAM_API_KEY)
            }),
            serviceUrl: String(process.env.ASSISTANT_URL)
        }) 
    }

    async sendMessage(message, sessionID, callback){

        let sessionWatsonID;

        if(sessionID == null){
            const sessionReponse = await this.createSession()
            sessionWatsonID = sessionReponse.result.session_id
        }else{
            sessionWatsonID = sessionID
        }

        const watsonMessageResponse = await this.assistant.message({
            assistantId: String(process.env.ASSISTANT_ID),
            sessionId: sessionWatsonID,
            context: {
                global: {
                    system: {
                        user_id: 1 //change to user.id if available
                    }
                }
            },
            input: {'text': message},
        })

        if(watsonMessageResponse.status === 200 ||
            watsonMessageResponse.status === 201 ||
            watsonMessageResponse.status === 202){

            const genericResponse = watsonMessageResponse.result.output.generic

            let botMessages = genericResponse.map(message => {
                switch (message.response_type) {
                    case "option": return this.modifyText(message)
                    case "text": return message.text
                }
            })

            callback({
                message:'ok',
                sessionID: sessionWatsonID,
                botMessage: botMessages
            })

        }else{
            callback({
                message:'fail',
                sessionID: sessionWatsonID,
                botMessage: watsonMessageResponse.message
            })
        } 
    }

    modifyText(message){
        let messageModify = message.title + "\n"

        message.options.forEach(item => messageModify += (item.label) + "\n")

        return messageModify
    }

    async deleteSession(){
        return await this.assistant.deleteSession({
            assistantId:String(process.env.ASSISTANT_ID)
        })
    }
}