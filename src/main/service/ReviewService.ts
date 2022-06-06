import {Review} from '@prisma/client';

export default class ReviewService {

    prisma: any;

    constructor(prisma: any) {
        this.prisma = prisma;
    }

    addReview = async(comment: String, rating: number, productDescriptionId:number, userId: number):Promise<Review>=>{
        const createdReview = await this.prisma.review.create({
            data:{
                comment:comment,
                rating: rating,
                productDescription:{
                    connect:{
                        id: productDescriptionId
                    }
                },
                user:{
                    connect:{
                        id: userId
                    }
                }
            }
        });

        await this.updateRating(productDescriptionId);

        return createdReview;
    }

    getRating = async(productDescriptionId: number)=>{
        return await this.prisma.productDescription.findFirst({
            where:{
                id:Number(productDescriptionId)
            },
            select:{
                rating: true
            }
        })
    }

    calculateRating = (reviews: Review[]): number =>{
        const sum= reviews.reduce((acc: number, curr: Review)=>{
            return acc + curr.rating
        },0)

        return sum/reviews.length
    }

    updateRating = async(productDescriptionId: number)=>{
        const productDescription= await this.prisma.productDescription.findFirst({
            where:{
                id:Number(productDescriptionId)
            },
            include:{
                reviews: true
            }
        })

        const newRating = this.calculateRating(productDescription.reviews)

        await this.prisma.productDescription.update({
            where:{
                id:Number(productDescriptionId)
            },
            data:{
                rating: newRating
            }
        })
    }

}