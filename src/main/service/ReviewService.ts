import {Review} from '@prisma/client';
import {Context} from "../../resources/Context";

interface CreateReview {
    comment: string
    rating: number
    productDescriptionId:number
    userId: number
}

export default class ReviewService {

    addReview = async(review: CreateReview, context: Context):Promise<Review>=>{
        const createdReview = await context.prisma.review.create({
            data:{
                comment: review.comment,
                rating: review.rating,
                productDescription:{
                    connect:{
                        id: review.productDescriptionId
                    }
                },
                user:{
                    connect:{
                        id: review.userId
                    }
                }
            }
        });

        await this.updateRating(review.productDescriptionId, context);

        return createdReview;
    }

    getRating = async(productDescriptionId: number, context: Context)=>{
        return await context.prisma.productDescription.findFirst({
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

        if(reviews.length==0){
            return 0;
        }
        return sum/reviews.length
    }

    updateRating = async(productDescriptionId: number, context: Context)=>{
        const productDescription = await context.prisma.productDescription.findFirst({
            where:{
                id:Number(productDescriptionId)
            },
            include:{
                reviews: true
            }
        })

        // @ts-ignore
        const newRating = this.calculateRating(productDescription.reviews)

        await context.prisma.productDescription.update({
            where:{
                id:Number(productDescriptionId)
            },
            data:{
                rating: newRating
            }
        })
    }

    deleteReviews= async (context: Context): Promise<any> => {
        return await context.prisma.review.deleteMany({})
    }

}