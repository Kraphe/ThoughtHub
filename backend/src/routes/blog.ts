import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
// import {SignupInput} from '@kraphe/common'
export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    }, 
    Variables: {
        userId: string;
    }
}>();

blogRouter.use("/*", async (c, next) => {
    
	const header = c.req.header("authorization") || "";
	const token = header.split(" ")[1]

	try {
		const response = await verify(token, c.env.JWT_SECRET);
		if (response.id) {
			//@ts-ignore
			c.set("userId", response.id);
			await next()
		} else {
			c.status(403);
			return c.json({ error: "unauthorized" })
		}
	} catch (e) {
		c.status(403);
		return c.json({ error: "unauthorized" })
	}

});


blogRouter.post('/', async (c) => {
	const userId = c.get('userId');
	console.log(userId);
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	const post = await prisma.post.create({
		data: {
			title: body.title,
			content: body.content,
			authorId: userId
		}
	});
	return c.json({
		id: post.id
	});
})

blogRouter.put('/', async (c) => {
	const userId = c.get('userId');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	prisma.post.update({
		where: {
			id: body.id,
			authorId: userId
		},
		data: {
			title: body.title,
			content: body.content
		}
	});

	return c.text('updated post');
});


blogRouter.get('/bulk', async (c) => {
	// console.log("*******************************************")
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
	
	try {
		const posts = await prisma.post.findMany({
			select: {
				content: true,
				title: true,
				id: true,
				author: {
					select: {
						name: true
					}
				}
			}
		});
		// console.log(posts);
		return c.json({ posts });
	} catch (e) {
		c.status(403);
		return c.json({ msg: "no middleware" });
	}
	
})

blogRouter.get('/:id', async (c) => {
	const id = c.req.param('id');
	console.log(id);
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
	
	const post = await prisma.post.findUnique({
		where: {
			id
		},
		select: {
			content: true,
			title: true,
			id:true,
			author: {
				select: {
					name: true
				}
			}
		}

	});
	// console.log(post);
	return c.json({post});
})

