import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
import { Buffer } from 'buffer';
// import { signupInput, signinInput } from "@kraphe/common";
import z from 'zod';

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    }
}>();
export async function hashFunction(message:string) : Promise<string> {
	const encodedMsg = new TextEncoder().encode(message);
	const msgDigest = await crypto.subtle.digest(
	  {
		name: "SHA-256",
	  },
	  encodedMsg
	);
	  const base64String = Buffer.from(msgDigest).toString('base64');
	return base64String;
  }

userRouter.get('/',async(c)=>{
	return c.json({msg:"meenen"});
})



userRouter.post('/signup', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const signupInput = z.object({
		email: z.string().email(),
		password: z.string().min(6),
		name: z.string().optional(),
	})
	const body= await c.req.json();
	const validate = signupInput.safeParse(body);

	if(validate.error)
		{
			console.log(body);
			c.status(403);
			const error=validate.error.issues[0].message;
			if(error==="Required")
			return c.json({error:"All Input fields required"});
		    if(error.includes('6'))
            return c.json({error:"Atleast 6 digit password"});
			return c.json({error: error});
		}


		const isExist = await prisma.user.findUnique({
			where: {
				email: body.email
			}
		});
	
		if (isExist) {
			c.status(403);
			return c.json({ error: "user with this email already exist" });
		}
	const hashedPass = await hashFunction(body.password);
	try {
		const user = await prisma.user.create({
			data: {
				email: body.email,
				password: hashedPass,
				name:body.name
			}
		});
		const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
		return c.json({ jwt });
	} catch(e) {
		c.status(403);
		return c.json({ error: "Error while signup"});
	}
})


userRouter.post('/signin', async (c) => {
	// return c.json(c);
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();

	const signinInput = z.object({
		email: z.string().email(),
		password: z.string()
	})
	console.log(body);
	const validate = signinInput.safeParse(body);
	if(validate.error)
		{
			c.status(403);
			return c.json({error: "Fill all input fields correctly"});
		}
	const user = await prisma.user.findUnique({
		where: {
			email: body.email
		}
	});

	if (!user) {
		c.status(403);
		return c.json({ error: "user not found" });
	}

	const hashedPass = await hashFunction(body.password);
	if (user.password != hashedPass) {
		c.status(403);
		return c.json({ error: "Incorrect Password" });
	  }

	const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
	return c.json({ jwt });
})
