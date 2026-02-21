import slugify from 'slugify';
import { prisma } from '../config/prisma.js';



export const generateSlug = async (title: string) => {
    let baseSlug = slugify.default(title, { lower: true, strict: true });
    let slug = baseSlug;

    const existing = await prisma.event.findUnique({
        where: {slug}
    });

    if(existing){
        const random = Math.random().toString(36).substring(2, 6);
        slug = `${baseSlug}-${random}`;
    }

    return slug;
}
