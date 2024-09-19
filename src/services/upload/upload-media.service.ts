import { CLOUDINARY_CONFIG } from "src/config/env.config";

const streamifier = require('streamifier');

const cloudinary = require('cloudinary').v2;

function secureUrl(url: string) {
    let splitted = url.slice(4, url.length);
    return 'https' + splitted;
}

function generateThumbnail(url: string): string {
    let base = url.slice(0, url.length - 3);
    return base + 'jpg';
}

export interface DataToPush {
    link: string;
    index: number;
    thumbnail?: string;
}

export class UploadMediaService {
    async uploadMedia(files: Array<Express.Multer.File>, id: string, category: string, addWatermark = true) {
        cloudinary.config(CLOUDINARY_CONFIG);


        if (files) {
            try {
                let filesResult: DataToPush[] = [];
                let loopCount = 0;


                for (const file of files) {
                    loopCount += 1;

                    let mainFile = file;

                    let resourceType = 'image';

                    if (mainFile.mimetype === 'video/mp4') {
                        resourceType = 'video';
                    } else if (mainFile.mimetype.includes('audio') === true) {
                        resourceType = 'video';
                    }

                    try {
                        const result: any = await new Promise((resolve, reject) => {
                            const upload = cloudinary.uploader.upload_stream(
                                {
                                    resource_type: resourceType,
                                    public_id: `${category}/${id + '__' + loopCount}`,
                                },
                                (error: any, result: any) => {
                                    if (error) return reject(error);
                                    resolve(result);
                                });
                            streamifier.createReadStream(file.buffer).pipe(upload);
                        });

                        let format = 'jpg';

                        if (mainFile.mimetype === 'video/mp4') {
                            format = 'mp4';
                        }

                        let resourceUrl: string;

                        if (mainFile.mimetype.includes('audio') === false && addWatermark === true) {
                            resourceUrl = cloudinary.url(result.public_id, {
                                resource_type: resourceType,
                                format: format,
                                transformation: [{ overlay: 'logo_nkpr3a', gravity: 'north_east', y: 25, x: 60 }],
                            });
                        } else {
                            resourceUrl = result.url;
                        }

                        let dataToPush: DataToPush = {
                            link: secureUrl(resourceUrl),
                            index: loopCount,
                        };

                        if (mainFile.mimetype.includes('video') === true) {
                            dataToPush.thumbnail = generateThumbnail(secureUrl(resourceUrl));
                        }

                        filesResult.push(dataToPush);


                    } catch (error) {
                        console.log('error here')
                        console.log(error)
                    }
                }

                return filesResult;
            } catch (error) {
                return {
                    success: false,
                    message: 'Error occured',
                    link: null,
                };
            }
        } else {
            return {
                success: false,
                message: 'No image',
                link: null,
            };
        }
    };

}
