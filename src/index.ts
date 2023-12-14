import { Hono } from 'hono'
import {streamSSE} from 'hono/streaming'

const app = new Hono()
let id = 0


app.get('/', (c) => c.text('Hello Hono!'))
app.get('/sse', async(c)=> {
    return streamSSE(c, async(stream) => {
        while(true){
            const message = `It is ${new Date().toISOString()}`
            await stream.writeSSE({data: message, event:'time-update', id: String(id++)})
            await stream.sleep(1000)
        }
    })
})

export default app
