import { NextRequest,NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import{auth} from '@clerk/nextjs/server'
import { PrismaClient } from "@/app/generated/prisma";


const prisma = new PrismaClient();



    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    interface CloudinaryUploadResult {
        public_id: string;
        bytes: number;
        duration?: number;
        [key:string]: any;
    }

    export async function POST(request: NextRequest) {
        //todo to check user
        
        try {
            if(
            !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
            !process.env.CLOUDINARY_API_KEY ||
            !process.env.CLOUDINARY_API_SECRET
        ){
            return NextResponse.json({ error: 'Cloudinary configuration is missing' }, { status: 500 });
        }
            const formData = await request.formData();
            const file = formData.get('file') as File;
            const title = formData.get('title') as string;
            const description = formData.get('description') as string;
            const originalSize= formData.get('originalSize') as string;


            if (!file) {
                return NextResponse.json({ error: 'File is required' }, { status: 400 });
            }

            // Convert File to Buffer
            const buffer = Buffer.from(await file.arrayBuffer());

            const result= await new Promise<CloudinaryUploadResult>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: "video",
                        folder: "video-uploads",
                        transformation:[
                            { quality: "auto" },
                            { fetch_format: "auto" }
                        ]


                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result as CloudinaryUploadResult);
                    }
                );
                uploadStream.end(buffer);
            })
           const video=await prisma.video.create({
                data: {
                    title,
                    description,
                    orginalSize: originalSize,
                    publicId: result.public_id,
                    compressedSize: String(result.bytes),
                    duration: result.duration || 0,

                }
            })
            return NextResponse.json(video)

        } catch (error) {
            console.error('Upload video failed:', error);
            return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
        } finally{
            await prisma.$disconnect();
        }



    
    
    }
