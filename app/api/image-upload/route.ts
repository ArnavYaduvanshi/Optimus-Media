import { NextRequest,NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import{auth} from '@clerk/nextjs/server'



    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    interface CloudinaryUploadResult {
        public_id: string;
        [key:string]: any;
    }

    export async function POST(request: NextRequest) {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        try {
            const formData = await request.formData();
            const file = formData.get('file') as File;

            if (!file) {
                return NextResponse.json({ error: 'File is required' }, { status: 400 });
            }

            // Convert File to Buffer
            const buffer = Buffer.from(await file.arrayBuffer());

            const result= await new Promise<CloudinaryUploadResult>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "next-cloudinary-uploads" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result as CloudinaryUploadResult);
                    }
                );
                uploadStream.end(buffer);
            })
            return NextResponse.json(
                {
                    publicId: result.public_id,
                },
                { status: 200 }
            )
        } catch (error) {
            console.error('Upload error:', error);
            return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
        }



    
    
    }
