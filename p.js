import {z,ZodError} from 'zod'

const da=z.object({
    name:z.string(),
    age:z.number().min(18),
    email:z.string().email()
})

const result=da.safeParse({
    name:"alankrit",
    age:43,
    email:"alankrit@email.com"
})
console.log(result.error.format());